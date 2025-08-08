/**
 * Canonical Chart Schema - Universal structure for all D3 chart types
 * This schema eliminates the need for chart-type-specific logic during rendering
 */

export interface CanonicalChartSchema {
  // Core identification
  id: string;
  title?: string;
  description?: string;
  
  // Data pipeline - completely generic
  data: DataPipeline;
  
  // Visual space definition
  space: VisualSpace;
  
  // Scale definitions - any number of scales
  scales: Record<string, ScaleDefinition>;
  
  // Mark layers - ordered rendering pipeline
  layers: LayerDefinition[];
  
  // Interaction behaviors
  behaviors?: BehaviorDefinition[];
  
  // Animation sequences
  animations?: AnimationDefinition[];
  
  // Metadata
  metadata?: ChartMetadata;
}

export interface DataPipeline {
  // Data source
  source: DataSource;
  
  // Processing pipeline
  transforms?: TransformStep[];
  
  // Field definitions
  fields: FieldDefinition[];
}

export interface DataSource {
  type: 'inline' | 'url' | 'file' | 'stream' | 'generated' | 'computed';
  data?: any;
  url?: string;
  format?: 'json' | 'csv' | 'tsv' | 'topojson' | 'geojson' | 'xml';
  options?: Record<string, any>;
}

export interface TransformStep {
  type: string; // filter, sort, group, stack, bin, hierarchy, force, projection, etc.
  params: Record<string, any>;
  output?: string; // optional output field name
}

export interface FieldDefinition {
  name: string;
  type: 'quantitative' | 'ordinal' | 'nominal' | 'temporal' | 'geojson' | 'computed';
  domain?: any[];
  format?: string;
  accessor?: string | ((d: any) => any);
}

export interface VisualSpace {
  // Canvas dimensions
  width: number;
  height: number;
  
  // Coordinate systems
  coordinates?: CoordinateSystem[];
  
  // Clipping and masking
  clips?: ClipDefinition[];
  
  // Background and styling
  background?: StyleProperties;
  
  // Responsive behavior
  responsive?: ResponsiveConfig;
}

export interface CoordinateSystem {
  id: string;
  type: 'cartesian' | 'polar' | 'geographic' | 'custom';
  origin?: [number, number];
  bounds?: [[number, number], [number, number]];
  transform?: TransformMatrix;
  projection?: ProjectionDefinition;
}

export interface ScaleDefinition {
  // Scale function type
  type: 'linear' | 'log' | 'sqrt' | 'pow' | 'time' | 'utc' | 'ordinal' | 'band' | 'point' | 'sequential' | 'diverging' | 'threshold' | 'quantile' | 'quantize' | 'identity';
  
  // Domain and range
  domain?: any[];
  range?: any[];
  
  // Scale-specific parameters
  params?: Record<string, any>; // base, exponent, padding, align, etc.
  
  // Color schemes and interpolators
  scheme?: string;
  interpolator?: string;
  
  // Modifiers
  nice?: boolean | number;
  clamp?: boolean;
  reverse?: boolean;
  
  // Dynamic domain calculation
  domainFrom?: {
    data: string; // reference to data
    field: string;
    method?: 'extent' | 'max' | 'min' | 'values' | 'custom';
    transform?: (values: any[]) => any[];
  };
}

export interface LayerDefinition {
  id?: string;
  
  // Data binding
  data?: string; // reference to transformed data, defaults to main data
  
  // Mark type and properties
  mark: MarkDefinition;
  
  // Visual encoding channels
  encoding: EncodingChannels;
  
  // Layer-specific styling
  style?: StyleProperties;
  
  // Conditional rendering
  when?: ConditionDefinition;
  
  // Layer order and blending
  order?: number;
  blendMode?: string;
  
  // Clipping
  clipPath?: string;
}

export interface MarkDefinition {
  type: string; // circle, rect, line, path, text, arc, geoshape, etc.
  
  // Mark-specific parameters
  params?: Record<string, any>;
  
  // Generators (for complex marks like lines, areas, arcs)
  generator?: GeneratorDefinition;
  
  // Selection and grouping
  groupBy?: string[];
  key?: string | ((d: any) => string);
}

export interface GeneratorDefinition {
  type: 'line' | 'area' | 'arc' | 'pie' | 'stack' | 'force' | 'tree' | 'pack' | 'treemap' | 'sankey' | 'chord' | 'path' | 'symbol';
  params?: Record<string, any>;
  
  // Curve types for line/area
  curve?: string;
  
  // Layout parameters
  layout?: Record<string, any>;
}

export interface EncodingChannels {
  // Position channels
  x?: ChannelDefinition;
  y?: ChannelDefinition;
  x2?: ChannelDefinition;
  y2?: ChannelDefinition;
  
  // Polar coordinates
  angle?: ChannelDefinition;
  radius?: ChannelDefinition;
  
  // Visual channels
  color?: ChannelDefinition;
  opacity?: ChannelDefinition;
  size?: ChannelDefinition;
  shape?: ChannelDefinition;
  stroke?: ChannelDefinition;
  strokeWidth?: ChannelDefinition;
  strokeDash?: ChannelDefinition;
  
  // Text channels
  text?: ChannelDefinition;
  fontSize?: ChannelDefinition;
  fontWeight?: ChannelDefinition;
  
