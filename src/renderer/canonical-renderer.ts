import * as d3 from 'd3';
import { CanonicalChartSchema, LayerDefinition, MarkDefinition, EncodingChannels, ScaleDefinition } from '../types/canonical-schema';

/**
 * Universal Chart Renderer - No chart-type specific logic
 * Renders any chart based purely on the canonical schema
 */
export class CanonicalChartRenderer {
  private container: d3.Selection<SVGElement, unknown, null, undefined>;
  private schema: CanonicalChartSchema;
  private scales: Map<string, any> = new Map();
  private dataCache: Map<string, any[]> = new Map();
  private generators: Map<string, any> = new Map();
  private state: Map<string, any> = new Map();
  private simulation: any = null;

  constructor(container: SVGElement, schema: CanonicalChartSchema) {
    this.container = d3.select(container);
    this.schema = schema;
  }

  async render(): Promise<void> {
    try {
      // Clear previous content
      this.container.selectAll('*').remove();
      
      // Setup visual space
      this.setupVisualSpace();
      
      // Process data pipeline
      await this.processDataPipeline();
      
      // Create all scales
      this.createScales();
      
      // Create generators
      this.createGenerators();
      
      // Render layers in order
      await this.renderLayers();
      
      // Apply behaviors
      this.applyBehaviors();
      
      // Start animations
      this.startAnimations();
    } catch (error) {
      console.error('Rendering error:', error);
      this.renderError(error);
    }
  }

  private renderError(error: any): void {
    this.container.selectAll('*').remove();
    this.container.append('text')
      .attr('x', this.schema.space.width / 2)
      .attr('y', this.schema.space.height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'red')
      .text(`Error: ${error.message}`);
  }

