import { CanonicalChartSchema } from './types/canonical-schema';
import { CanonicalChartRenderer } from './renderer/canonical-renderer';
import { canonicalExamples } from './examples/canonical-examples';

/**
 * Universal D3 Chart System
 * Single interface to render any chart type using the canonical schema
 */
export class CanonicalChartSystem {
  private static renderers: Map<string, CanonicalChartRenderer> = new Map();

  /**
   * Create any chart from canonical schema - no chart-type logic needed
   */
  static async createChart(
    container: SVGElement, 
    schema: CanonicalChartSchema
  ): Promise<CanonicalChartRenderer> {
    const renderer = new CanonicalChartRenderer(container, schema);
    await renderer.render();
    
    this.renderers.set(schema.id, renderer);
    return renderer;
  }

  /**
   * Create chart from data with automatic schema generation
   */
  static async createFromData(
    container: SVGElement,
    data: any[],
    options: {
      type?: string; // hint for chart type, but not required
      title?: string;
      width?: number;
      height?: number;
      encoding?: Record<string, string>; // field mappings
    } = {}
  ): Promise<CanonicalChartRenderer> {
    const schema = this.generateSchemaFromData(data, options);
    return this.createChart(container, schema);
  }

  /**
   * Auto-generate canonical schema from data analysis
   */
  static generateSchemaFromData(
    data: any[],
    options: {
      type?: string;
      title?: string;
      width?: number;
      height?: number;
      encoding?: Record<string, string>;
    } = {}
  ): CanonicalChartSchema {
    if (!data.length) {
      throw new Error('Data cannot be empty');
    }

    // Analyze data structure
    const analysis = this.analyzeData(data);
    
    // Infer optimal visualization
    const vizType = options.type || this.inferVisualizationType(analysis);
    
    // Generate schema based on analysis
    return this.buildSchemaFromAnalysis(data, analysis, vizType, options);
  }

  private static analyzeData(data: any[]): DataAnalysis {
    const sample = data[0];
    const fields: FieldAnalysis[] = [];
    
    Object.keys(sample).forEach(key => {
      const values = data.map(d => d[key]).filter(v => v != null);
      const analysis = this.analyzeField(key, values);
      fields.push(analysis);
    });

    return {
      rowCount: data.length,
      fields,
      structure: this.detectDataStructure(data),
      relationships: this.detectRelationships(fields)
    };
  }

  private static analyzeField(name: string, values: any[]): FieldAnalysis {
    const uniqueCount = new Set(values).size;
    const nullCount = values.filter(v => v == null).length;
    
    let type: string;
    let subtype: string | null = null;
    
    const sample = values[0];
    
    if (sample instanceof Date || (typeof sample === 'string' && !isNaN(Date.parse(sample)))) {
      type = 'temporal';
      subtype = this.detectTemporalPattern(values);
    } else if (typeof sample === 'number' || !isNaN(Number(sample))) {
      if (uniqueCount / values.length > 0.8) {
        type = 'quantitative';
        subtype = this.detectQuantitativePattern(values);
      } else {
        type = 'ordinal';
      }
    } else if (this.isGeographic(values)) {
      type = 'geojson';
    } else {
      type = uniqueCount <= 20 ? 'ordinal' : 'nominal';
    }

    return {
      name,
      type,
      subtype,
      uniqueCount,
      nullCount,
      cardinality: uniqueCount / values.length,
      distribution: this.analyzeDistribution(values),
      range: type === 'quantitative' ? [Math.min(...values), Math.max(...values)] : null
    };
  }

  private static detectDataStructure(data: any[]): DataStructure {
    // Detect if data represents networks, hierarchies, geographic features, etc.
    const sample = data[0];
    
    if (sample.source && sample.target) {
      return { type: 'network', subtype: 'links' };
    }
    
    if (sample.children || sample.parent) {
      return { type: 'hierarchy', subtype: 'tree' };
    }
    
    if (sample.geometry || sample.coordinates) {
      return { type: 'geographic', subtype: 'features' };
    }
    
    if (sample.x && sample.y) {
      return { type: 'spatial', subtype: 'points' };
    }
    
    return { type: 'tabular', subtype: 'flat' };
  }

