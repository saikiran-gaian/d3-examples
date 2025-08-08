import * as d3 from 'd3';
import { ChartSchema, ChartType, MarkConfig, ScaleConfig } from '../types/chart-schema';

export class ChartRenderer {
  private container: d3.Selection<SVGElement, unknown, null, undefined>;
  private schema: ChartSchema;
  private scales: Map<string, any> = new Map();
  private axes: Map<string, any> = new Map();
  private data: any[] = [];

  constructor(container: SVGElement, schema: ChartSchema) {
    this.container = d3.select(container);
    this.schema = schema;
  }

  async render(): Promise<void> {
    // Clear previous content
    this.container.selectAll('*').remove();

    // Load and process data
    await this.loadData();
    
    // Setup dimensions
    this.setupDimensions();
    
    // Create scales
    this.createScales();
    
    // Create axes
    this.createAxes();
    
    // Render marks based on chart type
    await this.renderMarks();
    
    // Add legend if specified
    this.renderLegend();
    
    // Add interactions
    this.addInteractions();
    
    // Add animations
    this.addAnimations();
  }

  private async loadData(): Promise<void> {
    const { source, transforms = [] } = this.schema.data;
    
    let data: any[];
    
    switch (source.type) {
      case 'inline':
        data = source.data as any[];
        break;
      case 'url':
        data = await d3.json(source.url!);
        break;
      case 'file':
        // Handle different file formats
        if (source.url?.endsWith('.csv')) {
          data = await d3.csv(source.url);
        } else if (source.url?.endsWith('.tsv')) {
          data = await d3.tsv(source.url);
        } else {
          data = await d3.json(source.url!);
        }
        break;
      case 'generated':
        data = this.generateData(source.params || {});
        break;
      default:
        throw new Error(`Unsupported data source type: ${source.type}`);
    }

    // Apply transforms
    this.data = this.applyTransforms(data, transforms);
  }

