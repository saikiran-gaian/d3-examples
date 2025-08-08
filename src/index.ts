// Main entry point for the D3 Chart Schema system
export { ChartSchema, ChartType, MarkConfig, ScaleConfig } from './types/chart-schema';
export { ChartRenderer } from './renderer/chart-renderer';
export { ChartFactory } from './utils/chart-factory';
export { chartExamples, getExampleByType, getAvailableChartTypes } from './examples/chart-examples';

// Re-export D3 for convenience
export * as d3 from 'd3';

// Main API for creating charts
export class D3ChartSystem {
  /**
   * Create a chart from a complete schema
   */
  static async createChart(container: SVGElement, schema: ChartSchema): Promise<ChartRenderer> {
    return ChartFactory.createChart(container, schema);
  }

  /**
   * Create a chart from data and basic configuration
   */
  static async createSimpleChart(
    container: SVGElement,
    chartType: ChartType,
    data: any[],
    options: {
      xField?: string;
      yField?: string;
      colorField?: string;
      title?: string;
      width?: number;
      height?: number;
    } = {}
  ): Promise<ChartRenderer> {
    const schema = ChartFactory.generateSchemaFromData(data, chartType, options);
    return ChartFactory.createChart(container, schema);
  }

  /**
   * Create multiple charts in a dashboard layout
   */
  static async createDashboard(
    containerSelector: string,
    charts: Array<{
      schema: ChartSchema;
      containerId: string;
    }>
  ): Promise<ChartRenderer[]> {
    return ChartFactory.createDashboard(containerSelector, charts);
  }

  /**
   * Get available chart types
   */
  static getChartTypes(): string[] {
    return getAvailableChartTypes();
  }

  /**
   * Get example schema for a chart type
   */
  static getExample(chartType: string): ChartSchema | null {
    return getExampleByType(chartType);
  }

  /**
   * Validate a chart schema
   */
  static validateSchema(schema: ChartSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!schema.id) errors.push('Schema must have an id');
    if (!schema.type) errors.push('Schema must have a type');
    if (!schema.data) errors.push('Schema must have data configuration');
    if (!schema.dimensions) errors.push('Schema must have dimensions');
    if (!schema.marks || schema.marks.length === 0) errors.push('Schema must have at least one mark');

    // Data validation
    if (schema.data) {
      if (!schema.data.source) errors.push('Data must have a source');
      if (!schema.data.fields || schema.data.fields.length === 0) {
        errors.push('Data must have field definitions');
      }
    }

    // Dimensions validation
    if (schema.dimensions) {
      if (!schema.dimensions.width || schema.dimensions.width <= 0) {
        errors.push('Dimensions must have a positive width');
      }
      if (!schema.dimensions.height || schema.dimensions.height <= 0) {
        errors.push('Dimensions must have a positive height');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Default export
export default D3ChartSystem;