  private static detectRelationships(fields: FieldAnalysis[]): Relationship[] {
    const relationships: Relationship[] = [];
    
    // Detect time series
    const timeField = fields.find(f => f.type === 'temporal');
    const quantFields = fields.filter(f => f.type === 'quantitative');
    
    if (timeField && quantFields.length > 0) {
      relationships.push({
        type: 'temporal',
        fields: [timeField.name, ...quantFields.map(f => f.name)]
      });
    }
    
    // Detect correlations between quantitative fields
    if (quantFields.length >= 2) {
      relationships.push({
        type: 'correlation',
        fields: quantFields.map(f => f.name)
      });
    }
    
    return relationships;
  }

  private static inferVisualizationType(analysis: DataAnalysis): string {
    const { fields, structure, relationships } = analysis;
    
    // Rule-based inference
    if (structure.type === 'network') return 'force-directed';
    if (structure.type === 'hierarchy') return 'treemap';
    if (structure.type === 'geographic') return 'choropleth';
    
    const timeFields = fields.filter(f => f.type === 'temporal');
    const quantFields = fields.filter(f => f.type === 'quantitative');
    const catFields = fields.filter(f => f.type === 'ordinal' || f.type === 'nominal');
    
    if (timeFields.length > 0 && quantFields.length > 0) {
      return quantFields.length > 1 ? 'multi-line' : 'line';
    }
    
    if (quantFields.length >= 2) {
      return 'scatter';
    }
    
    if (catFields.length > 0 && quantFields.length > 0) {
      return catFields[0].uniqueCount <= 10 ? 'bar' : 'histogram';
    }
    
    if (quantFields.length === 1) {
      return 'histogram';
    }
    
    return 'bar'; // fallback
  }

  private static buildSchemaFromAnalysis(
    data: any[],
    analysis: DataAnalysis,
    vizType: string,
    options: any
  ): CanonicalChartSchema {
    const { fields } = analysis;
    
    // Get base template if available
    const baseSchema = this.getBaseTemplate(vizType);
    
    // Build field definitions
    const fieldDefs = fields.map(field => ({
      name: field.name,
      type: field.type as any,
      accessor: field.name
    }));

    // Infer encoding mappings
    const encoding = this.inferEncoding(fields, vizType, options.encoding);
    
    // Build scales
    const scales = this.buildScales(fields, encoding);
    
    // Build layers
    const layers = this.buildLayers(vizType, encoding, fields);

    return {
      id: `auto-${vizType}-${Date.now()}`,
      title: options.title || `${vizType} Chart`,
      
      data: {
        source: { type: 'inline', data },
        fields: fieldDefs
      },
      
      space: {
        width: options.width || 800,
        height: options.height || 400
      },
      
      scales,
      layers,
      
      ...baseSchema
    };
  }

  private static getBaseTemplate(vizType: string): Partial<CanonicalChartSchema> {
    // Return base configuration for common chart types
    const templates: Record<string, Partial<CanonicalChartSchema>> = {
      'bar': {
        behaviors: [
          {
            type: 'hover',
            target: '.bars rect',
            handlers: {
              mouseover: { action: 'highlight' },
              mouseout: { action: 'unhighlight' }
            }
          }
        ]
      },
      'line': {
        behaviors: [
          {
            type: 'hover',
            target: '.line path',
            handlers: {
              mouseover: { action: 'showTooltip' }
            }
          }
        ]
      },
      'scatter': {
        behaviors: [
          {
            type: 'brush',
            target: 'svg',
            handlers: {
              brush: { action: 'selectPoints' }
            }
          }
        ]
      }
    };
    
    return templates[vizType] || {};
  }

