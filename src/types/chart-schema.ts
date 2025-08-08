export interface ChartSchema {
  // Basic chart identification
  id: string;
  type: ChartType;
  title?: string;
  description?: string;
  
  // Data configuration
  data: DataConfig;
  
  // Visual configuration
  dimensions: DimensionsConfig;
  scales: ScalesConfig;
  axes?: AxesConfig;
  legend?: LegendConfig;
  
  // Chart-specific configurations
  marks: MarkConfig[];
  interactions?: InteractionConfig;
  animations?: AnimationConfig;
  
  // Layout and styling
  layout?: LayoutConfig;
  theme?: ThemeConfig;
  
  // Advanced features
  projections?: ProjectionConfig; // For maps
  forces?: ForceConfig; // For force-directed graphs
  hierarchy?: HierarchyConfig; // For tree/pack layouts
  
  // Metadata
  metadata?: ChartMetadata;
}

export type ChartType = 
  // Basic charts
  | 'bar' | 'horizontal-bar' | 'stacked-bar' | 'grouped-bar' | 'diverging-bar'
  | 'line' | 'multi-line' | 'area' | 'stacked-area' | 'streamgraph'
  | 'scatter' | 'bubble' | 'dot-plot' | 'beeswarm'
  | 'pie' | 'donut' | 'radial-bar' | 'radial-area'
  
  // Statistical charts
  | 'histogram' | 'box-plot' | 'violin-plot' | 'density-contour'
  | 'hexbin' | 'heatmap' | 'calendar' | 'ridgeline'
  | 'parallel-coordinates' | 'splom' | 'qq-plot'
  
  // Hierarchical charts
  | 'treemap' | 'sunburst' | 'icicle' | 'pack' | 'tree' | 'cluster'
  | 'indented-tree' | 'radial-tree' | 'radial-cluster'
  
  // Network charts
  | 'force-directed' | 'arc-diagram' | 'sankey' | 'chord'
  | 'hierarchical-edge-bundling'
  
  // Geographic charts
  | 'choropleth' | 'cartogram' | 'spike-map' | 'bubble-map'
  | 'world-map' | 'projection' | 'voronoi-map'
  
  // Specialized charts
  | 'candlestick' | 'bollinger-bands' | 'horizon' | 'slope'
  | 'marimekko' | 'timeline' | 'gantt' | 'difference'
  
  // Interactive/animated
  | 'zoomable' | 'brushable' | 'animated' | 'real-time';

export interface DataConfig {
  source: DataSource;
  format?: DataFormat;
  transforms?: DataTransform[];
  fields: FieldConfig[];
}

export interface DataSource {
  type: 'inline' | 'url' | 'file' | 'api' | 'generated';
  data?: any[] | string;
  url?: string;
  params?: Record<string, any>;
}

export interface DataFormat {
  type: 'json' | 'csv' | 'tsv' | 'topojson' | 'geojson';
  parseOptions?: Record<string, any>;
}

export interface DataTransform {
  type: 'filter' | 'sort' | 'group' | 'aggregate' | 'stack' | 'bin' | 'nest' | 'rollup';
  params: Record<string, any>;
}

export interface FieldConfig {
  name: string;
  type: 'quantitative' | 'ordinal' | 'nominal' | 'temporal' | 'geojson';
  role: 'x' | 'y' | 'color' | 'size' | 'shape' | 'opacity' | 'angle' | 'radius' | 'text' | 'tooltip' | 'facet';
  scale?: string;
  format?: string;
  aggregate?: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count';
}

export interface DimensionsConfig {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  aspectRatio?: number;
  responsive?: boolean;
}

export interface ScalesConfig {
  x?: ScaleConfig;
  y?: ScaleConfig;
  color?: ScaleConfig;
  size?: ScaleConfig;
  opacity?: ScaleConfig;
  shape?: ScaleConfig;
  angle?: ScaleConfig;
  radius?: ScaleConfig;
}

export interface ScaleConfig {
  type: 'linear' | 'log' | 'sqrt' | 'pow' | 'time' | 'utc' | 'ordinal' | 'band' | 'point' | 'sequential' | 'diverging' | 'threshold';
  domain?: any[];
  range?: any[];
  scheme?: string; // Color scheme name
  interpolate?: string;
  nice?: boolean;
  clamp?: boolean;
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
  align?: number;
  base?: number;
  exponent?: number;
}

export interface AxesConfig {
  x?: AxisConfig;
  y?: AxisConfig;
  x2?: AxisConfig;
  y2?: AxisConfig;
}

export interface AxisConfig {
  show: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  title?: string;
  titleOffset?: number;
  ticks?: number | any[];
  tickSize?: number;
  tickSizeInner?: number;
  tickSizeOuter?: number;
  tickPadding?: number;
  tickFormat?: string | ((d: any) => string);
  tickValues?: any[];
  grid?: boolean;
  gridOpacity?: number;
  domain?: boolean;
  orient?: string;
}

