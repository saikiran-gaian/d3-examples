// Main entry point for the Canonical D3 Chart Schema system
export { CanonicalChartSchema } from './types/canonical-schema';
export { CanonicalChartRenderer } from './renderer/canonical-renderer';
export { CanonicalChartSystem } from './canonical-system';
export { canonicalExamples } from './examples/canonical-examples';

// Re-export D3 for convenience
export * as d3 from 'd3';

// Legacy exports for backward compatibility
export { ChartSchema, ChartType, MarkConfig, ScaleConfig } from './types/chart-schema';
export { ChartRenderer } from './renderer/chart-renderer';
export { ChartFactory } from './utils/chart-factory';
export { chartExamples, getExampleByType, getAvailableChartTypes } from './examples/chart-examples';

// Main API - now uses canonical system
export class D3ChartSystem {
  /**
   * Create any chart from canonical schema - no chart-type logic
   */
  static async createChart(container: SVGElement, schema: CanonicalChartSchema): Promise<CanonicalChartRenderer> {
    return CanonicalChartSystem.createChart(container, schema);
  }

  /**
   * Create chart from data with automatic schema generation
   */
  static async createFromData(
    container: SVGElement,
    data: any[],
    options: {
      type?: string;
      title?: string;
      width?: number;
      height?: number;
      encoding?: Record<string, string>;
    } = {}
  ): Promise<CanonicalChartRenderer> {
    return CanonicalChartSystem.createFromData(container, data, options);
  }

  /**
   * Legacy method - converts to canonical schema
   */
  static async createSimpleChart(
    container: SVGElement,
    chartType: string,
    data: any[],
    options: {
      xField?: string;
      yField?: string;
      colorField?: string;
      title?: string;
      width?: number;
      height?: number;
    } = {}
  ): Promise<CanonicalChartRenderer> {
    const encoding: Record<string, string> = {};
    if (options.xField) encoding.x = options.xField;
    if (options.yField) encoding.y = options.yField;
    if (options.colorField) encoding.color = options.colorField;
    
    return this.createFromData(container, data, {
      type: chartType,
      title: options.title,
      width: options.width,
      height: options.height,
      encoding
    });
  }

  /**
   * Get all available examples
   */
  static getExamples(): Record<string, CanonicalChartSchema> {
    return CanonicalChartSystem.getExamples();
  }

  /**
   * Validate canonical schema
   */
  static validateSchema(schema: CanonicalChartSchema): { valid: boolean; errors: string[]; warnings?: string[] } {
    return CanonicalChartSystem.validateSchema(schema);
  }

  /**
   * Generate schema from data analysis
   */
  static generateSchemaFromData(data: any[], options: any = {}): CanonicalChartSchema {
    return CanonicalChartSystem.generateSchemaFromData(data, options);
  }
}

// Default export - canonical system
export default CanonicalChartSystem;