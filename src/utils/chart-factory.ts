import { ChartSchema, ChartType } from '../types/chart-schema';
import { ChartRenderer } from '../renderer/chart-renderer';
import { chartExamples } from '../examples/chart-examples';

export class ChartFactory {
  private static renderers: Map<string, ChartRenderer> = new Map();

  /**
   * Create a chart from a schema
   */
  static async createChart(
    container: SVGElement, 
    schema: ChartSchema
  ): Promise<ChartRenderer> {
    const renderer = new ChartRenderer(container, schema);
    await renderer.render();
    
    this.renderers.set(schema.id, renderer);
    return renderer;
  }

  /**
   * Create a chart from a predefined type with custom data
   */
  static async createChartFromType(
    container: SVGElement,
    chartType: ChartType,
    data: any[],
    options: Partial<ChartSchema> = {}
  ): Promise<ChartRenderer> {
    const baseSchema = this.getSchemaTemplate(chartType);
    if (!baseSchema) {
      throw new Error(`No template found for chart type: ${chartType}`);
    }

    const schema: ChartSchema = {
      ...baseSchema,
      ...options,
      id: options.id || `${chartType}-${Date.now()}`,
      data: {
        ...baseSchema.data,
        source: {
          type: 'inline',
          data
        },
        ...options.data
      }
    };

    return this.createChart(container, schema);
  }

  /**
   * Get a schema template for a chart type
   */
  static getSchemaTemplate(chartType: ChartType): ChartSchema | null {
    // Map chart types to example schemas
    const typeMapping: Record<string, string> = {
      'bar': 'barChart',
      'horizontal-bar': 'barChart',
      'stacked-bar': 'barChart',
      'grouped-bar': 'barChart',
      'scatter': 'scatterPlot',
      'bubble': 'scatterPlot',
      'line': 'lineChart',
      'multi-line': 'lineChart',
      'area': 'lineChart',
      'pie': 'pieChart',
      'donut': 'pieChart',
      'choropleth': 'choroplethMap',
      'force-directed': 'forceDirectedGraph',
      'treemap': 'treemap'
    };

    const exampleKey = typeMapping[chartType];
    return exampleKey ? chartExamples[exampleKey] : null;
  }

  /**
   * Update an existing chart with new data
   */
  static updateChart(chartId: string, newData: any[]): void {
    const renderer = this.renderers.get(chartId);
    if (renderer) {
      renderer.updateData(newData);
    }
  }

  /**
   * Update an existing chart with new schema
   */
  static updateChartSchema(chartId: string, newSchema: Partial<ChartSchema>): void {
    const renderer = this.renderers.get(chartId);
    if (renderer) {
      renderer.updateSchema(newSchema);
    }
  }

  /**
   * Resize a chart
   */
  static resizeChart(chartId: string, width: number, height: number): void {
    const renderer = this.renderers.get(chartId);
    if (renderer) {
      renderer.resize(width, height);
    }
  }

  /**
   * Remove a chart and clean up resources
   */
  static removeChart(chartId: string): void {
    this.renderers.delete(chartId);
  }

  /**
   * Get all active chart renderers
   */
  static getActiveCharts(): Map<string, ChartRenderer> {
    return new Map(this.renderers);
  }

  /**
   * Create multiple charts from a configuration array
   */
  static async createDashboard(
    containerSelector: string,
    charts: Array<{
      schema: ChartSchema;
      containerId: string;
    }>
  ): Promise<ChartRenderer[]> {
    const renderers: ChartRenderer[] = [];
    
    for (const { schema, containerId } of charts) {
      const container = document.querySelector(`${containerSelector} #${containerId}`) as SVGElement;
      if (container) {
        const renderer = await this.createChart(container, schema);
        renderers.push(renderer);
      }
    }
    
    return renderers;
  }

  /**
   * Generate a schema from data analysis
   */
  static generateSchemaFromData(
    data: any[],
    chartType: ChartType,
    options: {
      xField?: string;
      yField?: string;
      colorField?: string;
      sizeField?: string;
      title?: string;
      width?: number;
      height?: number;
    } = {}
  ): ChartSchema {
    const baseSchema = this.getSchemaTemplate(chartType);
    if (!baseSchema) {
      throw new Error(`No template found for chart type: ${chartType}`);
    }

    // Analyze data to infer field types
    const fields = this.inferFieldTypes(data);
    
    // Auto-assign fields based on types and options
    const xField = options.xField || this.findFieldByType(fields, ['temporal', 'ordinal', 'nominal'])[0];
    const yField = options.yField || this.findFieldByType(fields, ['quantitative'])[0];
    const colorField = options.colorField || this.findFieldByType(fields, ['nominal', 'ordinal'])[0];

    return {
      ...baseSchema,
      id: `auto-${chartType}-${Date.now()}`,
      title: options.title || `${chartType} Chart`,
      data: {
        source: { type: 'inline', data },
        fields: [
          { name: xField, type: this.getFieldType(data, xField), role: 'x' },
          { name: yField, type: this.getFieldType(data, yField), role: 'y' },
          ...(colorField ? [{ name: colorField, type: this.getFieldType(data, colorField), role: 'color' as const }] : [])
        ]
      },
      dimensions: {
        width: options.width || 800,
        height: options.height || 400,
        margin: { top: 20, right: 20, bottom: 40, left: 40 }
      }
    };
  }

  private static inferFieldTypes(data: any[]): Array<{ name: string; type: string }> {
    if (!data.length) return [];
    
    const sample = data[0];
    return Object.keys(sample).map(key => ({
      name: key,
      type: this.getFieldType(data, key)
    }));
  }

  private static getFieldType(data: any[], field: string): 'quantitative' | 'ordinal' | 'nominal' | 'temporal' {
    const values = data.map(d => d[field]).filter(v => v != null);
    if (!values.length) return 'nominal';

    const sample = values[0];
    
    // Check if it's a date
    if (sample instanceof Date || (typeof sample === 'string' && !isNaN(Date.parse(sample)))) {
      return 'temporal';
    }
    
    // Check if it's numeric
    if (typeof sample === 'number' || !isNaN(Number(sample))) {
      const uniqueValues = new Set(values);
      // If there are many unique values, it's quantitative
      if (uniqueValues.size > values.length * 0.5) {
        return 'quantitative';
      }
      // If there are few unique values, it might be ordinal
      return uniqueValues.size <= 10 ? 'ordinal' : 'quantitative';
    }
    
    // Check if it's ordinal (ordered categories)
    const uniqueValues = new Set(values);
    if (uniqueValues.size <= 10 && this.isOrderedCategory(Array.from(uniqueValues))) {
      return 'ordinal';
    }
    
    return 'nominal';
  }

  private static isOrderedCategory(values: any[]): boolean {
    // Simple heuristic to detect ordered categories
    const orderedPatterns = [
      /^(small|medium|large)$/i,
      /^(low|medium|high)$/i,
      /^(first|second|third)$/i,
      /^[0-9]+(st|nd|rd|th)$/i
    ];
    
    return values.some(value => 
      orderedPatterns.some(pattern => pattern.test(String(value)))
    );
  }

  private static findFieldByType(fields: Array<{ name: string; type: string }>, types: string[]): string[] {
    return fields
      .filter(field => types.includes(field.type))
      .map(field => field.name);
  }
}