export interface LegendConfig {
  show: boolean;
  type?: 'color' | 'size' | 'shape' | 'opacity';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  title?: string;
  orient?: 'horizontal' | 'vertical';
  tickSize?: number;
  tickValues?: any[];
  tickFormat?: string | ((d: any) => string);
  width?: number;
  height?: number;
}

export interface MarkConfig {
  type: MarkType;
  encoding: EncodingConfig;
  style?: StyleConfig;
  tooltip?: TooltipConfig;
  selection?: SelectionConfig;
}

export type MarkType = 
  | 'point' | 'circle' | 'square' | 'cross' | 'diamond' | 'triangle'
  | 'line' | 'area' | 'bar' | 'rect' | 'arc' | 'pie' | 'text'
  | 'path' | 'symbol' | 'image' | 'rule' | 'tick'
  | 'geoshape' | 'trail' | 'errorbar' | 'errorband'
  | 'boxplot' | 'violin' | 'density' | 'contour';

export interface EncodingConfig {
  x?: ChannelConfig;
  y?: ChannelConfig;
  x2?: ChannelConfig;
  y2?: ChannelConfig;
  color?: ChannelConfig;
  opacity?: ChannelConfig;
  size?: ChannelConfig;
  shape?: ChannelConfig;
  angle?: ChannelConfig;
  radius?: ChannelConfig;
  theta?: ChannelConfig;
  text?: ChannelConfig;
  tooltip?: ChannelConfig;
  href?: ChannelConfig;
  key?: ChannelConfig;
  order?: ChannelConfig;
  detail?: ChannelConfig;
  facet?: ChannelConfig;
  row?: ChannelConfig;
  column?: ChannelConfig;
}

export interface ChannelConfig {
  field?: string;
  type?: 'quantitative' | 'ordinal' | 'nominal' | 'temporal' | 'geojson';
  scale?: string;
  axis?: string;
  legend?: string;
  sort?: SortConfig;
  bin?: BinConfig | boolean;
  timeUnit?: TimeUnit;
  aggregate?: AggregateOp;
  stack?: StackConfig;
  impute?: ImputeConfig;
  title?: string;
  format?: string;
  formatType?: string;
  labelExpr?: string;
  condition?: ConditionalConfig;
  value?: any;
}

export interface StyleConfig {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDash?: number[];
  strokeDashOffset?: number;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeLineJoin?: 'miter' | 'round' | 'bevel';
  opacity?: number;
  cursor?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  fontFamily?: string;
  textAlign?: string;
  textBaseline?: string;
  dx?: number;
  dy?: number;
  radius?: number;
  innerRadius?: number;
  outerRadius?: number;
  cornerRadius?: number;
  padAngle?: number;
  interpolate?: string;
  tension?: number;
  orient?: string;
  align?: string;
  baseline?: string;
  dir?: string;
  ellipsis?: string;
  limit?: number;
  theta?: number;
  angle?: number;
  aspect?: boolean;
  lineBreak?: string;
}

export interface TooltipConfig {
  show: boolean;
  fields?: string[];
  format?: Record<string, string>;
  title?: string;
  content?: string | ((d: any) => string);
}

export interface SelectionConfig {
  type: 'single' | 'multi' | 'interval';
  on?: string;
  clear?: string;
  toggle?: string;
  translate?: string;
  zoom?: string;
  resolve?: 'global' | 'union' | 'intersect';
  mark?: StyleConfig;
  bind?: BindConfig;
}

export interface InteractionConfig {
  zoom?: ZoomConfig;
  pan?: PanConfig;
  brush?: BrushConfig;
  hover?: HoverConfig;
  click?: ClickConfig;
  drag?: DragConfig;
  selection?: SelectionConfig;
}

export interface ZoomConfig {
  enabled: boolean;
  scaleExtent?: [number, number];
  translateExtent?: [[number, number], [number, number]];
  constrain?: boolean;
  filter?: (event: any) => boolean;
  touchable?: boolean;
  wheelDelta?: (event: any) => number;
  clickDistance?: number;
  tapDistance?: number;
  duration?: number;
  interpolate?: any;
  on?: Record<string, (event: any) => void>;
}

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  loop?: boolean;
  autoplay?: boolean;
  transitions?: TransitionConfig[];
}

export interface TransitionConfig {
  trigger: 'load' | 'update' | 'hover' | 'click' | 'time';
  duration: number;
  delay?: number;
  ease?: string;
  properties: string[];
}

export interface LayoutConfig {
  type?: 'grid' | 'pack' | 'tree' | 'cluster' | 'partition' | 'treemap' | 'force' | 'sankey' | 'chord';
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  spacing?: number;
  align?: string;
  sort?: SortConfig;
  size?: [number, number];
  nodeSize?: [number, number];
  separation?: (a: any, b: any) => number;
  tile?: string;
  ratio?: number;
  round?: boolean;
  sticky?: boolean;
  offset?: string;
  order?: string;
  curve?: string;
}

export interface ThemeConfig {
  background?: string;
  foreground?: string;
  font?: FontConfig;
  colors?: ColorConfig;
  grid?: GridConfig;
  axis?: AxisThemeConfig;
  legend?: LegendThemeConfig;
  mark?: MarkThemeConfig;
}