  private setupVisualSpace(): void {
    const { space } = this.schema;
    
    this.container
      .attr('width', space.width)
      .attr('height', space.height)
      .attr('viewBox', `0 0 ${space.width} ${space.height}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    // Apply background styling
    if (space.background) {
      this.applyStyles(this.container, space.background);
    }

    // Setup coordinate systems
    if (space.coordinates) {
      space.coordinates.forEach(coord => {
        this.setupCoordinateSystem(coord);
      });
    }

    // Setup clipping paths
    if (space.clips) {
      const defs = this.container.append('defs');
      space.clips.forEach(clip => {
        this.createClipPath(defs, clip);
      });
    }
  }

  private setupCoordinateSystem(coord: any): void {
    const group = this.container.append('g')
      .attr('class', `coordinate-system-${coord.id}`);

    if (coord.transform) {
      const { translate, scale, rotate } = coord.transform;
      let transform = '';
      if (translate) transform += `translate(${translate[0]}, ${translate[1]}) `;
      if (scale) transform += `scale(${scale[0]}, ${scale[1]}) `;
      if (rotate) transform += `rotate(${rotate}) `;
      group.attr('transform', transform.trim());
    }
  }

  private async processDataPipeline(): Promise<void> {
    const { data } = this.schema;
    
    // Load source data
    let sourceData = await this.loadSourceData(data.source);
    
    // Store original data
    this.dataCache.set('source', sourceData);
    
    // Apply transforms sequentially
    let currentData = sourceData;
    if (data.transforms) {
      for (const transform of data.transforms) {
        currentData = await this.applyTransform(currentData, transform);
        
        // Cache intermediate results if named
        if (transform.output) {
          this.dataCache.set(transform.output, currentData);
        }
      }
    }
    
    // Store final processed data
    this.dataCache.set('main', currentData);
  }

  private async loadSourceData(source: any): Promise<any[]> {
    switch (source.type) {
      case 'inline':
        return Array.isArray(source.data) ? source.data : [source.data];
      
      case 'generated':
        return this.generateData(source.options || {});
      
      default:
        // For demo, return empty array
        return [];
    }
  }

  private generateData(options: any): any[] {
    const { count = 50, type = 'random', ...params } = options;
    const data = [];
    
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'random':
          data.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            category: `Category ${Math.floor(Math.random() * 5) + 1}`,
            value: Math.random() * 1000,
            index: i,
            id: `item-${i}`,
            group: Math.floor(Math.random() * 3) + 1,
            size: Math.random() * 20 + 5
          });
          break;
        
        case 'timeseries':
          data.push({
            date: new Date(2020, 0, i),
            value: Math.random() * 100 + Math.sin(i * 0.1) * 20,
            index: i,
            category: `Series ${Math.floor(i / 10) + 1}`
          });
          break;
        
        case 'network':
          if (i < 20) {
            data.push({
              id: `node-${i}`,
              group: Math.floor(i / 5) + 1,
              size: Math.random() * 10 + 5
            });
          }
          break;
        
        case 'hierarchy':
          // Generate hierarchical structure
          break;
        
        case 'alphabet':
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (i < 26) {
            data.push({
              letter: letters[i],
              frequency: Math.random() * 0.12 + 0.01
            });
          }
          break;
      }
    }
    
    return data;
  }

  private async applyTransform(data: any[], transform: any): Promise<any[]> {
    const { type, params } = transform;
    
    // Universal transform dispatcher - no chart-type logic
    switch (type) {
      case 'filter':
        return data.filter(params.predicate || (() => true));
      
      case 'sort':
        return data.sort(this.createComparator(params));
      
      case 'group':
        return Array.from(d3.group(data, d => this.getValue(d, params.by)));
      
      case 'stack':
        const stack = d3.stack()
          .keys(params.keys)
          .value((d: any, key: string) => this.getValue(d, key) || 0);
        return stack(data);
      
      case 'bin':
        const bin = d3.bin()
          .domain(params.domain || d3.extent(data, d => this.getValue(d, params.field)) as [number, number])
          .thresholds(params.thresholds || 10);
        return bin(data.map(d => this.getValue(d, params.field)));
      
      case 'hierarchy':
        const hierarchy = d3.hierarchy(data, params.children)
          .sum(params.value ? d => this.getValue(d, params.value) : null);
        if (params.sort) hierarchy.sort(params.sort);
        return hierarchy;
      
      case 'partition':
        const partition = d3.partition()
          .size(params.size || [2 * Math.PI, 100]);
        return partition(data);
      
      case 'treemap':
        const treemap = d3.treemap()
          .size(params.size || [400, 300])
          .padding(params.padding || 1);
        return treemap(data);
      
      case 'pack':
        const pack = d3.pack()
          .size(params.size || [400, 400])
          .padding(params.padding || 3);
        return pack(data);
      
      case 'force':
        return this.setupForceSimulation(data, params);
      
      case 'pie':
        const pie = d3.pie()
          .value(d => this.getValue(d, params.value || 'value'));
        if (params.sort === null) pie.sort(null);
        return pie(data);
      
      default:
        return data;
    }
  }

  private setupForceSimulation(data: any, params: any): any {
    const nodes = data.nodes || data;
    const links = data.links || [];
    
    this.simulation = d3.forceSimulation(nodes);
    
    if (params.forces) {
      Object.entries(params.forces).forEach(([forceType, forceParams]: [string, any]) => {
        let force: any;
        
        switch (forceType) {
          case 'link':
            force = d3.forceLink(links).id((d: any) => d.id);
            if (forceParams.distance) force.distance(forceParams.distance);
            if (forceParams.strength) force.strength(forceParams.strength);
            break;
          case 'manyBody':
            force = d3.forceManyBody();
            if (forceParams.strength) force.strength(forceParams.strength);
            break;
          case 'center':
            force = d3.forceCenter(forceParams.x || 0, forceParams.y || 0);
            break;
          case 'x':
            force = d3.forceX(forceParams.x || 0);
            if (forceParams.strength) force.strength(forceParams.strength);
            break;
          case 'y':
            force = d3.forceY(forceParams.y || 0);
            if (forceParams.strength) force.strength(forceParams.strength);
            break;
        }
        
        if (force) {
          this.simulation.force(forceType, force);
        }
      });
    }
    
    return { nodes, links };
  }

  private createScales(): void {
    Object.entries(this.schema.scales).forEach(([name, config]) => {
      const scale = this.createScale(config);
      this.scales.set(name, scale);
    });
  }

  private createScale(config: ScaleDefinition): any {
    // Get the base scale function
    const scaleFunction = this.getScaleFunction(config.type);
    let scale = scaleFunction();

    // Configure domain
    if (config.domain) {
      scale.domain(config.domain);
    } else if (config.domainFrom) {
      const data = this.dataCache.get(config.domainFrom.data) || this.dataCache.get('main') || [];
      const values = data.map(d => this.getValue(d, config.domainFrom!.field)).filter(v => v != null);
      let domain: any[];
      
      switch (config.domainFrom.method) {
        case 'extent':
          domain = d3.extent(values) as any[];
          break;
        case 'max':
          domain = [0, d3.max(values)];
          break;
        case 'min':
          domain = [d3.min(values), 0];
          break;
        case 'values':
          domain = Array.from(new Set(values));
          break;
        default:
          domain = config.domainFrom.transform ? 
            config.domainFrom.transform(values) : 
            d3.extent(values) as any[];
      }
      
      if (domain[0] !== undefined && domain[1] !== undefined) {
        scale.domain(domain);
      }
    }

    // Configure range
    if (config.range) {
      scale.range(config.range);
    }

    // Apply color schemes
    if (config.scheme && 'range' in scale) {
      const scheme = (d3 as any)[`scheme${config.scheme}`];
      if (scheme) {
        scale.range(Array.isArray(scheme) ? scheme : scheme[Math.min(scheme.length - 1, 9)]);
      }
    }

    // Apply interpolators
    if (config.interpolator && 'interpolator' in scale) {
      const interpolator = (d3 as any)[config.interpolator];
      if (interpolator) {
        scale.interpolator(interpolator);
      }
    }

    // Apply scale parameters
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (key in scale && typeof scale[key] === 'function') {
          scale[key](value);
        }
      });
    }

    // Apply modifiers
    if (config.nice && 'nice' in scale) {
      scale.nice(typeof config.nice === 'number' ? config.nice : undefined);
    }
    
    if (config.clamp && 'clamp' in scale) {
      scale.clamp(config.clamp);
    }
    
    if (config.reverse && 'range' in scale) {
      const range = scale.range();
      scale.range(range.slice().reverse());
    }

    return scale;
  }

  private getScaleFunction(type: string): () => any {
    const scaleMap: Record<string, () => any> = {
      'linear': () => d3.scaleLinear(),
      'log': () => d3.scaleLog(),
      'sqrt': () => d3.scaleSqrt(),
      'pow': () => d3.scalePow(),
      'time': () => d3.scaleTime(),
      'utc': () => d3.scaleUtc(),
      'ordinal': () => d3.scaleOrdinal(),
      'band': () => d3.scaleBand(),
      'point': () => d3.scalePoint(),
      'sequential': () => d3.scaleSequential(),
      'diverging': () => d3.scaleDiverging(),
      'threshold': () => d3.scaleThreshold(),
      'quantile': () => d3.scaleQuantile(),
      'quantize': () => d3.scaleQuantize(),
      'identity': () => d3.scaleIdentity(),
      'radial': () => d3.scaleRadial()
    };

    return scaleMap[type] || (() => d3.scaleLinear());
  }

  private createGenerators(): void {
    // Pre-create any generators needed by marks
    this.schema.layers.forEach((layer, index) => {
      if (layer.mark.generator) {
        const generator = this.createGenerator(layer.mark.generator);
        this.generators.set(layer.id || `layer-${index}`, generator);
      }
    });
  }

  private createGenerator(config: any): any {
    const { type, params = {}, curve, layout } = config;
    
    const generatorMap: Record<string, () => any> = {
      'line': () => {
        const line = d3.line();
        if (curve) line.curve((d3 as any)[curve] || d3.curveLinear);
        return line;
      },
      'area': () => {
        const area = d3.area();
        if (curve) area.curve((d3 as any)[curve] || d3.curveLinear);
        return area;
      },
      'arc': () => d3.arc(),
      'pie': () => d3.pie(),
      'stack': () => d3.stack(),
      'tree': () => d3.tree(),
      'cluster': () => d3.cluster(),
      'pack': () => d3.pack(),
      'treemap': () => d3.treemap(),
      'partition': () => d3.partition(),
      'chord': () => d3.chord(),
      'symbol': () => d3.symbol(),
      'path': () => d3.geoPath()
    };

    const generator = generatorMap[type]?.() || null;
    
    if (generator && params) {
      // Apply all parameters generically
      Object.entries(params).forEach(([key, value]) => {
        if (generator[key] && typeof generator[key] === 'function') {
          generator[key](value);
        }
      });
    }

    return generator;
  }

  private async renderLayers(): Promise<void> {
    // Sort layers by order
    const sortedLayers = [...this.schema.layers].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    for (const layer of sortedLayers) {
      await this.renderLayer(layer);
    }
  }

  private async renderLayer(layer: LayerDefinition): Promise<void> {
    // Check conditions
    if (layer.when && !this.evaluateCondition(layer.when)) {
      return;
    }

    // Get data for this layer
    const data = this.getLayerData(layer);
    
    // Create layer group
    const layerGroup = this.container.append('g')
      .attr('class', `layer ${layer.id || ''}`)
      .attr('data-layer-id', layer.id || '');

    // Apply layer styling
    if (layer.style) {
      this.applyStyles(layerGroup, layer.style);
    }

    // Apply clipping
    if (layer.clipPath) {
      layerGroup.attr('clip-path', `url(#${layer.clipPath})`);
    }

    // Apply blend mode
    if (layer.blendMode) {
      layerGroup.style('mix-blend-mode', layer.blendMode);
    }

    // Render the mark
    await this.renderMark(layerGroup, layer.mark, layer.encoding, data);
  }

  private getLayerData(layer: LayerDefinition): any[] {
    const dataRef = layer.data || 'main';
    return this.dataCache.get(dataRef) || [];
  }

  private async renderMark(
    container: any, 
    mark: MarkDefinition, 
    encoding: EncodingChannels, 
    data: any[]
  ): Promise<void> {
    const { type, params = {}, generator, groupBy, key } = mark;

    // Handle special mark types
    if (type === 'axis') {
      this.renderAxis(container, encoding, params);
      return;
    }

    if (type === 'grid') {
      this.renderGrid(container, encoding, params);
      return;
    }

    // Group data if specified
    let groups: Array<[string, any[]]>;
    if (groupBy && groupBy.length > 0) {
      const groupKey = (d: any) => groupBy.map(field => this.getValue(d, field)).join('-');
      groups = Array.from(d3.group(data, groupKey));
    } else {
      groups = [['default', data]];
    }

    // Render each group
    for (const [groupId, groupData] of groups) {
      await this.renderMarkGroup(container, type, params, generator, encoding, groupData, groupId, key);
    }
  }

  private renderAxis(container: any, encoding: any, params: any): void {
    const scaleName = encoding.scale?.value;
    const scale = this.scales.get(scaleName);
    if (!scale) return;

    const orient = params.orient || 'bottom';
    let axis: any;

    switch (orient) {
      case 'top': axis = d3.axisTop(scale); break;
      case 'bottom': axis = d3.axisBottom(scale); break;
      case 'left': axis = d3.axisLeft(scale); break;
      case 'right': axis = d3.axisRight(scale); break;
      default: axis = d3.axisBottom(scale);
    }

    if (params.ticks) axis.ticks(params.ticks);
    if (params.tickFormat) axis.tickFormat(params.tickFormat);
    if (params.tickSize) axis.tickSize(params.tickSize);

    const position = encoding.position?.value || [0, 0];
    container.append('g')
      .attr('class', `axis axis-${orient}`)
      .attr('transform', `translate(${position[0]}, ${position[1]})`)
      .call(axis);
  }

  private renderGrid(container: any, encoding: any, params: any): void {
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');
    const { width, height, margin = { top: 20, right: 20, bottom: 40, left: 40 } } = this.schema.space;
    
    const innerWidth = width - (margin.left || 0) - (margin.right || 0);
    const innerHeight = height - (margin.top || 0) - (margin.bottom || 0);

    const gridGroup = container.append('g')
      .attr('class', 'grid')
      .attr('stroke', params.stroke || '#e0e0e0')
      .attr('stroke-width', params.strokeWidth || 0.5)
      .attr('opacity', params.opacity || 0.5);

    // Vertical grid lines
    if (xScale && params.x !== false) {
      gridGroup.append('g')
        .selectAll('line')
        .data(xScale.ticks ? xScale.ticks() : xScale.domain())
        .join('line')
        .attr('x1', (d: any) => xScale(d))
        .attr('x2', (d: any) => xScale(d))
        .attr('y1', 0)
        .attr('y2', innerHeight);
    }

    // Horizontal grid lines
    if (yScale && params.y !== false) {
      gridGroup.append('g')
        .selectAll('line')
        .data(yScale.ticks ? yScale.ticks() : yScale.domain())
        .join('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', (d: any) => yScale(d))
        .attr('y2', (d: any) => yScale(d));
    }
  }

  private async renderMarkGroup(
    container: any,
    markType: string,
    params: any,
    generatorConfig: any,
    encoding: EncodingChannels,
    data: any[],
    groupId: string,
    keyFunction?: string | ((d: any) => string)
  ): Promise<void> {
    const markContainer = container.append('g')
      .attr('class', `mark-group mark-${markType}`)
      .attr('data-group', groupId);

    // Handle different mark patterns
    if (this.isPathMark(markType)) {
      await this.renderPathMark(markContainer, markType, generatorConfig, encoding, data, params);
    } else if (this.isShapeMark(markType)) {
      await this.renderShapeMarks(markContainer, markType, encoding, data, params, keyFunction);
    } else if (this.isTextMark(markType)) {
      await this.renderTextMarks(markContainer, encoding, data, params, keyFunction);
    } else {
      // Custom mark type - use generic approach
      await this.renderGenericMark(markContainer, markType, encoding, data, params, keyFunction);
    }
  }

  private isPathMark(type: string): boolean {
    return ['line', 'area', 'arc', 'path', 'geoshape', 'contour'].includes(type);
  }

  private isShapeMark(type: string): boolean {
    return ['circle', 'rect', 'ellipse', 'polygon', 'symbol', 'point'].includes(type);
  }

  private isTextMark(type: string): boolean {
    return ['text', 'label'].includes(type);
  }

  private async renderPathMark(
    container: any,
    markType: string,
    generatorConfig: any,
    encoding: EncodingChannels,
    data: any[],
    params: any
  ): Promise<void> {
    const generator = this.generators.get(container.attr('data-layer-id')) || 
                    (generatorConfig ? this.createGenerator(generatorConfig) : null);
    
    if (markType === 'line' && generator) {
      // Configure line generator
      if (encoding.x) generator.x((d: any) => this.getEncodedValue(d, encoding.x));
      if (encoding.y) generator.y((d: any) => this.getEncodedValue(d, encoding.y));
      
      const path = container.append('path')
        .datum(data)
        .attr('d', generator)
        .attr('fill', 'none');
      
      this.applyEncoding(path, encoding);
    } else if (markType === 'area' && generator) {
      // Configure area generator
      if (encoding.x) generator.x((d: any) => this.getEncodedValue(d, encoding.x));
      if (encoding.y) generator.y1((d: any) => this.getEncodedValue(d, encoding.y));
      if (encoding.y2) generator.y0((d: any) => this.getEncodedValue(d, encoding.y2));
      else generator.y0(this.scales.get('y')?.range?.()?.[0] || 0);
      
      const path = container.append('path')
        .datum(data)
        .attr('d', generator);
      
      this.applyEncoding(path, encoding);
    } else if (markType === 'arc') {
      // Handle arc/pie charts
      const pieData = data;
      
      container.selectAll('path')
        .data(pieData)
        .join('path')
        .attr('d', generator || d3.arc().innerRadius(0).outerRadius(100))
        .call(selection => this.applyEncoding(selection, encoding));
    }
  }

  private async renderShapeMarks(
    container: any,
    markType: string,
    encoding: EncodingChannels,
    data: any[],
    params: any,
    keyFunction?: string | ((d: any) => string)
  ): Promise<void> {
    const selection = container.selectAll(markType)
      .data(data, keyFunction)
      .join(markType);

    // Apply universal shape attributes
    this.applyShapeAttributes(selection, markType, encoding, params);
    this.applyEncoding(selection, encoding);
  }

  private async renderTextMarks(
    container: any,
    encoding: EncodingChannels,
    data: any[],
    params: any,
    keyFunction?: string | ((d: any) => string)
  ): Promise<void> {
    const selection = container.selectAll('text')
      .data(data, keyFunction)
      .join('text');

    this.applyEncoding(selection, encoding);
    
    // Set text content
    if (encoding.text) {
      selection.text((d: any) => this.getEncodedValue(d, encoding.text));
    }
  }

  private async renderGenericMark(
    container: any,
    markType: string,
    encoding: EncodingChannels,
    data: any[],
    params: any,
    keyFunction?: string | ((d: any) => string)
  ): Promise<void> {
    // Fallback for custom mark types
    const selection = container.selectAll(`.${markType}`)
      .data(data, keyFunction)
      .join('g')
      .attr('class', markType);

    this.applyEncoding(selection, encoding);
  }

  private applyShapeAttributes(
    selection: any, 
    markType: string, 
    encoding: EncodingChannels, 
    params: any
  ): void {
    // Universal attribute mapping based on mark type
    const attributeMap: Record<string, Record<string, string>> = {
      'circle': { x: 'cx', y: 'cy', size: 'r' },
      'rect': { x: 'x', y: 'y', width: 'width', height: 'height' },
      'ellipse': { x: 'cx', y: 'cy', width: 'rx', height: 'ry' },
      'line': { x: 'x1', y: 'y1', x2: 'x2', y2: 'y2' }
    };

    const attributes = attributeMap[markType] || {};
    
    Object.entries(attributes).forEach(([channel, attr]) => {
      const channelDef = encoding[channel as keyof EncodingChannels];
      if (channelDef) {
        selection.attr(attr, (d: any) => this.getEncodedValue(d, channelDef));
      }
    });

    // Apply default parameters
    Object.entries(params).forEach(([key, value]) => {
      selection.attr(key, value);
    });
  }

  private applyEncoding(selection: any, encoding: EncodingChannels): void {
    Object.entries(encoding).forEach(([channel, channelDef]) => {
      if (!channelDef) return;
      
      const attribute = this.getAttributeForChannel(channel);
      if (attribute) {
        selection.attr(attribute, (d: any) => this.getEncodedValue(d, channelDef));
      } else {
        // Handle style properties
        const styleProperty = this.getStylePropertyForChannel(channel);
        if (styleProperty) {
          selection.style(styleProperty, (d: any) => this.getEncodedValue(d, channelDef));
        }
      }
    });
  }

  private getAttributeForChannel(channel: string): string | null {
    const attributeMap: Record<string, string> = {
      'x': 'x', 'y': 'y', 'x2': 'x2', 'y2': 'y2',
      'cx': 'cx', 'cy': 'cy', 'r': 'r',
      'width': 'width', 'height': 'height',
      'color': 'fill', 'fill': 'fill',
      'stroke': 'stroke', 'strokeWidth': 'stroke-width',
      'opacity': 'opacity', 'strokeOpacity': 'stroke-opacity',
      'size': 'r', 'd': 'd',
      'startAngle': 'data-start-angle',
      'endAngle': 'data-end-angle',
      'innerRadius': 'data-inner-radius',
      'outerRadius': 'data-outer-radius'
    };
    
    return attributeMap[channel] || null;
  }

  private getStylePropertyForChannel(channel: string): string | null {
    const styleMap: Record<string, string> = {
      'fontSize': 'font-size',
      'fontWeight': 'font-weight',
      'fontFamily': 'font-family',
      'textAnchor': 'text-anchor'
    };
    
    return styleMap[channel] || null;
  }

  private getEncodedValue(data: any, channelDef: any): any {
    if (channelDef.value !== undefined) {
      return channelDef.value;
    }
    
    if (channelDef.field) {
      let value = this.getValue(data, channelDef.field);
      
      // Apply scale if specified
      if (channelDef.scale) {
        const scale = this.scales.get(channelDef.scale);
        if (scale) {
          value = scale(value);
        }
      }
      
      // Apply transforms
      if (channelDef.transform) {
        value = this.applyChannelTransforms(value, channelDef.transform);
      }
      
      return value;
    }
    
    return null;
  }

  private getValue(data: any, field: string): any {
    // Support nested field access with dot notation
    return field.split('.').reduce((obj, key) => obj?.[key], data);
  }

  private applyChannelTransforms(value: any, transforms: any[]): any {
    return transforms.reduce((val, transform) => {
      switch (transform.type) {
        case 'scale':
          return val * (transform.params?.factor || 1);
        case 'offset':
          return val + (transform.params?.offset || 0);
        case 'log':
          return Math.log(val);
        case 'sqrt':
          return Math.sqrt(val);
        case 'abs':
          return Math.abs(val);
        case 'negate':
          return -val;
        default:
          if (transform.expression && typeof transform.expression === 'function') {
            return transform.expression(val, data);
          }
          return val;
      }
    }, value);
  }

  private applyStyles(selection: any, styles: any): void {
    Object.entries(styles).forEach(([property, value]) => {
      if (this.isSVGAttribute(property)) {
        selection.attr(property, value);
      } else {
        selection.style(property, value);
      }
    });
  }

  private isSVGAttribute(property: string): boolean {
    const svgAttributes = new Set([
      'fill', 'stroke', 'stroke-width', 'stroke-opacity', 'fill-opacity',
      'opacity', 'transform', 'clip-path', 'mask', 'filter',
      'x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry',
      'd', 'points', 'x1', 'y1', 'x2', 'y2'
    ]);
    
    return svgAttributes.has(property);
  }

  private createComparator(params: any): (a: any, b: any) => number {
    const { field, order = 'ascending' } = params;
    
    return (a: any, b: any) => {
      const aVal = this.getValue(a, field);
      const bVal = this.getValue(b, field);
      
      return order === 'ascending' ? 
        d3.ascending(aVal, bVal) : 
        d3.descending(aVal, bVal);
    };
  }

  private evaluateCondition(condition: any): boolean {
    switch (condition.type) {
      case 'expression':
        return Boolean(condition.test);
      case 'function':
        return typeof condition.test === 'function' ? condition.test(this.state) : true;
      case 'data':
        const data = this.dataCache.get(condition.params?.data || 'main');
        return data && data.length > 0;
      default:
        return true;
    }
  }

  private applyBehaviors(): void {
    if (!this.schema.behaviors) return;
    
    this.schema.behaviors.forEach(behavior => {
      this.applyBehavior(behavior);
    });
  }

  private applyBehavior(behavior: any): void {
    const { type, target, params = {} } = behavior;
    
    // Get target elements
    const targets = target ? 
      this.container.selectAll(target) : 
      this.container;

    // Apply behavior based on type
    switch (type) {
      case 'zoom':
        const zoom = d3.zoom();
        if (params.scaleExtent) zoom.scaleExtent(params.scaleExtent);
        targets.call(zoom);
        break;
      
      case 'drag':
        const drag = d3.drag();
        targets.call(drag);
        break;
    }
  }

  private startAnimations(): void {
    if (!this.schema.animations) return;
    
    this.schema.animations.forEach(animation => {
      if (animation.trigger === 'load') {
        this.executeAnimationSequence(animation.sequence, animation.duration || 1000, animation.delay || 0, animation.easing || 'easeLinear');
      }
    });
  }

  private executeAnimationSequence(sequence: any[], duration: number, delay: number, easing: string): void {
    sequence.forEach((step, index) => {
      const stepDelay = delay + (step.delay || 0) + index * 100;
      const stepDuration = step.duration || duration;
      
      const targets = this.container.selectAll(step.target);
      
      targets.transition()
        .duration(stepDuration)
        .delay(stepDelay)
        .ease((d3 as any)[easing] || d3.easeLinear)
        .call((transition: any) => {
          Object.entries(step.properties).forEach(([prop, value]) => {
            if (this.isSVGAttribute(prop)) {
              transition.attr(prop, value);
            } else {
              transition.style(prop, value);
            }
          });
        });
    });
  }

  // Public API methods
  public updateData(newData: any[]): void {
    this.dataCache.set('main', newData);
    this.render();
  }

  public updateSchema(updates: Partial<CanonicalChartSchema>): void {
    this.schema = { ...this.schema, ...updates };
    this.render();
  }

  public getScale(name: string): any {
    return this.scales.get(name);
  }

  public getData(name: string = 'main'): any[] {
    return this.dataCache.get(name) || [];
  }
}