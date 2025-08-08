# D3 Chart Schema System

A comprehensive, canonical schema structure for rendering all types of D3.js charts in a unified way. This system provides a single interface to create and manage 154+ different chart types from the D3.js ecosystem.

## Features

- **Unified Schema**: Single schema structure that can represent any D3 chart type
- **154+ Chart Types**: Supports all major D3 chart types including basic charts, statistical visualizations, hierarchical layouts, network graphs, geographic maps, and specialized charts
- **Flexible Data Sources**: Support for inline data, URLs, files, APIs, and generated data
- **Rich Interactions**: Built-in support for zoom, pan, brush, hover, click, and drag interactions
- **Animations**: Configurable entrance animations and transitions
- **Responsive Design**: Automatic responsive behavior and manual resize capabilities
- **Accessibility**: Built-in accessibility features and ARIA support
- **TypeScript**: Full TypeScript support with comprehensive type definitions

## Supported Chart Types

### Basic Charts
- Bar charts (vertical, horizontal, stacked, grouped, diverging)
- Line charts (single, multi-line, area, stacked area)
- Scatter plots and bubble charts
- Pie and donut charts
- Dot plots and beeswarm plots

### Statistical Charts
- Histograms and box plots
- Density contours and hexbin plots
- Heatmaps and calendar views
- Parallel coordinates
- Q-Q plots and violin plots

### Hierarchical Charts
- Treemaps (nested, cascaded)
- Sunburst and icicle charts
- Pack layouts and tree diagrams
- Cluster and radial layouts

### Network Charts
- Force-directed graphs
- Sankey diagrams
- Chord diagrams
- Arc diagrams
- Hierarchical edge bundling

### Geographic Charts
- Choropleth maps
- Bubble and spike maps
- Cartograms
- World maps with projections
- Voronoi maps

### Specialized Charts
- Candlestick and financial charts
- Horizon charts
- Slope charts
- Marimekko charts
- Timeline visualizations

## Installation

```bash
npm install d3-chart-schema
```

## Quick Start

```typescript
import D3ChartSystem, { ChartSchema } from 'd3-chart-schema';

// Create a simple bar chart
const container = document.querySelector('#chart') as SVGElement;
const data = [
  { category: 'A', value: 30 },
  { category: 'B', value: 80 },
  { category: 'C', value: 45 }
];

const chart = await D3ChartSystem.createSimpleChart(
  container,
  'bar',
  data,
  {
    xField: 'category',
    yField: 'value',
    title: 'Sales by Category',
    width: 800,
    height: 400
  }
);
```

## Advanced Usage

### Custom Schema

```typescript
const schema: ChartSchema = {
  id: 'my-custom-chart',
  type: 'scatter',
  title: 'Custom Scatter Plot',
  data: {
    source: {
      type: 'url',
      url: '/api/data.json'
    },
    fields: [
      { name: 'x', type: 'quantitative', role: 'x' },
      { name: 'y', type: 'quantitative', role: 'y' },
      { name: 'category', type: 'nominal', role: 'color' }
    ],
    transforms: [
      { type: 'filter', params: { predicate: d => d.x > 0 } }
    ]
  },
  dimensions: {
    width: 800,
    height: 600,
    margin: { top: 20, right: 20, bottom: 40, left: 40 }
  },
  scales: {
    x: { type: 'linear', nice: true },
    y: { type: 'log', nice: true },
    color: { type: 'ordinal', scheme: 'Category10' }
  },
  axes: {
    x: { show: true, title: 'X Axis', grid: true },
    y: { show: true, title: 'Y Axis (log scale)', grid: true }
  },
  marks: [{
    type: 'circle',
    encoding: {
      x: { field: 'x' },
      y: { field: 'y' },
      color: { field: 'category' },
      size: { field: 'value' }
    },
    style: {
      opacity: 0.7,
      stroke: 'white',
      strokeWidth: 1
    },
    tooltip: {
      show: true,
      fields: ['x', 'y', 'category']
    }
  }],
  interactions: {
    zoom: { enabled: true, scaleExtent: [1, 10] },
    brush: { enabled: true, type: '2d' },
    hover: { enabled: true, tooltip: true }
  },
  animations: {
    duration: 1000,
    ease: 'easeLinear',
    stagger: 50
  },
  legend: {
    show: true,
    position: 'right',
    title: 'Categories'
  }
};

const chart = await D3ChartSystem.createChart(container, schema);
```

### Geographic Maps