export interface FontConfig {
  family?: string;
  size?: number;
  weight?: string | number;
  style?: string;
}

export interface ColorConfig {
  scheme?: string;
  range?: string[];
  domain?: any[];
  interpolate?: string;
  reverse?: boolean;
}

export interface GridConfig {
  show?: boolean;
  color?: string;
  opacity?: number;
  width?: number;
  dash?: number[];
}

export interface ProjectionConfig {
  type: 'albers' | 'albersUsa' | 'azimuthalEqualArea' | 'azimuthalEquidistant' | 'conicConformal' | 'conicEqualArea' | 'conicEquidistant' | 'equalEarth' | 'equirectangular' | 'gnomonic' | 'identity' | 'mercator' | 'naturalEarth1' | 'orthographic' | 'stereographic' | 'transverseMercator';
  center?: [number, number];
  rotate?: [number, number, number?];
  scale?: number;
  translate?: [number, number];
  precision?: number;
  clipAngle?: number;
  clipExtent?: [[number, number], [number, number]];
  parallels?: [number, number];
  fitExtent?: [[number, number], [number, number]];
  fitSize?: [number, number];
  fitWidth?: number;
  fitHeight?: number;
}

export interface ForceConfig {
  simulation?: {
    alpha?: number;
    alphaMin?: number;
    alphaDecay?: number;
    alphaTarget?: number;
    velocityDecay?: number;
    restart?: boolean;
    stop?: boolean;
  };
  forces?: {
    center?: { x?: number; y?: number; strength?: number };
    collision?: { radius?: number | ((d: any) => number); strength?: number; iterations?: number };
    link?: { 
      id?: string | ((d: any) => string);
      distance?: number | ((d: any) => number);
      strength?: number | ((d: any) => number);
      iterations?: number;
    };
    manyBody?: { strength?: number | ((d: any) => number); theta?: number; distanceMin?: number; distanceMax?: number };
    x?: { x?: number | ((d: any) => number); strength?: number };
    y?: { y?: number | ((d: any) => number); strength?: number };
    radial?: { radius?: number | ((d: any) => number); x?: number; y?: number; strength?: number };
  };
}

export interface HierarchyConfig {
  value?: string | ((d: any) => number);
  sort?: (a: any, b: any) => number;
  sum?: (d: any) => number;
  count?: boolean;
  children?: string | ((d: any) => any[]);
  path?: string;
  id?: string | ((d: any) => string);
  parentId?: string | ((d: any) => string);
}

export interface ChartMetadata {
  version?: string;
  author?: string;
  created?: Date;
  modified?: Date;
  tags?: string[];
  category?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  performance?: 'fast' | 'medium' | 'slow';
  responsive?: boolean;
  accessibility?: AccessibilityConfig;
}

export interface AccessibilityConfig {
  title?: string;
  description?: string;
  keyboardNavigation?: boolean;
  screenReader?: boolean;
  colorBlindFriendly?: boolean;
  highContrast?: boolean;
  alternativeText?: string;
}

// Helper types
export type SortConfig = 'ascending' | 'descending' | { field: string; order: 'ascending' | 'descending' };
export type BinConfig = { maxbins?: number; extent?: [number, number]; base?: number; step?: number; steps?: number[]; minstep?: number; divide?: [number, number] };
export type TimeUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'dayofyear' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond';
export type AggregateOp = 'count' | 'valid' | 'missing' | 'distinct' | 'sum' | 'product' | 'mean' | 'average' | 'variance' | 'variancep' | 'stdev' | 'stdevp' | 'stderr' | 'median' | 'q1' | 'q3' | 'ci0' | 'ci1' | 'min' | 'max' | 'argmin' | 'argmax';
export type StackConfig = 'zero' | 'center' | 'normalize' | null;
export type ImputeConfig = { method?: 'value' | 'mean' | 'median' | 'max' | 'min'; value?: any; frame?: [number, number]; keyvals?: any[] };
export type ConditionalConfig = { test?: string; value?: any; selection?: string };
export type BindConfig = { input?: string; element?: string; options?: any[]; min?: number; max?: number; step?: number; debounce?: number };
export type PanConfig = { enabled: boolean; modifiers?: string[]; filter?: (event: any) => boolean };
export type BrushConfig = { enabled: boolean; type?: '1d' | '2d'; selection?: string; clear?: boolean; translate?: boolean; filter?: (event: any) => boolean };
export type HoverConfig = { enabled: boolean; delay?: number; tooltip?: boolean; highlight?: boolean };
export type ClickConfig = { enabled: boolean; toggle?: boolean; clear?: boolean; preventDefault?: boolean };
export type DragConfig = { enabled: boolean; type?: 'move' | 'resize'; filter?: (event: any) => boolean; container?: string };
export type AxisThemeConfig = { domain?: boolean; ticks?: boolean; labels?: boolean; title?: boolean; grid?: boolean };
export type LegendThemeConfig = { title?: boolean; labels?: boolean; symbols?: boolean };
export type MarkThemeConfig = { fill?: string; stroke?: string; opacity?: number };