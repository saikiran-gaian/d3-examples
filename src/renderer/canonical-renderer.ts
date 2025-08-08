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

  constructor(container: SVGElement, schema: CanonicalChartSchema) {
    this.container = d3.select(container);
    this.schema = schema;
  }

  async render(): Promise<void> {
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
      
      case 'url':
        return this.loadFromUrl(source.url, source.format, source.options);
      
      case 'file':
        return this.loadFromUrl(source.url, source.format, source.options);
      
      case 'generated':
        return this.generateData(source.options || {});
      
      case 'computed':
        return this.computeData(source.options || {});
      
      default:
        throw new Error(`Unsupported data source type: ${source.type}`);
    }
  }

  private async loadFromUrl(url: string, format?: string, options?: any): Promise<any[]> {
    const inferredFormat = format || this.inferFormat(url);
    
    switch (inferredFormat) {
      case 'json':
        return d3.json(url);
      case 'csv':
        return d3.csv(url, options?.row);
      case 'tsv':
        return d3.tsv(url, options?.row);
      case 'topojson':
        const topology = await d3.json(url);
        return options?.feature ? 
          (topology as any).objects[options.feature] : 
          topology;
      default:
        return d3.json(url);
    }
  }

  private inferFormat(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'json';
  }

  private generateData(options: any): any[] {
    const { count = 100, type = 'random', ...params } = options;
    const data = [];
    
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'random':
          data.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            category: `Category ${Math.floor(Math.random() * 5) + 1}`,
            value: Math.random() * 1000,
            index: i
          });
          break;
        
        case 'timeseries':
          data.push({
            date: new Date(2020, 0, i),
            value: Math.random() * 100 + Math.sin(i * 0.1) * 20,
            index: i
          });
          break;
        
        case 'network':
          // Generate network data
          break;
        
        case 'hierarchy':
          // Generate hierarchical data
          break;
      }
    }
    
    return data;
  }

  private computeData(options: any): any[] {
    // Compute data from other data sources or state
    return [];
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
      
      case 'rollup':
        return Array.from(d3.rollup(data, params.reducer, d => this.getValue(d, params.by)));
      
      case 'stack':
        const stack = d3.stack()
          .keys(params.keys)
          .value((d: any, key: string) => this.getValue(d, key))
          .order(params.order ? d3[params.order as keyof typeof d3] as any : null)
          .offset(params.offset ? d3[params.offset as keyof typeof d3] as any : null);
        return stack(data);
      
      case 'bin':
        const bin = d3.bin()
          .domain(params.domain || d3.extent(data, d => this.getValue(d, params.field)) as [number, number])
          .thresholds(params.thresholds || 10);
        return bin(data.map(d => this.getValue(d, params.field)));
      
      case 'hierarchy':
        return d3.hierarchy(data, params.children)
          .sum(params.value ? d => this.getValue(d, params.value) : null)
          .sort(params.sort || null);
      
      case 'force':
        // Setup force simulation data
        return this.setupForceData(data, params);
      
      case 'projection':
        // Apply geographic projection
        return this.applyProjection(data, params);
      
      case 'contour':
        // Generate contour data
        return this.generateContours(data, params);
      
      case 'voronoi':
        // Generate Voronoi diagram
        return this.generateVoronoi(data, params);
      
      case 'delaunay':
        // Generate Delaunay triangulation
        return this.generateDelaunay(data, params);
      
      default:
        // Custom transform - execute if function provided
        if (params.transform && typeof params.transform === 'function') {
          return params.transform(data, params);
        }
        return data;
    }
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
      const data = this.dataCache.get(config.domainFrom.data) || this.dataCache.get('main');
      const values = data.map(d => this.getValue(d, config.domainFrom!.field));
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
      
      scale.domain(domain);
    }

    // Configure range
    if (config.range) {
      scale.range(config.range);
    }

    // Apply color schemes
    if (config.scheme && 'range' in scale) {
      const scheme = d3[`scheme${config.scheme}` as keyof typeof d3] as any;
      if (scheme) {
        scale.range(scheme);
      }
    }

    // Apply interpolators
    if (config.interpolator && 'interpolator' in scale) {
      const interpolator = d3[config.interpolator as keyof typeof d3] as any;
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
      'identity': () => d3.scaleIdentity()
    };

    return scaleMap[type] || (() => d3.scaleLinear());
  }

  private createGenerators(): void {
    // Pre-create any generators needed by marks
    this.schema.layers.forEach(layer => {
      if (layer.mark.generator) {
        const generator = this.createGenerator(layer.mark.generator);
        this.generators.set(layer.id || `layer-${Math.random()}`, generator);
      }
    });
  }

  private createGenerator(config: any): any {
    const { type, params = {}, curve, layout } = config;
    
    const generatorMap: Record<string, () => any> = {
      'line': () => {
        const line = d3.line();
        if (curve) line.curve(d3[curve as keyof typeof d3] as any);
        return line;
      },
      'area': () => {
        const area = d3.area();
        if (curve) area.curve(d3[curve as keyof typeof d3] as any);
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
      'sankey': () => (d3 as any).sankey?.() || null,
      'chord': () => d3.chord(),
      'force': () => d3.forceSimulation(),
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

    if (generator && layout) {
      // Apply layout parameters
      Object.entries(layout).forEach(([key, value]) => {
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
    // Universal mark rendering - no switch statements
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
    let pathData: string | null = null;
    
    if (generatorConfig) {
      const generator = this.generators.get(container.attr('data-layer-id')) || 
                      this.createGenerator(generatorConfig);
      
      // Configure generator with encoding
      this.configureGenerator(generator, encoding);
      
      // Generate path data
      if (markType === 'line' || markType === 'area') {
        pathData = generator(data);
      } else if (markType === 'arc') {
        // For pie charts, transform data first
        const pie = d3.pie().value((d: any) => this.getEncodedValue(d, encoding.angle || encoding.y));
        const arcs = pie(data);
        
        container.selectAll('path')
          .data(arcs)
          .join('path')
          .attr('d', generator)
          .call(selection => this.applyEncoding(selection, encoding, (d: any) => d.data));
        return;
      }
    } else if (encoding.path) {
      // Direct path data from encoding
      pathData = data.map(d => this.getEncodedValue(d, encoding.path)).join(' ');
    }

    if (pathData) {
      const path = container.append('path')
        .attr('d', pathData);
      
      this.applyEncoding(path, encoding, data[0]);
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

  private configureGenerator(generator: any, encoding: EncodingChannels): void {
    // Configure generator based on encoding channels
    Object.entries(encoding).forEach(([channel, channelDef]) => {
      if (!channelDef) return;
      
      const methodName = this.getGeneratorMethod(channel);
      if (methodName && generator[methodName]) {
        if (channelDef.field) {
          generator[methodName]((d: any) => this.getEncodedValue(d, channelDef));
        } else if (channelDef.value !== undefined) {
          generator[methodName](channelDef.value);
        }
      }
    });
  }

  private getGeneratorMethod(channel: string): string | null {
    const methodMap: Record<string, string> = {
      'x': 'x',
      'y': 'y',
      'x2': 'x1',
      'y2': 'y1',
      'angle': 'angle',
      'radius': 'radius',
      'startAngle': 'startAngle',
      'endAngle': 'endAngle',
      'innerRadius': 'innerRadius',
      'outerRadius': 'outerRadius'
    };
    
    return methodMap[channel] || null;
  }

  private applyShapeAttributes(
    selection: any, 
    markType: string, 
    encoding: EncodingChannels, 
    params: any
  ): void {
    // Universal attribute mapping
    const attributeMap: Record<string, string[]> = {
      'circle': ['cx', 'cy', 'r'],
      'rect': ['x', 'y', 'width', 'height'],
      'ellipse': ['cx', 'cy', 'rx', 'ry'],
      'line': ['x1', 'y1', 'x2', 'y2'],
      'polygon': ['points'],
      'symbol': ['d'],
      'point': ['cx', 'cy']
    };

    const attributes = attributeMap[markType] || [];
    
    // Map encoding channels to attributes
    const channelToAttr: Record<string, string> = {
      'x': attributes[0] || 'x',
      'y': attributes[1] || 'y',
      'x2': attributes[2] || 'x2',
      'y2': attributes[3] || 'y2',
      'size': markType === 'circle' ? 'r' : 'width',
      'radius': 'r'
    };

    Object.entries(channelToAttr).forEach(([channel, attr]) => {
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

  private applyEncoding(selection: any, encoding: EncodingChannels, defaultData?: any): void {
    Object.entries(encoding).forEach(([channel, channelDef]) => {
      if (!channelDef) return;
      
      const attribute = this.getAttributeForChannel(channel);
      if (attribute) {
        selection.attr(attribute, (d: any) => this.getEncodedValue(d || defaultData, channelDef));
      } else {
        // Handle style properties
        const styleProperty = this.getStylePropertyForChannel(channel);
        if (styleProperty) {
          selection.style(styleProperty, (d: any) => this.getEncodedValue(d || defaultData, channelDef));
        }
      }
    });
  }

  private getAttributeForChannel(channel: string): string | null {
    const attributeMap: Record<string, string> = {
      'x': 'x',
      'y': 'y',
      'x2': 'x2',
      'y2': 'y2',
      'color': 'fill',
      'stroke': 'stroke',
      'strokeWidth': 'stroke-width',
      'opacity': 'opacity',
      'size': 'r', // default, can be overridden
      'text': 'text-content'
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
        default:
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
    // Evaluate rendering conditions
    switch (condition.type) {
      case 'expression':
        // Simple expression evaluation
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
    const { type, target, params = {}, handlers = {} } = behavior;
    
    // Get target elements
    const targets = target ? 
      this.container.selectAll(target) : 
      this.container;

    // Apply behavior based on type
    switch (type) {
      case 'zoom':
        const zoom = d3.zoom();
        if (params.scaleExtent) zoom.scaleExtent(params.scaleExtent);
        if (params.translateExtent) zoom.translateExtent(params.translateExtent);
        
        zoom.on('zoom', (event) => {
          if (handlers.zoom) {
            this.executeHandler(handlers.zoom, event);
          }
        });
        
        targets.call(zoom);
        break;
      
      case 'brush':
        const brush = params.type === '1d' ? d3.brushX() : d3.brush();
        
        brush.on('brush end', (event) => {
          if (handlers.brush) {
            this.executeHandler(handlers.brush, event);
          }
        });
        
        targets.call(brush);
        break;
      
      case 'drag':
        const drag = d3.drag();
        
        ['start', 'drag', 'end'].forEach(eventType => {
          if (handlers[eventType]) {
            drag.on(eventType, (event, d) => {
              this.executeHandler(handlers[eventType], event, d);
            });
          }
        });
        
        targets.call(drag);
        break;
      
      case 'hover':
      case 'click':
        ['mouseover', 'mouseout', 'click'].forEach(eventType => {
          if (handlers[eventType]) {
            targets.on(eventType, (event, d) => {
              this.executeHandler(handlers[eventType], event, d);
            });
          }
        });
        break;
    }
  }

  private executeHandler(handler: any, event: any, data?: any): void {
    if (typeof handler.action === 'function') {
      handler.action(event, data);
    } else if (typeof handler.action === 'string') {
      // Execute predefined action
      this.executePredefinedAction(handler.action, event, data, handler.params);
    }
  }

  private executePredefinedAction(action: string, event: any, data: any, params: any): void {
    switch (action) {
      case 'highlight':
        // Highlight logic
        break;
      case 'filter':
        // Filter logic
        break;
      case 'zoom':
        // Zoom logic
        break;
      case 'update':
        // Update chart
        this.render();
        break;
    }
  }

  private startAnimations(): void {
    if (!this.schema.animations) return;
    
    this.schema.animations.forEach(animation => {
      this.startAnimation(animation);
    });
  }

  private startAnimation(animation: any): void {
    const { trigger, sequence, duration = 1000, delay = 0, easing = 'easeLinear' } = animation;
    
    if (trigger === 'load') {
      // Start immediately
      this.executeAnimationSequence(sequence, duration, delay, easing);
    }
    // Other triggers would be handled by behaviors
  }

  private executeAnimationSequence(sequence: any[], duration: number, delay: number, easing: string): void {
    sequence.forEach((step, index) => {
      const stepDelay = delay + (step.delay || 0) + index * 100;
      const stepDuration = step.duration || duration;
      
      const targets = this.container.selectAll(step.target);
      
      targets.transition()
        .duration(stepDuration)
        .delay(stepDelay)
        .ease(d3[easing as keyof typeof d3] as any)
        .call(transition => {
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

  // Helper methods for specific transform types
  private setupForceData(data: any[], params: any): any[] {
    // Transform data for force simulation
    return data;
  }

  private applyProjection(data: any[], params: any): any[] {
    // Apply geographic projection
    return data;
  }

  private generateContours(data: any[], params: any): any[] {
    // Generate contour data
    return data;
  }

  private generateVoronoi(data: any[], params: any): any[] {
    // Generate Voronoi diagram
    return data;
  }

  private generateDelaunay(data: any[], params: any): any[] {
    // Generate Delaunay triangulation
    return data;
  }

  private createClipPath(defs: any, clip: any): void {
    const clipPath = defs.append('clipPath')
      .attr('id', clip.id);
    
    switch (clip.type) {
      case 'rect':
        clipPath.append('rect')
          .attr('x', clip.params.x || 0)
          .attr('y', clip.params.y || 0)
          .attr('width', clip.params.width)
          .attr('height', clip.params.height);
        break;
      case 'circle':
        clipPath.append('circle')
          .attr('cx', clip.params.cx || 0)
          .attr('cy', clip.params.cy || 0)
          .attr('r', clip.params.r);
        break;
      case 'path':
        clipPath.append('path')
          .attr('d', clip.params.d);
        break;
    }
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

  public setState(key: string, value: any): void {
    this.state.set(key, value);
  }

  public getState(key: string): any {
    return this.state.get(key);
  }
}