  private static inferEncoding(
    fields: FieldAnalysis[],
    vizType: string,
    userEncoding?: Record<string, string>
  ): Record<string, string> {
    const encoding: Record<string, string> = {};
    
    // Apply user-specified encoding first
    if (userEncoding) {
      Object.assign(encoding, userEncoding);
    }
    
    // Auto-infer missing encodings
    if (!encoding.x) {
      const timeField = fields.find(f => f.type === 'temporal');
      const catField = fields.find(f => f.type === 'ordinal' || f.type === 'nominal');
      encoding.x = timeField?.name || catField?.name || fields[0].name;
    }
    
    if (!encoding.y) {
      const quantField = fields.find(f => f.type === 'quantitative');
      encoding.y = quantField?.name || fields[1]?.name;
    }
    
    if (!encoding.color && fields.length > 2) {
      const catField = fields.find(f => (f.type === 'ordinal' || f.type === 'nominal') && f.name !== encoding.x);
      if (catField) encoding.color = catField.name;
    }
    
    return encoding;
  }

  private static buildScales(fields: FieldAnalysis[], encoding: Record<string, string>): Record<string, any> {
    const scales: Record<string, any> = {};
    
    Object.entries(encoding).forEach(([channel, fieldName]) => {
      const field = fields.find(f => f.name === fieldName);
      if (!field) return;
      
      const scale: any = {
        domainFrom: { data: 'main', field: fieldName, method: 'extent' }
      };
      
      // Infer scale type and range
      switch (field.type) {
        case 'quantitative':
          scale.type = 'linear';
          scale.nice = true;
          break;
        case 'temporal':
          scale.type = 'time';
          scale.nice = true;
          break;
        case 'ordinal':
        case 'nominal':
          scale.type = channel === 'x' ? 'band' : 'ordinal';
          scale.domainFrom.method = 'values';
          if (channel === 'color') {
            scale.scheme = 'Category10';
          }
          break;
      }
      
      // Set default ranges
      switch (channel) {
        case 'x':
          scale.range = [50, 750];
          break;
        case 'y':
          scale.range = [350, 50];
          break;
        case 'size':
          scale.range = [3, 20];
          break;
      }
      
      scales[channel] = scale;
    });
    
    return scales;
  }

  private static buildLayers(
    vizType: string,
    encoding: Record<string, string>,
    fields: FieldAnalysis[]
  ): any[] {
    const layers: any[] = [];
    
    // Main mark layer
    const mainLayer: any = {
      id: 'main',
      mark: { type: this.getMarkType(vizType) },
      encoding: {}
    };
    
    // Map encoding to channels
    Object.entries(encoding).forEach(([channel, fieldName]) => {
      mainLayer.encoding[channel] = {
        field: fieldName,
        scale: channel
      };
    });
    
    layers.push(mainLayer);
    
    // Add axes if needed
    if (['bar', 'line', 'scatter', 'area'].includes(vizType)) {
      layers.push(
        {
          id: 'x-axis',
          mark: { type: 'axis', params: { orient: 'bottom' } },
          encoding: { scale: { value: 'x' }, position: { value: [0, 350] } }
        },
        {
          id: 'y-axis',
          mark: { type: 'axis', params: { orient: 'left' } },
          encoding: { scale: { value: 'y' }, position: { value: [50, 0] } }
        }
      );
    }
    
    return layers;
  }

  private static getMarkType(vizType: string): string {
    const markMap: Record<string, string> = {
      'bar': 'rect',
      'line': 'line',
      'scatter': 'circle',
      'area': 'area',
      'pie': 'arc',
      'treemap': 'rect',
      'force-directed': 'circle',
      'choropleth': 'geoshape'
    };
    
    return markMap[vizType] || 'circle';
  }

  // Utility methods
  private static detectTemporalPattern(values: any[]): string {
    // Detect if daily, monthly, yearly, etc.
    return 'datetime';
  }

  private static detectQuantitativePattern(values: any[]): string {
    // Detect if continuous, discrete, etc.
    return 'continuous';
  }