  private generateData(params: Record<string, any>): any[] {
    // Generate synthetic data based on parameters
    const { count = 100, type = 'random' } = params;
    const data = [];
    
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'random':
          data.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            category: `Category ${Math.floor(Math.random() * 5) + 1}`
          });
          break;
        case 'timeseries':
          data.push({
            date: new Date(2020, 0, i),
            value: Math.random() * 100 + Math.sin(i * 0.1) * 20
          });
          break;
        case 'hierarchical':
          // Generate hierarchical data structure
          break;
      }
    }
    
    return data;
  }

  private applyTransforms(data: any[], transforms: any[]): any[] {
    let result = data;
    
    for (const transform of transforms) {
      switch (transform.type) {
        case 'filter':
          result = result.filter(transform.params.predicate);
          break;
        case 'sort':
          result = result.sort((a, b) => {
            const field = transform.params.field;
            const order = transform.params.order || 'ascending';
            const aVal = a[field];
            const bVal = b[field];
            return order === 'ascending' ? d3.ascending(aVal, bVal) : d3.descending(aVal, bVal);
          });
          break;
        case 'group':
          result = Array.from(d3.group(result, d => d[transform.params.field]));
          break;
        case 'stack':
          const stack = d3.stack()
            .keys(transform.params.keys)
            .value((d: any, key: string) => d[key] || 0);
          result = stack(result);
          break;
        case 'bin':
          const histogram = d3.bin()
            .domain(d3.extent(result, d => d[transform.params.field]) as [number, number])
            .thresholds(transform.params.thresholds || 10);
          result = histogram(result.map(d => d[transform.params.field]));
          break;
      }
    }
    
    return result;
  }

  private setupDimensions(): void {
    const { width, height, margin } = this.schema.dimensions;
    
    this.container
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    // Create main group with margins
    this.container.append('g')
      .attr('class', 'chart-content')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  }

  private createScales(): void {
    const { scales } = this.schema;
    const { width, height, margin } = this.schema.dimensions;
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales based on configuration
    Object.entries(scales).forEach(([name, config]) => {
      const scale = this.createScale(config, name, innerWidth, innerHeight);
      this.scales.set(name, scale);
    });
  }

  private createScale(config: ScaleConfig, name: string, width: number, height: number): any {
    let scale: any;
    
    switch (config.type) {
      case 'linear':
        scale = d3.scaleLinear();
        break;
      case 'log':
        scale = d3.scaleLog();
        break;
      case 'sqrt':
        scale = d3.scaleSqrt();
        break;
      case 'pow':
        scale = d3.scalePow().exponent(config.exponent || 1);
        break;
      case 'time':
        scale = d3.scaleTime();
        break;
      case 'utc':
        scale = d3.scaleUtc();
        break;
      case 'ordinal':
        scale = d3.scaleOrdinal();
        break;
      case 'band':
        scale = d3.scaleBand();
        break;
      case 'point':
        scale = d3.scalePoint();
        break;
      case 'sequential':
        scale = d3.scaleSequential();
        break;
      case 'diverging':
        scale = d3.scaleDiverging();
        break;
      case 'threshold':
        scale = d3.scaleThreshold();
        break;
      default:
        scale = d3.scaleLinear();
    }

    // Configure domain
    if (config.domain) {
      scale.domain(config.domain);
    } else {
      // Auto-detect domain from data
      const field = this.getFieldForScale(name);
      if (field) {
        const extent = d3.extent(this.data, d => d[field]);
        scale.domain(extent);
      }
    }

    // Configure range
    if (config.range) {
      scale.range(config.range);
    } else {
      // Default ranges based on scale name
      switch (name) {
        case 'x':
          scale.range([0, width]);
          break;
        case 'y':
          scale.range([height, 0]);
          break;
        case 'color':
          if (config.scheme) {
            scale.range(d3[`scheme${config.scheme}` as keyof typeof d3] as any);
          }
          break;
        case 'size':
          scale.range([1, 100]);
          break;
      }
    }

    // Apply additional configurations
    if (config.nice && 'nice' in scale) {
      scale.nice();
    }
    
    if (config.clamp && 'clamp' in scale) {
      scale.clamp(config.clamp);
    }
    
    if (config.padding !== undefined && 'padding' in scale) {
      scale.padding(config.padding);
    }

    return scale;
  }

  private getFieldForScale(scaleName: string): string | null {
    // Find the field that maps to this scale
    for (const field of this.schema.data.fields) {
      if (field.scale === scaleName || field.role === scaleName) {
        return field.name;
      }
    }
    return null;
  }

  private createAxes(): void {
    const { axes } = this.schema;
    if (!axes) return;

    const content = this.container.select('.chart-content');
    const { height, margin } = this.schema.dimensions;
    const innerHeight = height - margin.top - margin.bottom;

    // X axis
    if (axes.x?.show) {
      const xScale = this.scales.get('x');
      if (xScale) {
        const xAxis = d3.axisBottom(xScale);
        this.configureAxis(xAxis, axes.x);
        
        content.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${innerHeight})`)
          .call(xAxis);
      }
    }

    // Y axis
    if (axes.y?.show) {
      const yScale = this.scales.get('y');
      if (yScale) {
        const yAxis = d3.axisLeft(yScale);
        this.configureAxis(yAxis, axes.y);
        
        content.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);
      }
    }
  }

  private configureAxis(axis: any, config: any): void {
    if (config.ticks) {
      axis.ticks(config.ticks);
    }
    if (config.tickSize !== undefined) {
      axis.tickSize(config.tickSize);
    }
    if (config.tickFormat) {
      axis.tickFormat(config.tickFormat);
    }
    if (config.tickValues) {
      axis.tickValues(config.tickValues);
    }
  }

  private async renderMarks(): Promise<void> {
    const content = this.container.select('.chart-content');
    
    for (const mark of this.schema.marks) {
      await this.renderMark(content, mark);
    }
  }

  private async renderMark(container: any, mark: MarkConfig): Promise<void> {
    const { type, encoding, style = {} } = mark;
    
    switch (type) {
      case 'circle':
        this.renderCircles(container, encoding, style);
        break;
      case 'rect':
      case 'bar':
        this.renderRects(container, encoding, style);
        break;
      case 'line':
        this.renderLines(container, encoding, style);
        break;
      case 'area':
        this.renderAreas(container, encoding, style);
        break;
      case 'arc':
      case 'pie':
        this.renderArcs(container, encoding, style);
        break;
      case 'text':
        this.renderText(container, encoding, style);
        break;
      case 'path':
        this.renderPaths(container, encoding, style);
        break;
      case 'geoshape':
        this.renderGeoShapes(container, encoding, style);
        break;
      default:
        console.warn(`Unsupported mark type: ${type}`);
    }
  }

  private renderCircles(container: any, encoding: any, style: any): void {
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');
    const colorScale = this.scales.get('color');
    const sizeScale = this.scales.get('size');

    container.append('g')
      .selectAll('circle')
      .data(this.data)
      .join('circle')
      .attr('cx', (d: any) => xScale ? xScale(d[encoding.x?.field]) : 0)
      .attr('cy', (d: any) => yScale ? yScale(d[encoding.y?.field]) : 0)
      .attr('r', (d: any) => {
        if (sizeScale && encoding.size?.field) {
          return sizeScale(d[encoding.size.field]);
        }
        return style.radius || 3;
      })
      .attr('fill', (d: any) => {
        if (colorScale && encoding.color?.field) {
          return colorScale(d[encoding.color.field]);
        }
        return style.fill || 'steelblue';
      })
      .attr('opacity', style.opacity || 1);
  }

  private renderRects(container: any, encoding: any, style: any): void {
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');
    const colorScale = this.scales.get('color');

    container.append('g')
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', (d: any) => xScale ? xScale(d[encoding.x?.field]) : 0)
      .attr('y', (d: any) => yScale ? yScale(d[encoding.y?.field]) : 0)
      .attr('width', (d: any) => {
        if (xScale && 'bandwidth' in xScale) {
          return xScale.bandwidth();
        }
        return style.width || 20;
      })
      .attr('height', (d: any) => {
        const y0 = yScale ? yScale(0) : 0;
        const y1 = yScale ? yScale(d[encoding.y?.field]) : 0;
        return Math.abs(y0 - y1);
      })
      .attr('fill', (d: any) => {
        if (colorScale && encoding.color?.field) {
          return colorScale(d[encoding.color.field]);
        }
        return style.fill || 'steelblue';
      });
  }

  private renderLines(container: any, encoding: any, style: any): void {
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');
    const colorScale = this.scales.get('color');

    const line = d3.line<any>()
      .x((d: any) => xScale ? xScale(d[encoding.x?.field]) : 0)
      .y((d: any) => yScale ? yScale(d[encoding.y?.field]) : 0);

    if (style.curve) {
      line.curve(d3[style.curve as keyof typeof d3] as any);
    }

    // Group data if needed for multiple lines
    let groups: [string, any[]][];
    if (encoding.color?.field) {
      groups = Array.from(d3.group(this.data, d => d[encoding.color.field]));
    } else {
      groups = [['default', this.data]];
    }

    container.append('g')
      .selectAll('path')
      .data(groups)
      .join('path')
      .attr('d', ([, values]) => line(values))
      .attr('fill', 'none')
      .attr('stroke', ([key]) => {
        if (colorScale) {
          return colorScale(key);
        }
        return style.stroke || 'steelblue';
      })
      .attr('stroke-width', style.strokeWidth || 2);
  }

  private renderAreas(container: any, encoding: any, style: any): void {
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');

    const area = d3.area<any>()
      .x((d: any) => xScale ? xScale(d[encoding.x?.field]) : 0)
      .y0(yScale ? yScale(0) : 0)
      .y1((d: any) => yScale ? yScale(d[encoding.y?.field]) : 0);

    container.append('path')
      .datum(this.data)
      .attr('d', area)
      .attr('fill', style.fill || 'steelblue')
      .attr('opacity', style.opacity || 0.7);
  }

  private renderArcs(container: any, encoding: any, style: any): void {
    const colorScale = this.scales.get('color');
    const radius = Math.min(this.schema.dimensions.width, this.schema.dimensions.height) / 2 - 40;

    const pie = d3.pie<any>()
      .value((d: any) => d[encoding.angle?.field || encoding.y?.field]);

    const arc = d3.arc<any>()
      .innerRadius(style.innerRadius || 0)
      .outerRadius(radius);

    const arcs = pie(this.data);

    container.append('g')
      .attr('transform', `translate(${this.schema.dimensions.width / 2}, ${this.schema.dimensions.height / 2})`)
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d: any, i: number) => {
        if (colorScale && encoding.color?.field) {
          return colorScale(d.data[encoding.color.field]);
        }
        return d3.schemeCategory10[i % 10];
      });
  }

  private renderText(container: any, encoding: any, style: any): void {
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');

    container.append('g')
      .selectAll('text')
      .data(this.data)
      .join('text')
      .attr('x', (d: any) => xScale ? xScale(d[encoding.x?.field]) : 0)
      .attr('y', (d: any) => yScale ? yScale(d[encoding.y?.field]) : 0)
      .text((d: any) => d[encoding.text?.field])
      .attr('font-size', style.fontSize || 12)
      .attr('font-family', style.fontFamily || 'sans-serif')
      .attr('text-anchor', style.textAlign || 'middle')
      .attr('fill', style.fill || 'black');
  }

  private renderPaths(container: any, encoding: any, style: any): void {
    // Custom path rendering for complex shapes
    container.append('g')
      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr('d', (d: any) => d[encoding.path?.field || 'd'])
      .attr('fill', style.fill || 'none')
      .attr('stroke', style.stroke || 'black')
      .attr('stroke-width', style.strokeWidth || 1);
  }

  private renderGeoShapes(container: any, encoding: any, style: any): void {
    if (!this.schema.projections) return;

    const projection = this.createProjection();
    const path = d3.geoPath().projection(projection);

    container.append('g')
      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr('d', path)
      .attr('fill', style.fill || 'lightgray')
      .attr('stroke', style.stroke || 'white')
      .attr('stroke-width', style.strokeWidth || 0.5);
  }

  private createProjection(): any {
    const config = this.schema.projections!;
    let projection: any;

    switch (config.type) {
      case 'mercator':
        projection = d3.geoMercator();
        break;
      case 'albers':
        projection = d3.geoAlbers();
        break;
      case 'albersUsa':
        projection = d3.geoAlbersUsa();
        break;
      case 'orthographic':
        projection = d3.geoOrthographic();
        break;
      case 'stereographic':
        projection = d3.geoStereographic();
        break;
      case 'equalEarth':
        projection = d3.geoEqualEarth();
        break;
      default:
        projection = d3.geoMercator();
    }

    if (config.center) projection.center(config.center);
    if (config.rotate) projection.rotate(config.rotate);
    if (config.scale) projection.scale(config.scale);
    if (config.translate) projection.translate(config.translate);

    return projection;
  }

  private renderLegend(): void {
    const { legend } = this.schema;
    if (!legend?.show) return;

    // Implementation for legend rendering
    // This would create appropriate legend based on the scales used
  }

  private addInteractions(): void {
    const { interactions } = this.schema;
    if (!interactions) return;

    // Add zoom behavior
    if (interactions.zoom?.enabled) {
      const zoom = d3.zoom()
        .scaleExtent(interactions.zoom.scaleExtent || [1, 10])
        .on('zoom', (event) => {
          this.container.select('.chart-content')
            .attr('transform', event.transform);
        });

      this.container.call(zoom);
    }

    // Add brush behavior
    if (interactions.brush?.enabled) {
      const brush = d3.brush()
        .on('brush end', (event) => {
          // Handle brush selection
        });

      this.container.append('g')
        .attr('class', 'brush')
        .call(brush);
    }

    // Add hover effects
    if (interactions.hover?.enabled) {
      this.container.selectAll('.mark')
        .on('mouseover', function(event, d) {
          d3.select(this).style('opacity', 0.8);
        })
        .on('mouseout', function(event, d) {
          d3.select(this).style('opacity', 1);
        });
    }
  }

  private addAnimations(): void {
    const { animations } = this.schema;
    if (!animations) return;

    // Add entrance animations
    this.container.selectAll('.mark')
      .style('opacity', 0)
      .transition()
      .duration(animations.duration || 1000)
      .delay((d, i) => (animations.stagger || 0) * i)
      .style('opacity', 1);
  }

  // Public methods for updating the chart
  public updateData(newData: any[]): void {
    this.data = newData;
    this.render();
  }

  public updateSchema(newSchema: Partial<ChartSchema>): void {
    this.schema = { ...this.schema, ...newSchema };
    this.render();
  }

  public resize(width: number, height: number): void {
    this.schema.dimensions.width = width;
    this.schema.dimensions.height = height;
    this.render();
  }
}