```typescript
const mapSchema: ChartSchema = {
  id: 'choropleth-map',
  type: 'choropleth',
  title: 'Population by State',
  data: {
    source: {
      type: 'url',
      url: '/data/us-states-population.json'
    },
    fields: [
      { name: 'geometry', type: 'geojson', role: 'geoshape' },
      { name: 'population', type: 'quantitative', role: 'color' },
      { name: 'state', type: 'nominal', role: 'tooltip' }
    ]
  },
  dimensions: {
    width: 960,
    height: 500,
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  },
  scales: {
    color: {
      type: 'sequential',
      scheme: 'Blues',
      domain: [0, 40000000]
    }
  },
  marks: [{
    type: 'geoshape',
    encoding: {
      color: { field: 'population' }
    },
    style: {
      stroke: 'white',
      strokeWidth: 0.5
    }
  }],
  projections: {
    type: 'albersUsa',
    scale: 1000,
    translate: [480, 250]
  },
  legend: {
    show: true,
    position: 'bottom-right',
    title: 'Population'
  }
};
```

### Force-Directed Network

```typescript
const networkSchema: ChartSchema = {
  id: 'network-graph',
  type: 'force-directed',
  title: 'Social Network',
  data: {
    source: {
      type: 'inline',
      data: {
        nodes: [
          { id: 'Alice', group: 1, size: 10 },
          { id: 'Bob', group: 1, size: 8 },
          { id: 'Carol', group: 2, size: 12 }
        ],
        links: [
          { source: 'Alice', target: 'Bob', weight: 1 },
          { source: 'Bob', target: 'Carol', weight: 2 }
        ]
      }
    },
    fields: [
      { name: 'id', type: 'nominal', role: 'text' },
      { name: 'group', type: 'nominal', role: 'color' },
      { name: 'size', type: 'quantitative', role: 'size' }
    ]
  },
  dimensions: {
    width: 800,
    height: 600,
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  },
  scales: {
    color: { type: 'ordinal', scheme: 'Category10' },
    size: { type: 'linear', range: [3, 15] }
  },
  marks: [
    {
      type: 'line',
      encoding: {},
      style: {
        stroke: '#999',
        strokeOpacity: 0.6,
        strokeWidth: d => Math.sqrt(d.weight)
      }
    },
    {
      type: 'circle',
      encoding: {
        color: { field: 'group' },
        size: { field: 'size' }
      },
      style: {
        stroke: '#fff',
        strokeWidth: 1.5
      }
    }
  ],
  forces: {
    simulation: {
      alpha: 1,
      alphaDecay: 0.01,
      velocityDecay: 0.4
    },
    forces: {
      link: { distance: 50, strength: 0.5 },
      manyBody: { strength: -300 },
      center: { x: 400, y: 300 }
    }
  },
  interactions: {
    drag: { enabled: true },
    hover: { enabled: true }
  }
};
```

## API Reference

### D3ChartSystem

Main class for creating and managing charts.

#### Methods

- `createChart(container, schema)` - Create a chart from a complete schema
- `createSimpleChart(container, type, data, options)` - Create a chart with minimal configuration
- `createDashboard(containerSelector, charts)` - Create multiple charts
- `getChartTypes()` - Get list of supported chart types
- `getExample(chartType)` - Get example schema for a chart type
- `validateSchema(schema)` - Validate a chart schema

### ChartRenderer

Low-level renderer class for individual charts.

#### Methods

- `render()` - Render the chart
- `updateData(newData)` - Update chart with new data
- `updateSchema(newSchema)` - Update chart configuration
- `resize(width, height)` - Resize the chart

### ChartFactory

Factory class for creating charts with templates.

#### Methods

- `createChart(container, schema)` - Create chart from schema
- `createChartFromType(container, type, data, options)` - Create chart from type
- `generateSchemaFromData(data, type, options)` - Auto-generate schema from data

## Schema Structure

The chart schema is organized into several main sections:

- **Basic Info**: `id`, `type`, `title`, `description`
- **Data**: `source`, `fields`, `transforms`
- **Dimensions**: `width`, `height`, `margin`, `responsive`
- **Scales**: `x`, `y`, `color`, `size`, `opacity`, etc.
- **Axes**: Configuration for x and y axes
- **Marks**: Visual elements (circles, rects, lines, etc.)
- **Interactions**: Zoom, pan, brush, hover, click, drag
- **Animations**: Duration, easing, stagger effects
- **Layout**: Special layouts for hierarchical and network charts
- **Projections**: Geographic projections for maps
- **Forces**: Force simulation parameters for network graphs
- **Theme**: Colors, fonts, styling
- **Legend**: Legend configuration
- **Accessibility**: ARIA labels and descriptions

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

MIT License - see LICENSE file for details.