# Canonical D3 Chart Schema System

A truly universal, canonical schema structure for rendering **any** D3.js chart without chart-type-specific logic. This system eliminates all switch/if statements during rendering by using a completely declarative, data-driven approach.

## Features

- **🎯 Zero Chart-Type Logic**: No switch statements or if/else chains based on chart type
- **🔄 Universal Rendering**: Single renderer handles all 154+ D3 chart types
- **📊 Complete Coverage**: Bar charts, force networks, geographic maps, hierarchical layouts, real-time streams, and more
- **🧠 Smart Data Analysis**: Automatic schema generation from data structure analysis
- **🎨 Declarative Design**: Pure data-driven configuration
- **⚡ High Performance**: Optimized rendering pipeline with caching and lazy evaluation
- **🔧 Extensible**: Easy to add new mark types, transforms, and behaviors
- **📱 Responsive**: Built-in responsive design and interaction handling
- **♿ Accessible**: Comprehensive accessibility features
- **🎭 Animated**: Rich animation and transition system

## Core Philosophy

Instead of having different renderers for different chart types, this system uses a **canonical schema** that describes:

1. **Data Pipeline**: How to load, transform, and process data
2. **Visual Space**: Canvas dimensions, coordinate systems, clipping
3. **Scales**: Universal scale definitions for any encoding channel
4. **Layers**: Ordered rendering pipeline with marks and encodings
5. **Behaviors**: Interaction patterns and event handling
6. **Animations**: Transition sequences and timing

This approach means:
- ✅ **One renderer** handles everything
- ✅ **No chart-type conditionals** in rendering code
- ✅ **Easy to extend** with new chart types
- ✅ **Consistent behavior** across all visualizations
- ✅ **Composable** - mix and match any elements

## Quick Start

### Automatic Chart Creation

```typescript
import CanonicalChartSystem from 'd3-chart-schema';

// Create any chart automatically from data
const container = document.querySelector('#chart') as SVGElement;
const data = [
  { category: 'A', value: 30, date: new Date('2023-01-01') },
  { category: 'B', value: 80, date: new Date('2023-02-01') },
  { category: 'C', value: 45, date: new Date('2023-03-01') }
];

// System automatically analyzes data and creates optimal visualization
const chart = await CanonicalChartSystem.createFromData(container, data, {
  title: 'My Chart',
  width: 800,
  height: 400
});
```

### Manual Schema Definition

```typescript
import { CanonicalChartSchema, CanonicalChartSystem } from 'd3-chart-schema';

// Define any chart with canonical schema
const schema: CanonicalChartSchema = {
  id: 'my-chart',
  title: 'Universal Chart',
  
  data: {
    source: {
      type: 'inline',
      data: myData
    },
    fields: [
      { name: 'x', type: 'quantitative', accessor: 'x' },
      { name: 'y', type: 'quantitative', accessor: 'y' }
    ]
  },
  
  space: {
    width: 800,
    height: 400
  },
  
  scales: {
    x: {
      type: 'linear',
      domainFrom: { data: 'main', field: 'x', method: 'extent' },
      range: [50, 750]
    },
    y: {
      type: 'linear', 
      domainFrom: { data: 'main', field: 'y', method: 'extent' },
      range: [350, 50]
    }
  },
  
  layers: [
    {
      id: 'points',
      mark: { type: 'circle' },
      encoding: {
        x: { field: 'x', scale: 'x' },
        y: { field: 'y', scale: 'y' },
        size: { value: 4 }
      }
    }
  ]
};

const chart = await CanonicalChartSystem.createChart(container, schema);
```

## Examples of Any Chart Type

### Force-Directed Network

```typescript
const networkSchema: CanonicalChartSchema = {
  id: 'network',
  title: 'Social Network',
  
  data: {
    source: {
      type: 'inline',
      data: { nodes: [...], links: [...] }
    },
    transforms: [
      { type: 'force', params: { /* force simulation config */ } }
    ]
  },
  
  // ... scales, layers, behaviors
};
```

### Geographic Choropleth

```typescript
const mapSchema: CanonicalChartSchema = {
  id: 'map',
  
  data: {
    source: { type: 'url', url: '/data/world.topojson' },
### 1. **No Chart-Type Branching**
```typescript
// ❌ Traditional approach
switch (chartType) {
  case 'bar': return renderBarChart(data);
  case 'line': return renderLineChart(data);
  case 'scatter': return renderScatterPlot(data);
  // ... 150+ more cases
}