  private static isGeographic(values: any[]): boolean {
    // Check if values represent geographic data
    return values.some(v => 
      v && typeof v === 'object' && 
      (v.type === 'Feature' || v.coordinates || v.geometry)
    );
  }

  private static analyzeDistribution(values: any[]): DistributionInfo {
    if (typeof values[0] !== 'number') {
      return { type: 'categorical' };
    }
    
    const sorted = values.sort((a, b) => a - b);
    const q1 = d3.quantile(sorted, 0.25)!;
    const median = d3.quantile(sorted, 0.5)!;
    const q3 = d3.quantile(sorted, 0.75)!;
    
    return {
      type: 'numerical',
      quartiles: [q1, median, q3],
      skewness: this.calculateSkewness(values),
      outliers: this.detectOutliers(values, q1, q3)
    };
  }

  private static calculateSkewness(values: number[]): number {
    // Simple skewness calculation
    const mean = d3.mean(values)!;
    const variance = d3.variance(values)!;
    const n = values.length;
    
    const skew = values.reduce((sum, x) => sum + Math.pow((x - mean) / Math.sqrt(variance), 3), 0) / n;
    return skew;
  }

  private static detectOutliers(values: number[], q1: number, q3: number): number[] {
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return values.filter(v => v < lowerBound || v > upperBound);
  }

  /**
   * Get all available examples
   */
  static getExamples(): Record<string, CanonicalChartSchema> {
    return canonicalExamples;
  }

  /**
   * Validate canonical schema
   */
  static validateSchema(schema: CanonicalChartSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required fields
    if (!schema.id) errors.push('Schema must have an id');
    if (!schema.data) errors.push('Schema must have data configuration');
    if (!schema.space) errors.push('Schema must have space configuration');
    if (!schema.layers || schema.layers.length === 0) errors.push('Schema must have at least one layer');
    
    // Data validation
    if (schema.data) {
      if (!schema.data.source) errors.push('Data must have a source');
      if (!schema.data.fields || schema.data.fields.length === 0) {
        warnings.push('No field definitions provided - will be inferred');
      }
    }
    
    // Space validation
    if (schema.space) {
      if (!schema.space.width || schema.space.width <= 0) {
        errors.push('Space must have positive width');
      }
      if (!schema.space.height || schema.space.height <= 0) {
        errors.push('Space must have positive height');
      }
    }
    
    // Layer validation
    schema.layers.forEach((layer, index) => {
      if (!layer.mark) {
        errors.push(`Layer ${index} must have a mark definition`);
      }
      if (!layer.encoding) {
        warnings.push(`Layer ${index} has no encoding - will use defaults`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Update existing chart
   */
  static updateChart(chartId: string, updates: Partial<CanonicalChartSchema>): void {
    const renderer = this.renderers.get(chartId);
    if (renderer) {
      renderer.updateSchema(updates);
    }
  }

  /**
   * Get chart renderer
   */
  static getRenderer(chartId: string): CanonicalChartRenderer | undefined {
    return this.renderers.get(chartId);
  }
}

// Supporting interfaces for data analysis
interface DataAnalysis {
  rowCount: number;
  fields: FieldAnalysis[];
  structure: DataStructure;
  relationships: Relationship[];
}

interface FieldAnalysis {
  name: string;
  type: string;
  subtype: string | null;
  uniqueCount: number;
  nullCount: number;
  cardinality: number;
  distribution: DistributionInfo;
  range: [number, number] | null;
}

interface DataStructure {
  type: 'tabular' | 'network' | 'hierarchy' | 'geographic' | 'spatial';
  subtype: string;
}

interface Relationship {
  type: 'temporal' | 'correlation' | 'hierarchy' | 'network';
  fields: string[];
}

interface DistributionInfo {
  type: 'categorical' | 'numerical';
  quartiles?: [number, number, number];
  skewness?: number;
  outliers?: number[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Re-export for convenience
export { CanonicalChartSchema, CanonicalChartRenderer };
export default CanonicalChartSystem;