  // Custom channels (for specialized marks)
  [key: string]: ChannelDefinition | undefined;
}

export interface ChannelDefinition {
  // Data binding
  field?: string;
  value?: any; // constant value
  
  // Scale reference
  scale?: string;
  
  // Channel-specific transforms
  transform?: ChannelTransform[];
  
  // Conditional encoding
  condition?: ConditionalEncoding[];
  
  // Aggregation
  aggregate?: AggregateOperation;
  
  // Binning
  bin?: BinDefinition;
  
  // Time unit
  timeUnit?: TimeUnit;
  
  // Sort
  sort?: SortDefinition;
}

export interface ChannelTransform {
  type: 'scale' | 'offset' | 'multiply' | 'add' | 'log' | 'sqrt' | 'custom';
  params?: Record<string, any>;
}

export interface ConditionalEncoding {
  test: string | ((d: any) => boolean);
  value?: any;
  field?: string;
  scale?: string;
}

export interface StyleProperties {
  // Fill properties
  fill?: string;
  fillOpacity?: number;
  fillRule?: 'nonzero' | 'evenodd';
  
  // Stroke properties
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  strokeDashoffset?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeMiterlimit?: number;
  
  // Text properties
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAnchor?: 'start' | 'middle' | 'end';
  textDecoration?: string;
  
  // Layout properties
  opacity?: number;
  visibility?: 'visible' | 'hidden';
  cursor?: string;
  pointerEvents?: 'auto' | 'none' | 'all';
  
  // Transform properties
  transform?: string;
  transformOrigin?: string;
  
  // Filter effects
  filter?: string;
  
  // Blend modes
  mixBlendMode?: string;
  
  // Custom CSS properties
  [key: string]: any;
}

export interface BehaviorDefinition {
  type: 'zoom' | 'pan' | 'brush' | 'drag' | 'hover' | 'click' | 'selection' | 'tooltip' | 'custom';
  
  // Target elements
  target?: string | string[]; // CSS selector or layer IDs
  
  // Behavior parameters
  params?: Record<string, any>;
  
  // Event handlers
  handlers?: Record<string, EventHandler>;
  
  // State management
  state?: StateDefinition;
}

export interface EventHandler {
  type: 'function' | 'update' | 'transition' | 'custom';
  action: string | ((event: any, data: any) => void);
  params?: Record<string, any>;
}

export interface AnimationDefinition {
  id?: string;
  trigger: 'load' | 'update' | 'interaction' | 'time' | 'custom';
  
  // Animation sequence
  sequence: AnimationStep[];
  
  // Timing
  duration?: number;
  delay?: number;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate';
  
  // Easing
  easing?: string;
  
  // Conditions
  when?: ConditionDefinition;
}

export interface AnimationStep {
  target: string; // layer ID or CSS selector
  properties: Record<string, any>;
  duration?: number;
  delay?: number;
  easing?: string;
}

// Supporting interfaces
export interface ClipDefinition {
  id: string;
  type: 'rect' | 'circle' | 'ellipse' | 'path' | 'polygon';
  params: Record<string, any>;
}

export interface ResponsiveConfig {
  enabled: boolean;
  breakpoints?: Record<string, Partial<CanonicalChartSchema>>;
  maintainAspectRatio?: boolean;
}

export interface TransformMatrix {
  translate?: [number, number];
  scale?: [number, number];
  rotate?: number;
  skew?: [number, number];
  matrix?: [number, number, number, number, number, number];
}

export interface ProjectionDefinition {
  type: string; // any D3 projection name
  params?: Record<string, any>;
  center?: [number, number];
  rotate?: [number, number, number?];
  scale?: number;
  translate?: [number, number];
  precision?: number;
  clipAngle?: number;
  clipExtent?: [[number, number], [number, number]];
}

export interface ConditionDefinition {
  type: 'expression' | 'function' | 'data' | 'interaction';
  test: string | ((context: any) => boolean);
  params?: Record<string, any>;
}

export interface StateDefinition {
  variables: Record<string, any>;
  computed?: Record<string, ComputedProperty>;
}

export interface ComputedProperty {
  expression: string | ((state: any, data: any) => any);
  dependencies?: string[];
}

// Utility types
export type AggregateOperation = 'count' | 'sum' | 'mean' | 'median' | 'min' | 'max' | 'variance' | 'stdev' | 'distinct' | 'custom';
export type TimeUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type SortDefinition = 'ascending' | 'descending' | { field: string; order: 'ascending' | 'descending' };
export type BinDefinition = { maxbins?: number; extent?: [number, number]; step?: number; steps?: number[] };

export interface ChartMetadata {
  version?: string;
  created?: Date;
  modified?: Date;
  tags?: string[];
  category?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  performance?: PerformanceHints;
  accessibility?: AccessibilityConfig;
}

export interface PerformanceHints {
  dataSize?: 'small' | 'medium' | 'large' | 'huge';
  renderingStrategy?: 'svg' | 'canvas' | 'webgl' | 'hybrid';
  optimization?: string[];
}

export interface AccessibilityConfig {
  title?: string;
  description?: string;
  keyboardNavigation?: boolean;
  screenReader?: boolean;
  colorBlindSafe?: boolean;
  highContrast?: boolean;
  alternativeText?: Record<string, string>;
  ariaLabels?: Record<string, string>;
}