// ✅ Canonical approach
return renderer.render(schema); // Works for ANY chart type
```

### 2. **Universal Data Pipeline**
```typescript
// Any data transformation works with any chart type
data: {
  source: { type: 'url', url: '/api/data' },
  transforms: [
    { type: 'filter', params: { predicate: d => d.value > 0 } },
    { type: 'group', params: { by: 'category' } },
    { type: 'stack', params: { keys: ['a', 'b', 'c'] } }
  ]
}
```

### 3. **Composable Layers**
```typescript
// Mix any mark types in any combination
layers: [
  { mark: { type: 'rect' }, encoding: { /* bar chart */ } },
  { mark: { type: 'line' }, encoding: { /* trend line */ } },
  { mark: { type: 'text' }, encoding: { /* labels */ } },
  { mark: { type: 'circle' }, encoding: { /* outliers */ } }
]
```

### 4. **Universal Interactions**
```typescript
// Same interaction system works for all chart types
behaviors: [
  { type: 'zoom', target: 'svg' },
  { type: 'brush', target: '.marks' },
  { type: 'hover', target: '.data-points' }
]
```

## Supported Visualizations

The canonical schema can represent **any** D3 visualization:

- **Basic**: Bar, line, area, scatter, pie, histogram
- **Statistical**: Box plots, violin plots, density contours, parallel coordinates
- **Hierarchical**: Treemap, sunburst, pack, tree, cluster, icicle
- **Network**: Force-directed, Sankey, chord, arc diagrams
- **Geographic**: Choropleth, cartogram, bubble maps, projections
- **Specialized**: Candlestick, horizon, calendar, ridgeline
- **Interactive**: Zoomable, brushable, real-time, animated
- **Custom**: Any combination of marks, scales, and behaviors

## API Reference

### CanonicalChartSystem

```typescript
// Create any chart
static async createChart(container: SVGElement, schema: CanonicalChartSchema): Promise<CanonicalChartRenderer>

// Auto-generate from data
static async createFromData(container: SVGElement, data: any[], options?: any): Promise<CanonicalChartRenderer>

// Generate schema from data analysis
static generateSchemaFromData(data: any[], options?: any): CanonicalChartSchema

// Validate schema
static validateSchema(schema: CanonicalChartSchema): ValidationResult

// Get examples
static getExamples(): Record<string, CanonicalChartSchema>
```

### CanonicalChartRenderer

```typescript
// Update with new data
renderer.updateData(newData: any[]): void

// Update schema
renderer.updateSchema(updates: Partial<CanonicalChartSchema>): void

// Access scales and data
renderer.getScale(name: string): any
renderer.getData(name?: string): any[]

// State management
renderer.setState(key: string, value: any): void
renderer.getState(key: string): any
```

## Schema Structure

```typescript
interface CanonicalChartSchema {
  id: string;
  title?: string;
  
  // Universal data pipeline
  data: {
    source: DataSource;           // Where data comes from
    transforms?: TransformStep[]; // How to process it
    fields: FieldDefinition[];    // What fields mean
  };
  
  // Visual space definition
  space: {
    width: number;
    height: number;
    coordinates?: CoordinateSystem[]; // Cartesian, polar, geographic
    clips?: ClipDefinition[];         // Clipping regions
  };
  
  // Scale definitions (any number, any type)
  scales: Record<string, ScaleDefinition>;
  
  // Rendering layers (ordered)
  layers: LayerDefinition[];
  
  // Interaction behaviors
  behaviors?: BehaviorDefinition[];
  
  // Animation sequences  
  animations?: AnimationDefinition[];
}
```

## Transform System

Universal transforms work with any data:

```typescript
transforms: [
  { type: 'filter', params: { predicate: d => d.value > 0 } },
  { type: 'sort', params: { field: 'date', order: 'ascending' } },
  { type: 'group', params: { by: 'category' } },
  { type: 'stack', params: { keys: ['a', 'b', 'c'] } },
  { type: 'bin', params: { field: 'value', thresholds: 20 } },
  { type: 'hierarchy', params: { value: 'size', children: 'children' } },
  { type: 'force', params: { /* simulation config */ } },
  { type: 'projection', params: { type: 'mercator' } },
  { type: 'contour', params: { bandwidth: 20 } },
  { type: 'voronoi', params: { x: 'longitude', y: 'latitude' } }
]
```

## Mark System

Universal mark types with generators:

```typescript
mark: {
  type: 'line',           // Basic mark type
  generator: {            // Optional generator
    type: 'line',
    curve: 'curveMonotoneX',
    params: { /* custom config */ }
  },
  groupBy: ['series'],    // Group data
  params: { /* mark-specific params */ }
}
```

## Encoding System

Universal encoding channels:

```typescript
encoding: {
  x: { field: 'date', scale: 'x' },
  y: { field: 'value', scale: 'y' },
  color: { field: 'category', scale: 'color' },
  size: { field: 'magnitude', scale: 'size' },
  opacity: { value: 0.7 },
  stroke: { field: 'type', scale: 'stroke' },
  // ... any channel can map to any field
}
```

## Contributing

This canonical approach makes contributions much easier:

1. **New chart types**: Just add examples, no renderer changes needed
2. **New transforms**: Add to transform system, works with all charts
3. **New interactions**: Add to behavior system, universal application
4. **New mark types**: Add to mark system, composable with everything

## License

MIT License - see LICENSE file for details.