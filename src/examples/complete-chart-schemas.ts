import { CanonicalChartSchema } from '../types/canonical-schema';

/**
 * Complete collection of all 154+ D3 chart type schemas
 * Based on the Observable D3 examples provided
 */

export const completeChartSchemas: Record<string, CanonicalChartSchema> = {
  // === ANIMATED CHARTS ===
  
  animatedTreemap: {
    id: 'animated-treemap',
    title: 'Animated Treemap',
    data: {
      source: { type: 'generated', options: { type: 'temporal-hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true } },
        { type: 'treemap', params: { size: [928, 400], tile: 'treemapResquarify', padding: 1, round: true } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 420 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'name', scale: 'color' } } }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: '.cells rect', properties: { x: 'x0', y: 'y0', width: 'width', height: 'height' }, duration: 750 }] }
    ]
  },

  temporalForceDirectedGraph: {
    id: 'temporal-force-directed-graph',
    title: 'Temporal Force-Directed Graph',
    data: {
      source: { type: 'generated', options: { type: 'temporal-network' } },
      transforms: [{ type: 'force', params: { forces: { charge: { strength: -300 }, link: { distance: 30 }, x: {}, y: {} } } }],
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'group', type: 'nominal', accessor: 'group' }
      ]
    },
    space: { width: 928, height: 680 },
    scales: { color: { type: 'ordinal', scheme: 'Category10' } },
    layers: [
      { id: 'links', data: 'links', mark: { type: 'line' }, encoding: { stroke: { value: '#999' }, strokeOpacity: { value: 0.6 } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'circle' }, encoding: { r: { value: 5 }, fill: { field: 'group', scale: 'color' }, stroke: { value: '#fff' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  connectedScatterplot: {
    id: 'connected-scatterplot',
    title: 'Connected Scatterplot',
    data: {
      source: { type: 'generated', options: { type: 'driving-data' } },
      fields: [
        { name: 'miles', type: 'quantitative', accessor: 'miles' },
        { name: 'gas', type: 'quantitative', accessor: 'gas' },
        { name: 'year', type: 'temporal', accessor: 'year' }
      ]
    },
    space: { width: 928, height: 720, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'miles', method: 'extent' }, range: [40, 898], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'gas', method: 'extent' }, range: [690, 20], nice: true }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line', curve: 'curveCatmullRom' } }, encoding: { x: { field: 'miles', scale: 'x' }, y: { field: 'gas', scale: 'y' }, stroke: { value: 'black' }, strokeWidth: { value: 2.5 }, fill: { value: 'none' } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'miles', scale: 'x' }, cy: { field: 'gas', scale: 'y' }, r: { value: 3 }, fill: { value: 'white' }, stroke: { value: 'black' }, strokeWidth: { value: 2 } } }
    ]
  },

  wealthHealthNations: {
    id: 'wealth-health-nations',
    title: 'The Wealth & Health of Nations',
    data: {
      source: { type: 'generated', options: { type: 'nations-data' } },
      fields: [
        { name: 'income', type: 'quantitative', accessor: 'income' },
        { name: 'lifeExpectancy', type: 'quantitative', accessor: 'lifeExpectancy' },
        { name: 'population', type: 'quantitative', accessor: 'population' },
        { name: 'region', type: 'nominal', accessor: 'region' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'log', domainFrom: { data: 'main', field: 'income', method: 'extent' }, range: [40, 888] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'lifeExpectancy', method: 'extent' }, range: [460, 40] },
      size: { type: 'sqrt', domainFrom: { data: 'main', field: 'population', method: 'extent' }, range: [0, 40] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'region', method: 'values' } }
    },
    layers: [
      { id: 'bubbles', mark: { type: 'circle' }, encoding: { cx: { field: 'income', scale: 'x' }, cy: { field: 'lifeExpectancy', scale: 'y' }, r: { field: 'population', scale: 'size' }, fill: { field: 'region', scale: 'color' }, stroke: { value: '#000' } } }
    ]
  },

  scatterplotTour: {
    id: 'scatterplot-tour',
    title: 'Scatterplot Tour',
    data: {
      source: { type: 'generated', options: { type: 'multi-dimensional' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'category', type: 'nominal', accessor: 'category' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      x: { type: 'log', domainFrom: { data: 'main', field: 'x', method: 'extent' }, range: [0, 928] },
      y: { type: 'log', domainFrom: { data: 'main', field: 'y', method: 'extent' }, range: [928, 0] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'category', method: 'values' } }
    },
    layers: [
      { id: 'points', mark: { type: 'path' }, encoding: { d: { value: 'M0,0h0' }, stroke: { field: 'category', scale: 'color' }, strokeLinecap: { value: 'round' } } }
    ],
    behaviors: [
      { type: 'zoom', target: 'svg', params: { scaleExtent: [1, 32] } }
    ]
  },

  stackedToGroupedBars: {
    id: 'stacked-to-grouped-bars',
    title: 'Stacked to Grouped Bars',
    data: {
      source: { type: 'generated', options: { type: 'matrix-data' } },
      transforms: [{ type: 'stack', params: {} }],
      fields: [
        { name: 'index', type: 'quantitative', accessor: 'index' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 0, right: 0, bottom: 10, left: 0 } },
    scales: {
      x: { type: 'band', range: [0, 928], params: { padding: 0.08 } },
      y: { type: 'linear', range: [490, 0] },
      color: { type: 'sequential', interpolator: 'interpolateBlues', domain: [-2.5, 7.5] }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'index', scale: 'x' }, y: { field: '1', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'height', scale: 'y' }, fill: { field: 'series', scale: 'color' } } }
    ],
    animations: [
      { trigger: 'interaction', sequence: [{ target: '.bars rect', properties: { x: 'x', y: 'y', width: 'width', height: 'height' }, duration: 500 }] }
    ]
  },

  streamgraphTransitions: {
    id: 'streamgraph-transitions',
    title: 'Streamgraph Transitions',
    data: {
      source: { type: 'generated', options: { type: 'bumps' } },
      transforms: [{ type: 'stack', params: { offset: 'stackOffsetWiggle', order: 'stackOrderNone' } }],
      fields: [
        { name: 'index', type: 'quantitative', accessor: 'index' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'linear', domain: [0, 199], range: [0, 928] },
      y: { type: 'linear', range: [500, 0] }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'index', scale: 'x' }, y: { field: '0', scale: 'y' }, y2: { field: '1', scale: 'y' }, fill: { field: 'color' } } }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: '.areas path', properties: { d: 'path' }, duration: 1500 }] }
    ]
  },

  smoothZooming: {
    id: 'smooth-zooming',
    title: 'Smooth Zooming',
    data: {
      source: { type: 'generated', options: { type: 'random-points' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { value: 2.5 }, fill: { field: 'color' } } }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: 'g', properties: { transform: 'transform' }, duration: 2500 }] }
    ]
  },

  zoomToBoundingBox: {
    id: 'zoom-to-bounding-box',
    title: 'Zoom to Bounding Box',
    data: {
      source: { type: 'generated', options: { type: 'us-states' } },
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' },
        { name: 'name', type: 'nominal', accessor: 'properties.name' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {},
    layers: [
      { id: 'states', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#444' }, stroke: { value: 'white' }, strokeLinejoin: { value: 'round' } } }
    ],
    behaviors: [
      { type: 'zoom', target: 'svg', params: { scaleExtent: [1, 8] } },
      { type: 'click', target: '.states path', handlers: { click: { action: 'zoomToFeature' } } }
    ]
  },

  orthographicToEquirectangular: {
    id: 'orthographic-to-equirectangular',
    title: 'Orthographic to Equirectangular',
    data: {
      source: { type: 'generated', options: { type: 'world-features' } },
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'graticule', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#aaa' }, strokeWidth: { value: 1 } } },
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' } } },
      { id: 'sphere', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#000' }, strokeWidth: { value: 1.5 } } }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: 'svg', properties: { projection: 'interpolated' }, duration: 2000 }] }
    ]
  },

  worldTour: {
    id: 'world-tour',
    title: 'World Tour',
    data: {
      source: { type: 'generated', options: { type: 'world-countries' } },
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' },
        { name: 'name', type: 'nominal', accessor: 'properties.name' }
      ]
    },
    space: { width: 960, height: 500 },
    scales: {},
    layers: [
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#ccc' } } },
      { id: 'country', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#f00' } } },
      { id: 'borders', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#fff' }, strokeWidth: { value: 0.5 } } }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: 'svg', properties: { projection: 'rotation' }, duration: 1250 }] }
    ]
  },

  walmartsGrowth: {
    id: 'walmarts-growth',
    title: 'Walmart\'s Growth',
    data: {
      source: { type: 'generated', options: { type: 'walmart-stores' } },
      fields: [
        { name: 'longitude', type: 'quantitative', accessor: 'longitude' },
        { name: 'latitude', type: 'quantitative', accessor: 'latitude' },
        { name: 'date', type: 'temporal', accessor: 'date' }
      ]
    },
    space: { width: 960, height: 600 },
    scales: {},
    layers: [
      { id: 'background', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#ddd' } } },
      { id: 'states', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'white' }, strokeLinejoin: { value: 'round' } } },
      { id: 'stores', mark: { type: 'circle' }, encoding: { cx: { field: 'longitude', transform: [{ type: 'projection' }] }, cy: { field: 'latitude', transform: [{ type: 'projection' }] }, r: { value: 0 }, fill: { value: 'none' }, stroke: { value: 'black' } } }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: '.stores circle', properties: { r: 3 }, duration: 250 }] }
    ]
  },

  hierarchicalBarChart: {
    id: 'hierarchical-bar-chart',
    title: 'Hierarchical Bar Chart',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [{ type: 'hierarchy', params: { value: 'value', sum: true } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'linear', range: [0, 928] },
      y: { type: 'band', range: [0, 500] }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { value: 0 }, y: { field: 'y' }, width: { field: 'value', scale: 'x' }, height: { value: 'bandwidth' }, fill: { value: 'steelblue' } } }
    ]
  },

  zoomableTreemap: {
    id: 'zoomable-treemap',
    title: 'Zoomable Treemap',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'treemap', params: { tile: 'treemapBinary' } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 924 },
    scales: {
      x: { type: 'linear', range: [0, 928] },
      y: { type: 'linear', range: [0, 924] }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { value: '#ddd' }, stroke: { value: '#fff' } } }
    ],
    behaviors: [
      { type: 'click', target: '.cells rect', handlers: { click: { action: 'zoomToCell' } } }
    ]
  },

  collapsibleTree: {
    id: 'collapsible-tree',
    title: 'Collapsible Tree',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [{ type: 'tree', params: { nodeSize: [10, 200] } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 10, right: 10, bottom: 10, left: 40 } },
    scales: {},
    layers: [
      { id: 'links', mark: { type: 'path', generator: { type: 'linkHorizontal' } }, encoding: { stroke: { value: '#555' }, strokeOpacity: { value: 0.4 }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'nodes', mark: { type: 'circle' }, encoding: { cx: { field: 'y' }, cy: { field: 'x' }, r: { value: 2.5 }, fill: { value: '#555' }, stroke: { value: 'white' }, strokeWidth: { value: 10 } } }
    ],
    behaviors: [
      { type: 'click', target: '.nodes circle', handlers: { click: { action: 'toggleNode' } } }
    ]
  },

  zoomableIcicle: {
    id: 'zoomable-icicle',
    title: 'Zoomable Icicle',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.height - a.height || b.value - a.value } },
        { type: 'partition', params: { size: [1200, 928] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 1200 },
    scales: {
      color: { type: 'ordinal', scheme: 'Rainbow' }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'y0' }, y: { field: 'x0' }, width: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, height: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, fill: { field: 'depth', scale: 'color' }, fillOpacity: { value: 0.6 } } }
    ],
    behaviors: [
      { type: 'click', target: '.cells rect', handlers: { click: { action: 'zoomToCell' } } }
    ]
  },

  zoomableSunburst: {
    id: 'zoomable-sunburst',
    title: 'Zoomable Sunburst',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'partition', params: { size: [2 * Math.PI, 464] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      color: { type: 'ordinal', scheme: 'Rainbow' }
    },
    layers: [
      {
        id: 'arcs',
        mark: { type: 'arc', generator: { type: 'arc', params: { padAngle: 0.005, padRadius: 232 } } },
        encoding: {
          startAngle: { field: 'x0' },
          endAngle: { field: 'x1' },
          innerRadius: { field: 'y0', transform: [{ type: 'scale', params: { factor: 232 } }] },
          outerRadius: { field: 'y1', transform: [{ type: 'scale', params: { factor: 232 } }] },
          fill: { field: 'depth', scale: 'color' },
          fillOpacity: { value: 0.6 }
        },
        style: { transform: 'translate(464px, 464px)' }
      }
    ],
    behaviors: [
      { type: 'click', target: '.arcs path', handlers: { click: { action: 'zoomToArc' } } }
    ]
  },

  barChartTransitions: {
    id: 'bar-chart-transitions',
    title: 'Bar Chart Transitions',
    data: {
      source: { type: 'generated', options: { count: 26, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 640, height: 400, margin: { top: 20, right: 0, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [40, 640], params: { padding: 0.1 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [0, d3.max(values)] }, range: [370, 20], nice: true }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'letter', scale: 'x' }, y: { field: 'frequency', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'frequency', transform: [{ type: 'custom', expression: (d, data) => 370 - this.getEncodedValue(data, { field: 'frequency', scale: 'y' }) }] }, fill: { value: 'steelblue' } } }
    ],
    animations: [
      { trigger: 'update', sequence: [{ target: '.bars rect', properties: { x: 'x', y: 'y' }, duration: 750 }] }
    ]
  },

  icelandicPopulationByAge: {
    id: 'icelandic-population-by-age',
    title: 'Icelandic Population by Age 1841-2019',
    data: {
      source: { type: 'generated', options: { type: 'population-pyramid' } },
      fields: [
        { name: 'year', type: 'temporal', accessor: 'year' },
        { name: 'age', type: 'quantitative', accessor: 'age' },
        { name: 'sex', type: 'nominal', accessor: 'sex' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 34, left: 0 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'age', method: 'values' }, range: [898, 0] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max' }, range: [466, 20] },
      color: { type: 'ordinal', domain: ['M', 'F'], range: ['#4e79a7', '#e15759'] }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'age', scale: 'x' }, y: { field: 'value', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'value', transform: [{ type: 'custom', expression: (d, data) => 466 - this.getEncodedValue(data, { field: 'value', scale: 'y' }) }] }, fill: { field: 'sex', scale: 'color' } } }
    ]
  },

  pieChartUpdate: {
    id: 'pie-chart-update',
    title: 'Pie Chart Update',
    data: {
      source: { type: 'generated', options: { type: 'fruit-data' } },
      transforms: [{ type: 'pie', params: { value: 'apples', sort: null } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      color: { type: 'ordinal', scheme: 'Observable10' }
    },
    layers: [
      {
        id: 'slices',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 187.5, outerRadius: 250 } } },
        encoding: { fill: { field: 'index', scale: 'color' } },
        style: { transform: 'translate(464px, 250px)' }
      }
    ],
    animations: [
      { trigger: 'update', sequence: [{ target: '.slices path', properties: { d: 'arc' }, duration: 750 }] }
    ]
  },

  arcTween: {
    id: 'arc-tween',
    title: 'Arc Tween',
    data: {
      source: { type: 'inline', data: [{ endAngle: 0.127 * 2 * Math.PI }] },
      fields: [
        { name: 'endAngle', type: 'quantitative', accessor: 'endAngle' }
      ]
    },
    space: { width: 640, height: 640 },
    scales: {},
    layers: [
      {
        id: 'background',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 200, outerRadius: 250, startAngle: 0, endAngle: 2 * Math.PI } } },
        encoding: { fill: { value: '#ddd' } },
        style: { transform: 'translate(320px, 320px)' }
      },
      {
        id: 'foreground',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 200, outerRadius: 250, startAngle: 0 } } },
        encoding: { fill: { value: 'orange' } },
        style: { transform: 'translate(320px, 320px)' }
      }
    ],
    animations: [
      { trigger: 'time', sequence: [{ target: '.foreground path', properties: { d: 'arcTween' }, duration: 750 }] }
    ]
  },

  // === INTERACTIVE CHARTS ===

  versorDragging: {
    id: 'versor-dragging',
    title: 'Versor Dragging',
    data: {
      source: { type: 'generated', options: { type: 'world-land' } },
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'sphere', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#fff' } } },
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' } } },
      { id: 'outline', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#000' } } }
    ],
    behaviors: [
      { type: 'drag', target: 'canvas', handlers: { drag: { action: 'rotateProjection' } } }
    ]
  },

  sequencesSunburst: {
    id: 'sequences-sunburst',
    title: 'Sequences Sunburst',
    data: {
      source: { type: 'generated', options: { type: 'sequences' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'size', sum: true } },
        { type: 'partition', params: { size: [2 * Math.PI, 200] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'size', type: 'quantitative', accessor: 'size' }
      ]
    },
    space: { width: 600, height: 600 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      {
        id: 'arcs',
        mark: { type: 'arc', generator: { type: 'arc' } },
        encoding: { fill: { field: 'name', scale: 'color' } },
        style: { transform: 'translate(300px, 300px)' },
        when: { type: 'expression', test: 'd => d.depth > 0 && d.x1 - d.x0 > 0.001' }
      }
    ],
    behaviors: [
      { type: 'hover', target: '.arcs path', handlers: { mouseover: { action: 'highlightSequence' } } }
    ]
  },

  brushableScatterplot: {
    id: 'brushable-scatterplot',
    title: 'Brushable Scatterplot',
    data: {
      source: { type: 'generated', options: { type: 'cars' } },
      fields: [
        { name: 'mpg', type: 'quantitative', accessor: 'Miles_per_Gallon' },
        { name: 'hp', type: 'quantitative', accessor: 'Horsepower' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'mpg', method: 'max', transform: values => [0, d3.max(values)] }, range: [40, 898], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'hp', method: 'max', transform: values => [0, d3.max(values)] }, range: [570, 20], nice: true }
    },
    layers: [
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'mpg', scale: 'x' }, cy: { field: 'hp', scale: 'y' }, r: { value: 3 }, fill: { value: 'none' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 } } }
    ],
    behaviors: [
      { type: 'brush', target: 'svg', handlers: { brush: { action: 'selectPoints' } } }
    ]
  },

  pannableChart: {
    id: 'pannable-chart',
    title: 'Pannable Chart',
    data: {
      source: { type: 'generated', options: { type: 'stock-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'close', type: 'quantitative', accessor: 'close' }
      ]
    },
    space: { width: 928, height: 420, margin: { top: 20, right: 20, bottom: 30, left: 30 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [30, 5568] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'close', method: 'max', transform: values => [0, d3.max(values)] }, range: [390, 20], nice: true }
    },
    layers: [
      { id: 'area', mark: { type: 'area', generator: { type: 'area', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, y2: { value: 390 }, fill: { value: 'steelblue' } } }
    ],
    behaviors: [
      { type: 'pan', target: '.chart-body', params: { direction: 'horizontal' } }
    ]
  },

  zoomableBarChart: {
    id: 'zoomable-bar-chart',
    title: 'Zoomable Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 26, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 0, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [40, 928], params: { padding: 0.1 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20], nice: true }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'letter', scale: 'x' }, y: { field: 'frequency', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'frequency', transform: [{ type: 'custom', expression: (d, data) => 470 - this.getEncodedValue(data, { field: 'frequency', scale: 'y' }) }] }, fill: { value: 'steelblue' } } }
    ],
    behaviors: [
      { type: 'zoom', target: 'svg', params: { scaleExtent: [1, 8] } }
    ]
  },

  seamlessZoomableMapTiles: {
    id: 'seamless-zoomable-map-tiles',
    title: 'Seamless Zoomable Map Tiles',
    data: {
      source: { type: 'generated', options: { type: 'map-tiles' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'z', type: 'quantitative', accessor: 'z' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'tiles', mark: { type: 'image' }, encoding: { x: { field: 'x' }, y: { field: 'y' }, width: { field: 'k' }, height: { field: 'k' }, href: { field: 'url' } } }
    ],
    behaviors: [
      { type: 'zoom', target: 'svg', handlers: { zoom: { action: 'updateTiles' } } }
    ]
  },

  // === STATISTICAL CHARTS ===

  movingAverage: {
    id: 'moving-average',
    title: 'Moving Average',
    data: {
      source: { type: 'generated', options: { type: 'events' } },
      transforms: [
        { type: 'bin', params: { field: 'date', thresholds: 'timeDay' } },
        { type: 'movingAverage', params: { window: 7 } }
      ],
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 12, bottom: 30, left: 30 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [30, 916] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max' }, range: [470, 20], nice: true }
    },
    layers: [
      { id: 'area', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, y2: { value: 470 }, fill: { value: 'steelblue' } } }
    ]
  },

  bollingerBands: {
    id: 'bollinger-bands',
    title: 'Bollinger Bands',
    data: {
      source: { type: 'generated', options: { type: 'stock-prices' } },
      transforms: [
        { type: 'bollingerBands', params: { field: 'Close', period: 20, multiplier: 2 } }
      ],
      fields: [
        { name: 'Date', type: 'temporal', accessor: 'Date' },
        { name: 'Close', type: 'quantitative', accessor: 'Close' },
        { name: 'upperBand', type: 'quantitative', accessor: 'upperBand' },
        { name: 'lowerBand', type: 'quantitative', accessor: 'lowerBand' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 10, right: 20, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'Date', method: 'extent' }, range: [40, 908] },
      y: { type: 'log', domainFrom: { data: 'main', field: 'Close', method: 'extent' }, range: [570, 10] }
    },
    layers: [
      { id: 'bands', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'Date', scale: 'x' }, y: { field: 'band', scale: 'y' }, stroke: { field: 'type' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  kernelDensityEstimation: {
    id: 'kernel-density-estimation',
    title: 'Kernel Density Estimation',
    data: {
      source: { type: 'generated', options: { type: 'random-data' } },
      transforms: [
        { type: 'kde', params: { bandwidth: 7, thresholds: 40 } }
      ],
      fields: [
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'density', type: 'quantitative', accessor: 'density' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [0, 928] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'density', method: 'max' }, range: [500, 0] }
    },
    layers: [
      { id: 'curve', mark: { type: 'line', generator: { type: 'line', curve: 'curveBasis' } }, encoding: { x: { field: 'value', scale: 'x' }, y: { field: 'density', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } }
    ]
  },

  hexbinArea: {
    id: 'hexbin-area',
    title: 'Hexbin Area',
    data: {
      source: { type: 'generated', options: { type: 'diamonds' } },
      transforms: [
        { type: 'hexbin', params: { x: 'carat', y: 'price', radius: 10 } }
      ],
      fields: [
        { name: 'carat', type: 'quantitative', accessor: 'carat' },
        { name: 'price', type: 'quantitative', accessor: 'price' }
      ]
    },
    space: { width: 928, height: 928, margin: { top: 20, right: 20, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'log', domainFrom: { data: 'main', field: 'carat', method: 'extent' }, range: [40, 908] },
      y: { type: 'log', domainFrom: { data: 'main', field: 'price', method: 'extent' }, range: [908, 20] },
      size: { type: 'sqrt', domainFrom: { data: 'main', field: 'length', method: 'max' }, range: [0, 20] }
    },
    layers: [
      { id: 'hexagons', mark: { type: 'path', generator: { type: 'hexagon' } }, encoding: { fill: { value: '#ddd' }, stroke: { value: 'black' } } }
    ]
  },

  hexbinMap: {
    id: 'hexbin-map',
    title: 'Hexbin Map',
    data: {
      source: { type: 'generated', options: { type: 'walmart-locations' } },
      transforms: [
        { type: 'projection', params: { type: 'albersUsa', scale: 1280, translate: [464, 290.5] } },
        { type: 'hexbin', params: { extent: [[0, 0], [928, 581]], radius: 10 } }
      ],
      fields: [
        { name: 'longitude', type: 'quantitative', accessor: 'longitude' },
        { name: 'latitude', type: 'quantitative', accessor: 'latitude' },
        { name: 'date', type: 'temporal', accessor: 'date' }
      ]
    },
    space: { width: 928, height: 581 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateSpectral', domainFrom: { data: 'main', field: 'date', method: 'extent' } },
      size: { type: 'sqrt', domainFrom: { data: 'main', field: 'length', method: 'max' }, range: [0, 20] }
    },
    layers: [
      { id: 'states', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#777' }, strokeWidth: { value: 0.5 }, strokeLinejoin: { value: 'round' } } },
      { id: 'hexagons', mark: { type: 'path', generator: { type: 'hexagon' } }, encoding: { fill: { field: 'date', scale: 'color' }, stroke: { field: 'date', scale: 'color', transform: [{ type: 'custom', expression: (d, data) => d3.lab(this.scales.get('color')(data.date)).darker() }] } } }
    ]
  },

  qqPlot: {
    id: 'q-q-plot',
    title: 'Q-Q Plot',
    data: {
      source: { type: 'generated', options: { type: 'two-batches' } },
      transforms: [
        { type: 'quantile', params: { field1: 'batch1', field2: 'batch2' } }
      ],
      fields: [
        { name: 'batch1', type: 'quantitative', accessor: 'batch1' },
        { name: 'batch2', type: 'quantitative', accessor: 'batch2' }
      ]
    },
    space: { width: 640, height: 640, margin: { top: 20, right: 40, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', range: [40, 600], nice: true },
      y: { type: 'linear', range: [600, 20], nice: true }
    },
    layers: [
      { id: 'reference', mark: { type: 'line' }, encoding: { x1: { field: 'qmin', scale: 'x' }, y1: { field: 'qmin', scale: 'y' }, x2: { field: 'qmax', scale: 'x' }, y2: { field: 'qmax', scale: 'y' }, stroke: { value: 'currentColor' }, strokeOpacity: { value: 0.3 } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'batch2', scale: 'x' }, cy: { field: 'batch1', scale: 'y' }, r: { value: 3 }, fill: { value: 'none' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  normalQuantilePlot: {
    id: 'normal-quantile-plot',
    title: 'Normal Quantile Plot',
    data: {
      source: { type: 'generated', options: { type: 'normal-data' } },
      transforms: [
        { type: 'quantile', params: { field: 'value', distribution: 'normal' } }
      ],
      fields: [
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'quantile', type: 'quantitative', accessor: 'quantile' }
      ]
    },
    space: { width: 640, height: 640, margin: { top: 20, right: 40, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', domain: [-3, 3], range: [40, 600], nice: true },
      y: { type: 'linear', range: [600, 20], nice: true }
    },
    layers: [
      { id: 'regression', mark: { type: 'line' }, encoding: { stroke: { value: 'currentColor' }, strokeOpacity: { value: 0.3 } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'quantile', scale: 'x' }, cy: { field: 'value', scale: 'y' }, r: { value: 3 }, fill: { value: 'none' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  parallelSets: {
    id: 'parallel-sets',
    title: 'Parallel Sets',
    data: {
      source: { type: 'generated', options: { type: 'titanic' } },
      transforms: [
        { type: 'sankey', params: { nodeSort: null, linkSort: null, nodeWidth: 4, nodePadding: 20, extent: [[0, 5], [928, 715]] } }
      ],
      fields: [
        { name: 'class', type: 'nominal', accessor: 'class' },
        { name: 'sex', type: 'nominal', accessor: 'sex' },
        { name: 'age', type: 'nominal', accessor: 'age' },
        { name: 'survived', type: 'nominal', accessor: 'survived' }
      ]
    },
    space: { width: 928, height: 720 },
    scales: {
      color: { type: 'ordinal', domain: ['Perished'], range: ['#da4f81'] }
    },
    layers: [
      { id: 'nodes', data: 'nodes', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] } } },
      { id: 'links', data: 'links', mark: { type: 'path', generator: { type: 'sankeyLinkHorizontal' } }, encoding: { fill: { value: 'none' }, stroke: { field: 'names.0', scale: 'color' }, strokeWidth: { field: 'width' } } }
    ]
  },

  // === HIERARCHICAL SPECIALIZED ===

  cascadedTreemap: {
    id: 'cascaded-treemap',
    title: 'Cascaded Treemap',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'treemap', params: { size: [928, 1060], paddingOuter: 3, paddingTop: 19, paddingInner: 1, round: true } },
        { type: 'cascade', params: { offset: 3 } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 928, height: 1060 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateMagma', domain: [8, 0] }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'depth', scale: 'color' } } }
    ]
  },

  nestedTreemap: {
    id: 'nested-treemap',
    title: 'Nested Treemap',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'treemap', params: { size: [928, 1060], paddingOuter: 3, paddingTop: 19, paddingInner: 1, round: true } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 928, height: 1060 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateMagma', domain: [8, 0] }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'depth', scale: 'color' } } }
    ]
  },

  indentedTree: {
    id: 'indented-tree',
    title: 'Indented Tree',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [{ type: 'hierarchy', params: { value: 'value' } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'links', mark: { type: 'path' }, encoding: { stroke: { value: '#999' }, fill: { value: 'none' } } },
      { id: 'nodes', mark: { type: 'circle' }, encoding: { cx: { field: 'depth', transform: [{ type: 'scale', params: { factor: 17 } }] }, cy: { field: 'index', transform: [{ type: 'scale', params: { factor: 17 } }] }, r: { value: 2.5 }, fill: { value: '#999' } } },
      { id: 'labels', mark: { type: 'text' }, encoding: { x: { field: 'depth', transform: [{ type: 'scale', params: { factor: 17 } }, { type: 'offset', params: { offset: 6 } }] }, y: { field: 'index', transform: [{ type: 'scale', params: { factor: 17 } }] }, text: { field: 'name' }, dy: { value: '0.32em' } } }
    ]
  },

  radialCluster: {
    id: 'radial-cluster',
    title: 'Radial Cluster',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { sort: (a, b) => d3.ascending(a.data.name, b.data.name) } },
        { type: 'cluster', params: { size: [2 * Math.PI, 536], separation: (a, b) => (a.parent == b.parent ? 1 : 2) / a.depth } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' }
      ]
    },
    space: { width: 1152, height: 1152 },
    scales: {},
    layers: [
      {
        id: 'links',
        mark: { type: 'path', generator: { type: 'linkRadial' } },
        encoding: { stroke: { value: '#555' }, strokeOpacity: { value: 0.4 }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } },
        style: { transform: 'translate(576px, 622px)' }
      },
      {
        id: 'nodes',
        mark: { type: 'circle' },
        encoding: { r: { value: 2.5 }, fill: { value: '#555' } },
        style: { transform: 'translate(576px, 622px)' }
      }
    ]
  },

  treeOfLife: {
    id: 'tree-of-life',
    title: 'Tree of Life',
    data: {
      source: { type: 'generated', options: { type: 'phylogenetic' } },
      transforms: [
        { type: 'hierarchy', params: { children: 'branchset', sum: d => d.branchset ? 0 : 1, sort: (a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length) } },
        { type: 'cluster', params: {} }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'length', type: 'quantitative', accessor: 'data.length' }
      ]
    },
    space: { width: 954, height: 954 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'links', mark: { type: 'path', generator: { type: 'linkConstant' } }, encoding: { stroke: { field: 'color' }, fill: { value: 'none' } } },
      { id: 'labels', mark: { type: 'text' }, encoding: { text: { field: 'name', transform: [{ type: 'custom', expression: d => d.replace(/_/g, ' ') }] }, textAnchor: { field: 'x', transform: [{ type: 'custom', expression: (d, data) => data.x < Math.PI ? 'start' : 'end' }] } } }
    ]
  },

  forceDirectedTree: {
    id: 'force-directed-tree',
    title: 'Force-Directed Tree',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: {} },
        { type: 'force', params: { forces: { link: { distance: 0, strength: 1 }, charge: { strength: -50 }, x: {}, y: {} } } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' }
      ]
    },
    space: { width: 928, height: 600 },
    scales: {},
    layers: [
      { id: 'links', data: 'links', mark: { type: 'line' }, encoding: { stroke: { value: '#999' }, strokeOpacity: { value: 0.6 } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'circle' }, encoding: { r: { value: 3.5 }, fill: { value: '#fff' }, stroke: { value: '#000' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  // === NETWORK SPECIALIZED ===

  disjointForceDirectedGraph: {
    id: 'disjoint-force-directed-graph',
    title: 'Disjoint Force-Directed Graph',
    data: {
      source: { type: 'generated', options: { type: 'disjoint-network' } },
      transforms: [{ type: 'force', params: { forces: { link: { distance: 30 }, charge: { strength: -300 }, x: {}, y: {} } } }],
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'group', type: 'nominal', accessor: 'group' }
      ]
    },
    space: { width: 928, height: 680 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'links', data: 'links', mark: { type: 'line' }, encoding: { stroke: { value: '#999' }, strokeOpacity: { value: 0.6 }, strokeWidth: { field: 'value', transform: [{ type: 'sqrt' }] } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'circle' }, encoding: { r: { value: 5 }, fill: { field: 'group', scale: 'color' }, stroke: { value: '#fff' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  mobilePatentSuits: {
    id: 'mobile-patent-suits',
    title: 'Mobile Patent Suits',
    data: {
      source: { type: 'generated', options: { type: 'patent-suits' } },
      transforms: [{ type: 'force', params: { forces: { link: {}, charge: { strength: -400 }, x: {}, y: {} } } }],
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'type', type: 'nominal', accessor: 'type' }
      ]
    },
    space: { width: 928, height: 600 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'type', method: 'values' } }
    },
    layers: [
      { id: 'links', data: 'links', mark: { type: 'path', generator: { type: 'linkArc' } }, encoding: { stroke: { field: 'type', scale: 'color' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' }, markerEnd: { field: 'type', transform: [{ type: 'custom', expression: (d, data) => `url(#arrow-${data.type})` }] } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'circle' }, encoding: { r: { value: 4 }, fill: { value: 'currentColor' }, stroke: { value: 'white' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  directedChordDiagram: {
    id: 'directed-chord-diagram',
    title: 'Directed Chord Diagram',
    data: {
      source: { type: 'generated', options: { type: 'directed-matrix' } },
      transforms: [
        { type: 'chordDirected', params: { padAngle: 0.02, sortSubgroups: d3.descending, sortChords: d3.descending } }
      ],
      fields: [
        { name: 'index', type: 'quantitative', accessor: 'index' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 1080, height: 1080 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      {
        id: 'ribbons',
        data: 'chords',
        mark: { type: 'path', generator: { type: 'ribbonArrow', params: { radius: 539 } } },
        encoding: { fill: { field: 'target.index', scale: 'color' }, fillOpacity: { value: 0.75 } },
        style: { transform: 'translate(540px, 540px)', mixBlendMode: 'multiply' }
      },
      {
        id: 'arcs',
        data: 'groups',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 540, outerRadius: 546 } } },
        encoding: { fill: { field: 'index', scale: 'color' } },
        style: { transform: 'translate(540px, 540px)' }
      }
    ]
  },

  chordDependencyDiagram: {
    id: 'chord-dependency-diagram',
    title: 'Chord Dependency Diagram',
    data: {
      source: { type: 'generated', options: { type: 'dependency-matrix' } },
      transforms: [
        { type: 'chordDirected', params: { padAngle: 0.02, sortSubgroups: d3.descending, sortChords: d3.descending } }
      ],
      fields: [
        { name: 'source', type: 'nominal', accessor: 'source' },
        { name: 'target', type: 'nominal', accessor: 'target' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 1080, height: 1080 },
    scales: {
      color: { type: 'quantize', interpolator: 'interpolateRainbow' }
    },
    layers: [
      {
        id: 'ribbons',
        data: 'chords',
        mark: { type: 'path', generator: { type: 'ribbonArrow', params: { radius: 539 } } },
        encoding: { fill: { field: 'target.index', scale: 'color' } },
        style: { transform: 'translate(540px, 540px)' }
      }
    ]
  },

  // === GEOGRAPHIC CHARTS ===

  bivariateChloropleth: {
    id: 'bivariate-choropleth',
    title: 'Bivariate Choropleth',
    data: {
      source: { type: 'generated', options: { type: 'us-counties-health' } },
      fields: [
        { name: 'diabetes', type: 'quantitative', accessor: 'diabetes' },
        { name: 'obesity', type: 'quantitative', accessor: 'obesity' },
        { name: 'county', type: 'nominal', accessor: 'county' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {
      x: { type: 'quantile', domainFrom: { data: 'main', field: 'diabetes', method: 'values' }, range: [0, 1, 2] },
      y: { type: 'quantile', domainFrom: { data: 'main', field: 'obesity', method: 'values' }, range: [0, 1, 2] }
    },
    layers: [
      { id: 'counties', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { field: 'bivariate', transform: [{ type: 'custom', expression: (d, data) => this.bivariateColor(data.diabetes, data.obesity) }] } } }
    ]
  },

  usStateChloropleth: {
    id: 'us-state-choropleth',
    title: 'US State Choropleth',
    data: {
      source: { type: 'generated', options: { type: 'us-states-unemployment' } },
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'rate', type: 'quantitative', accessor: 'properties.rate' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {
      color: { type: 'quantize', scheme: 'Blues', domainFrom: { data: 'main', field: 'rate', method: 'extent' } }
    },
    layers: [
      { id: 'states', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { field: 'rate', scale: 'color' } } }
    ]
  },

  worldChloropleth: {
    id: 'world-choropleth',
    title: 'World Choropleth',
    data: {
      source: { type: 'generated', options: { type: 'world-countries-hale' } },
      transforms: [
        { type: 'projection', params: { type: 'equalEarth', fitExtent: [[2, 48], [926, 500]] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'properties.name' },
        { name: 'hale', type: 'quantitative', accessor: 'properties.hale' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 46 } },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateYlGnBu', domainFrom: { data: 'main', field: 'hale', method: 'extent' } }
    },
    layers: [
      { id: 'sphere', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'white' }, stroke: { value: 'currentColor' } } },
      { id: 'countries', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { field: 'hale', scale: 'color' } } }
    ]
  },

  // === SPECIALIZED CHARTS ===

  antimeridianCutting: {
    id: 'antimeridian-cutting',
    title: 'Antimeridian Cutting',
    data: {
      source: { type: 'generated', options: { type: 'world-land' } },
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' }
      ]
    },
    space: { width: 960, height: 500 },
    scales: {},
    layers: [
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' } } },
      { id: 'sphere', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#000' }, strokeWidth: { value: 1 } } }
    ],
    behaviors: [
      { type: 'drag', target: 'canvas', handlers: { drag: { action: 'rotateProjection' } } }
    ]
  },

  tissotIndicatrix: {
    id: 'tissot-indicatrix',
    title: 'Tissot\'s Indicatrix',
    data: {
      source: { type: 'generated', options: { type: 'tissot-circles' } },
      fields: [
        { name: 'coordinates', type: 'geojson', accessor: 'coordinates' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'circles', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'red' } } }
    ]
  },

  webMercatorTiles: {
    id: 'web-mercator-tiles',
    title: 'Web Mercator Tiles',
    data: {
      source: { type: 'generated', options: { type: 'map-tiles' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'z', type: 'quantitative', accessor: 'z' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'tiles', mark: { type: 'image' }, encoding: { x: { field: 'x' }, y: { field: 'y' }, width: { field: 'k' }, height: { field: 'k' }, href: { field: 'url' } } }
    ]
  },

  rasterTiles: {
    id: 'raster-tiles',
    title: 'Raster Tiles',
    data: {
      source: { type: 'generated', options: { type: 'raster-tiles' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'z', type: 'quantitative', accessor: 'z' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'tiles', mark: { type: 'image' }, encoding: { x: { field: 'x', transform: [{ type: 'custom', expression: (d, data) => Math.round((data.x + data.tx) * data.k) }] }, y: { field: 'y', transform: [{ type: 'custom', expression: (d, data) => Math.round((data.y + data.ty) * data.k) }] }, width: { field: 'k' }, height: { field: 'k' }, href: { field: 'url' } } }
    ]
  },

  vectorTiles: {
    id: 'vector-tiles',
    title: 'Vector Tiles',
    data: {
      source: { type: 'generated', options: { type: 'vector-tiles' } },
      fields: [
        { name: 'water', type: 'geojson', accessor: 'data.water' },
        { name: 'roads', type: 'geojson', accessor: 'data.roads' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'water', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#eee' } } },
      { id: 'roads', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#000' }, strokeWidth: { value: 0.75 } } }
    ]
  },

  clippedMapTiles: {
    id: 'clipped-map-tiles',
    title: 'Clipped Map Tiles',
    data: {
      source: { type: 'generated', options: { type: 'clipped-tiles' } },
      fields: [
        { name: 'land', type: 'geojson', accessor: 'land' }
      ]
    },
    space: { width: 928, height: 500, clips: [{ id: 'land-clip', type: 'path', params: { d: 'land-path' } }] },
    scales: {},
    layers: [
      { id: 'tiles', mark: { type: 'image' }, encoding: { x: { field: 'x' }, y: { field: 'y' }, width: { field: 'k' }, height: { field: 'k' }, href: { field: 'url' } }, clipPath: 'land-clip' }
    ]
  },

  rasterVector: {
    id: 'raster-vector',
    title: 'Raster & Vector',
    data: {
      source: { type: 'generated', options: { type: 'raster-vector' } },
      fields: [
        { name: 'vectors', type: 'geojson', accessor: 'vectors' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'tiles', mark: { type: 'image' }, encoding: { x: { field: 'x' }, y: { field: 'y' }, width: { field: 'k' }, height: { field: 'k' }, href: { field: 'url' } } },
      { id: 'vectors', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'red' } } }
    ]
  },

  vectorField: {
    id: 'vector-field',
    title: 'Vector Field',
    data: {
      source: { type: 'generated', options: { type: 'wind-data' } },
      fields: [
        { name: 'longitude', type: 'quantitative', accessor: 'longitude' },
        { name: 'latitude', type: 'quantitative', accessor: 'latitude' },
        { name: 'speed', type: 'quantitative', accessor: 'speed' },
        { name: 'direction', type: 'quantitative', accessor: 'dir' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      length: { type: 'sqrt', domainFrom: { data: 'main', field: 'speed', method: 'max' }, range: [0, 2] },
      color: { type: 'sequential', interpolator: 'interpolateRainbow', domain: [0, 360] }
    },
    layers: [
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#eee' }, strokeWidth: { value: 1.5 } } },
      { id: 'arrows', mark: { type: 'path' }, encoding: { fill: { field: 'direction', scale: 'color' }, transform: { field: 'arrow-path' } } }
    ]
  },

  geotiffContours: {
    id: 'geotiff-contours',
    title: 'GeoTIFF Contours',
    data: {
      source: { type: 'generated', options: { type: 'elevation-data' } },
      transforms: [
        { type: 'contours', params: { values: 'elevation', thresholds: 10 } }
      ],
      fields: [
        { name: 'elevation', type: 'quantitative', accessor: 'elevation' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 960, height: 500 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateSpectral', domainFrom: { data: 'main', field: 'value', method: 'extent' } }
    },
    layers: [
      { id: 'contours', mark: { type: 'path', generator: { type: 'geoPath' } }, encoding: { fill: { field: 'value', scale: 'color' }, stroke: { value: '#000' }, strokeWidth: { value: 0.5 }, strokeLinejoin: { value: 'round' }, strokeLinecap: { value: 'round' } } }
    ]
  },

  usAirportsVoronoi: {
    id: 'us-airports-voronoi',
    title: 'US Airports Voronoi',
    data: {
      source: { type: 'generated', options: { type: 'us-airports' } },
      transforms: [
        { type: 'voronoi', params: { x: 'longitude', y: 'latitude' } }
      ],
      fields: [
        { name: 'longitude', type: 'quantitative', accessor: 'longitude' },
        { name: 'latitude', type: 'quantitative', accessor: 'latitude' },
        { name: 'name', type: 'nominal', accessor: 'properties.name' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {},
    layers: [
      { id: 'states', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#ddd' } } },
      { id: 'voronoi', mark: { type: 'path', generator: { type: 'geoPath' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'steelblue' }, strokeLinejoin: { value: 'round' } } },
      { id: 'airports', mark: { type: 'circle' }, encoding: { cx: { field: 'longitude', transform: [{ type: 'projection' }] }, cy: { field: 'latitude', transform: [{ type: 'projection' }] }, r: { value: 1.5 } } }
    ]
  },

  worldAirportsVoronoi: {
    id: 'world-airports-voronoi',
    title: 'World Airports Voronoi',
    data: {
      source: { type: 'generated', options: { type: 'world-airports' } },
      transforms: [
        { type: 'voronoi', params: { x: 'longitude', y: 'latitude' } }
      ],
      fields: [
        { name: 'longitude', type: 'quantitative', accessor: 'longitude' },
        { name: 'latitude', type: 'quantitative', accessor: 'latitude' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'graticule', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#aaa' }, strokeWidth: { value: 0.5 } } },
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#000' }, strokeWidth: { value: 0.5 } } },
      { id: 'airports', mark: { type: 'circle' }, encoding: { r: { value: 1.5 }, fill: { value: '#f00' } } }
    ]
  },

  solarTerminator: {
    id: 'solar-terminator',
    title: 'Solar Terminator',
    data: {
      source: { type: 'generated', options: { type: 'world-land' } },
      transforms: [
        { type: 'solarTerminator', params: { date: 'current' } }
      ],
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'graticule', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#ccc' } } },
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' } } },
      { id: 'night', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'rgba(0,0,255,0.3)' } } }
    ]
  },

  solarPath: {
    id: 'solar-path',
    title: 'Solar Path',
    data: {
      source: { type: 'generated', options: { type: 'solar-data' } },
      fields: [
        { name: 'azimuth', type: 'quantitative', accessor: 'azimuth' },
        { name: 'elevation', type: 'quantitative', accessor: 'elevation' },
        { name: 'date', type: 'temporal', accessor: 'date' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'linear', domain: [0, 360], range: [0, 928] },
      y: { type: 'linear', domain: [0, 90], range: [500, 0] }
    },
    layers: [
      { id: 'path', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'azimuth', scale: 'x' }, y: { field: 'elevation', scale: 'y' }, stroke: { value: 'orange' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } }
    ]
  },

  starMap: {
    id: 'star-map',
    title: 'Star Map',
    data: {
      source: { type: 'generated', options: { type: 'star-catalog' } },
      transforms: [
        { type: 'projection', params: { type: 'stereographic', reflectY: true, scale: 404, clipExtent: [[0, 0], [954, 954]], rotate: [0, -90], translate: [477, 477] } },
        { type: 'voronoi', params: { extent: [[0, 0], [954, 954]] } }
      ],
      fields: [
        { name: 'ra', type: 'quantitative', accessor: 'ra' },
        { name: 'dec', type: 'quantitative', accessor: 'dec' },
        { name: 'magnitude', type: 'quantitative', accessor: 'magnitude' }
      ]
    },
    space: { width: 954, height: 954 },
    scales: {
      radius: { type: 'linear', domain: [6, -1], range: [0, 8] }
    },
    layers: [
      { id: 'graticule', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'currentColor' }, strokeOpacity: { value: 0.2 } } },
      { id: 'stars', mark: { type: 'circle' }, encoding: { r: { field: 'magnitude', scale: 'radius' }, stroke: { value: 'black' } } }
    ]
  },

  nonContiguousCartogram: {
    id: 'non-contiguous-cartogram',
    title: 'Non-Contiguous Cartogram',
    data: {
      source: { type: 'generated', options: { type: 'us-states-data' } },
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateReds', domainFrom: { data: 'main', field: 'value', method: 'extent' }, nice: true }
    },
    layers: [
      { id: 'states', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { field: 'value', scale: 'color' }, stroke: { value: '#000' }, transform: { field: 'cartogram-transform' } } }
    ]
  },

  // === ADVANCED STATISTICAL ===

  volcanoContours: {
    id: 'volcano-contours',
    title: 'Volcano Contours',
    data: {
      source: { type: 'generated', options: { type: 'volcano-elevation' } },
      transforms: [
        { type: 'contours', params: { size: [61, 87], thresholds: 20 } }
      ],
      fields: [
        { name: 'elevation', type: 'quantitative', accessor: 'values' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateTurbo', domainFrom: { data: 'main', field: 'elevation', method: 'extent' }, nice: true }
    },
    layers: [
      { id: 'contours', mark: { type: 'path', generator: { type: 'geoPath' } }, encoding: { fill: { field: 'value', scale: 'color' }, stroke: { value: 'black' } } }
    ]
  },

  contours: {
    id: 'contours',
    title: 'Contours',
    data: {
      source: { type: 'generated', options: { type: 'goldstein-price' } },
      transforms: [
        { type: 'contours', params: { thresholds: 20 } }
      ],
      fields: [
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateSpectral' }
    },
    layers: [
      { id: 'contours', mark: { type: 'path', generator: { type: 'geoPath' } }, encoding: { fill: { field: 'value', scale: 'color' }, stroke: { value: 'white' }, strokeWidth: { value: 0.5 } } }
    ]
  },

  // === TEMPORAL SPECIALIZED ===

  changeLineChart: {
    id: 'change-line-chart',
    title: 'Change Line Chart',
    data: {
      source: { type: 'generated', options: { type: 'stock-normalized' } },
      fields: [
        { name: 'Date', type: 'temporal', accessor: 'Date' },
        { name: 'Close', type: 'quantitative', accessor: 'Close' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 30, bottom: 30, left: 50 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'Date', method: 'extent' }, range: [50, 898] },
      y: { type: 'log', domain: [0.5, 2], range: [570, 20] }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'Date', scale: 'x' }, y: { field: 'normalized', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  cancerSurvivalRates: {
    id: 'cancer-survival-rates',
    title: 'Cancer Survival Rates',
    data: {
      source: { type: 'generated', options: { type: 'survival-data' } },
      fields: [
        { name: 'name', type: 'nominal', accessor: 'name' },
        { name: 'year', type: 'ordinal', accessor: 'year' },
        { name: 'survival', type: 'quantitative', accessor: 'survival' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 40, right: 50, bottom: 10, left: 50 } },
    scales: {
      x: { type: 'point', domain: ['5 Year', '10 Year', '15 Year', '20 Year'], range: [50, 878], params: { padding: 0.5 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'survival', method: 'extent' }, range: [590, 40] }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['name'] }, encoding: { x: { field: 'year', scale: 'x' }, y: { field: 'survival', scale: 'y' }, stroke: { value: 'currentColor' }, fill: { value: 'none' } } }
    ]
  },

  mareysTrains: {
    id: 'mareys-trains',
    title: 'Marey\'s Trains',
    data: {
      source: { type: 'generated', options: { type: 'train-schedule' } },
      fields: [
        { name: 'station', type: 'nominal', accessor: 'station' },
        { name: 'time', type: 'temporal', accessor: 'time' },
        { name: 'distance', type: 'quantitative', accessor: 'distance' },
        { name: 'type', type: 'nominal', accessor: 'type' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'distance', method: 'extent' }, range: [0, 928] },
      y: { type: 'time', domainFrom: { data: 'main', field: 'time', method: 'extent' }, range: [0, 500] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'type', method: 'values' } }
    },
    layers: [
      { id: 'trains', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['train'] }, encoding: { x: { field: 'distance', scale: 'x' }, y: { field: 'time', scale: 'y' }, stroke: { field: 'type', scale: 'color' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'stops', mark: { type: 'circle' }, encoding: { cx: { field: 'distance', scale: 'x' }, cy: { field: 'time', scale: 'y' }, r: { value: 2.5 }, fill: { field: 'type', scale: 'color' }, stroke: { value: 'white' } } }
    ]
  },

  variableColorLine: {
    id: 'variable-color-line',
    title: 'Variable Color Line',
    data: {
      source: { type: 'generated', options: { type: 'weather-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'temperature', type: 'quantitative', accessor: 'temperature' },
        { name: 'condition', type: 'nominal', accessor: 'condition' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 20, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 908] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'temperature', method: 'extent' }, range: [470, 20], nice: true },
      color: { type: 'ordinal', domainFrom: { data: 'main', field: 'condition', method: 'values' } }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'temperature', scale: 'y' }, stroke: { field: 'gradient' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } }
    ]
  },

  gradientEncoding: {
    id: 'gradient-encoding',
    title: 'Gradient Encoding',
    data: {
      source: { type: 'generated', options: { type: 'temperature-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'temperature', type: 'quantitative', accessor: 'temperature' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'temperature', method: 'extent' }, range: [470, 20], nice: true },
      color: { type: 'sequential', interpolator: 'interpolateTurbo', domainFrom: { data: 'main', field: 'temperature', method: 'extent' } }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'temperature', scale: 'y' }, stroke: { field: 'gradient' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  thresholdEncoding: {
    id: 'threshold-encoding',
    title: 'Threshold Encoding',
    data: {
      source: { type: 'generated', options: { type: 'temperature-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'temperature', type: 'quantitative', accessor: 'temperature' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'temperature', method: 'extent' }, range: [470, 20], nice: true }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'temperature', scale: 'y' }, stroke: { field: 'threshold-gradient' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  inequalityInAmericanCities: {
    id: 'inequality-in-american-cities',
    title: 'Inequality in American Cities',
    data: {
      source: { type: 'generated', options: { type: 'city-inequality' } },
      fields: [
        { name: 'POP_1980', type: 'quantitative', accessor: 'POP_1980' },
        { name: 'POP_2015', type: 'quantitative', accessor: 'POP_2015' },
        { name: 'R90_10_1980', type: 'quantitative', accessor: 'R90_10_1980' },
        { name: 'R90_10_2015', type: 'quantitative', accessor: 'R90_10_2015' }
      ]
    },
    space: { width: 928, height: 640, margin: { top: 24, right: 10, bottom: 34, left: 40 } },
    scales: {
      x: { type: 'log', domainFrom: { data: 'main', field: 'POP_1980', method: 'extent' }, range: [40, 918] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'R90_10_1980', method: 'extent' }, range: [606, 24] }
    },
    layers: [
      { id: 'arrows', mark: { type: 'path' }, encoding: { stroke: { field: 'gradient' }, fill: { value: 'none' }, markerEnd: { value: 'url(#arrow)' } } }
    ]
  },

  newZealandTourists: {
    id: 'new-zealand-tourists',
    title: 'New Zealand Tourists 1921-2018',
    data: {
      source: { type: 'generated', options: { type: 'tourist-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 50 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [50, 898] },
      yLinear: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20], nice: true },
      yLog: { type: 'log', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [470, 20] }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'yLinear' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  // === AREA CHARTS ===

  areaChartMissingData: {
    id: 'area-chart-missing-data',
    title: 'Area Chart with Missing Data',
    data: {
      source: { type: 'generated', options: { type: 'stock-missing' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'close', type: 'quantitative', accessor: 'close' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'close', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20] }
    },
    layers: [
      { id: 'area-missing', mark: { type: 'area', generator: { type: 'area', defined: d => !isNaN(d.close) } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, y2: { value: 470 }, fill: { value: '#ccc' } } },
      { id: 'area-complete', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, y2: { value: 470 }, fill: { value: 'steelblue' } } }
    ]
  },

  normalizedStackedAreaChart: {
    id: 'normalized-stacked-area-chart',
    title: 'Normalized Stacked Area Chart',
    data: {
      source: { type: 'generated', options: { type: 'unemployment-by-industry' } },
      transforms: [{ type: 'stack', params: { offset: 'stackOffsetExpand' } }],
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'industry', type: 'nominal', accessor: 'industry' },
        { name: 'unemployed', type: 'quantitative', accessor: 'unemployed' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 20, bottom: 20, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 908] },
      y: { type: 'linear', range: [480, 20] },
      color: { type: 'ordinal', scheme: 'Tableau10', domainFrom: { data: 'main', field: 'industry', method: 'values' } }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: '0', scale: 'y' }, y2: { field: '1', scale: 'y' }, fill: { field: 'industry', scale: 'color' } } }
    ]
  },

  usPopulationByState: {
    id: 'us-population-by-state',
    title: 'US Population by State 1790-1990',
    data: {
      source: { type: 'generated', options: { type: 'state-population' } },
      transforms: [{ type: 'stack', params: {} }],
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'state', type: 'nominal', accessor: 'state' },
        { name: 'population', type: 'quantitative', accessor: 'population' }
      ]
    },
    space: { width: 928, height: 720, margin: { top: 10, right: 10, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 918] },
      y: { type: 'linear', range: [690, 10] },
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: '0', scale: 'y' }, y2: { field: '1', scale: 'y' }, fill: { field: 'state', scale: 'color' }, fillOpacity: { value: 0.8 } } }
    ]
  },

  streamgraph: {
    id: 'streamgraph',
    title: 'Streamgraph',
    data: {
      source: { type: 'generated', options: { type: 'unemployment-by-industry' } },
      transforms: [{ type: 'stack', params: { offset: 'stackOffsetWiggle', order: 'stackOrderInsideOut' } }],
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'industry', type: 'nominal', accessor: 'industry' },
        { name: 'unemployed', type: 'quantitative', accessor: 'unemployed' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 10, right: 10, bottom: 20, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 918] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'unemployed', method: 'extent' }, range: [480, 20] },
      color: { type: 'ordinal', scheme: 'Tableau10', domainFrom: { data: 'main', field: 'industry', method: 'values' } }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: '0', scale: 'y' }, y2: { field: '1', scale: 'y' }, fill: { field: 'industry', scale: 'color' } } }
    ]
  },

  differenceChart: {
    id: 'difference-chart',
    title: 'Difference Chart',
    data: {
      source: { type: 'generated', options: { type: 'temperature-comparison' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value0', type: 'quantitative', accessor: 'value0' },
        { name: 'value1', type: 'quantitative', accessor: 'value1' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 20, bottom: 30, left: 30 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [30, 908] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value0', method: 'extent' }, range: [570, 20] }
    },
    layers: [
      { id: 'area-above', mark: { type: 'area', generator: { type: 'area', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value0', scale: 'y' }, y2: { value: 600 }, fill: { value: '#4575b4' } }, clipPath: 'above' },
      { id: 'area-below', mark: { type: 'area', generator: { type: 'area', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value0', scale: 'y' }, y2: { value: 0 }, fill: { value: '#d73027' } }, clipPath: 'below' }
    ]
  },

  bandChart: {
    id: 'band-chart',
    title: 'Band Chart',
    data: {
      source: { type: 'generated', options: { type: 'temperature-range' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'low', type: 'quantitative', accessor: 'low' },
        { name: 'high', type: 'quantitative', accessor: 'high' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'high', method: 'extent' }, range: [570, 20], nice: true }
    },
    layers: [
      { id: 'band', mark: { type: 'area', generator: { type: 'area', curve: 'curveStep' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'low', scale: 'y' }, y2: { field: 'high', scale: 'y' }, fill: { value: 'steelblue' } } }
    ]
  },

  // === SPECIALIZED INTERACTIONS ===

  lineChartMissingData: {
    id: 'line-chart-missing-data',
    title: 'Line Chart with Missing Data',
    data: {
      source: { type: 'generated', options: { type: 'stock-missing' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'close', type: 'quantitative', accessor: 'close' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'close', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20] }
    },
    layers: [
      { id: 'line-missing', mark: { type: 'line', generator: { type: 'line', defined: d => !isNaN(d.close) } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, stroke: { value: '#ccc' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'line-complete', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  multiLineChart: {
    id: 'multi-line-chart',
    title: 'Multi-line Chart',
    data: {
      source: { type: 'generated', options: { type: 'multi-stock' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'symbol', type: 'nominal', accessor: 'symbol' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [470, 20] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'symbol', method: 'values' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['symbol'] }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, stroke: { field: 'symbol', scale: 'color' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  lineWithTooltip: {
    id: 'line-with-tooltip',
    title: 'Line Chart with Tooltip',
    data: {
      source: { type: 'generated', options: { type: 'stock-data' } },
      fields: [
        { name: 'Date', type: 'temporal', accessor: 'Date' },
        { name: 'Close', type: 'quantitative', accessor: 'Close' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'Date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'Close', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20] }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'Date', scale: 'x' }, y: { field: 'Close', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ],
    behaviors: [
      { type: 'hover', target: 'svg', handlers: { mousemove: { action: 'showTooltip' }, mouseleave: { action: 'hideTooltip' } } }
    ]
  },

  // === BUBBLE AND SCATTER VARIANTS ===

  scatterplotWithShapes: {
    id: 'scatterplot-with-shapes',
    title: 'Scatterplot with Shapes',
    data: {
      source: { type: 'generated', options: { type: 'iris' } },
      fields: [
        { name: 'sepalLength', type: 'quantitative', accessor: 'sepalLength' },
        { name: 'sepalWidth', type: 'quantitative', accessor: 'sepalWidth' },
        { name: 'species', type: 'nominal', accessor: 'species' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 25, right: 20, bottom: 35, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'sepalLength', method: 'extent' }, range: [40, 908], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'sepalWidth', method: 'extent' }, range: [565, 25], nice: true },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'species', method: 'values' } },
      shape: { type: 'ordinal', domainFrom: { data: 'main', field: 'species', method: 'values' }, range: ['circle', 'cross', 'diamond'] }
    },
    layers: [
      { id: 'points', mark: { type: 'symbol' }, encoding: { x: { field: 'sepalLength', scale: 'x' }, y: { field: 'sepalWidth', scale: 'y' }, fill: { field: 'species', scale: 'color' }, shape: { field: 'species', scale: 'shape' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  splom: {
    id: 'splom',
    title: 'Scatterplot Matrix (SPLOM)',
    data: {
      source: { type: 'generated', options: { type: 'iris' } },
      fields: [
        { name: 'sepalLength', type: 'quantitative', accessor: 'sepalLength' },
        { name: 'sepalWidth', type: 'quantitative', accessor: 'sepalWidth' },
        { name: 'petalLength', type: 'quantitative', accessor: 'petalLength' },
        { name: 'petalWidth', type: 'quantitative', accessor: 'petalWidth' },
        { name: 'species', type: 'nominal', accessor: 'species' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'species', method: 'values' } }
    },
    layers: [
      { id: 'matrix', mark: { type: 'circle' }, encoding: { r: { value: 3.5 }, fillOpacity: { value: 0.7 }, fill: { field: 'species', scale: 'color' } } }
    ]
  },

  bubbleChart: {
    id: 'bubble-chart',
    title: 'Bubble Chart',
    data: {
      source: { type: 'generated', options: { type: 'flare' } },
      transforms: [
        { type: 'hierarchy', params: { children: 'children', value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'pack', params: { size: [926, 926], padding: 3 } }
      ],
      fields: [
        { name: 'id', type: 'nominal', accessor: 'data.id' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 928, margin: { top: 1, right: 1, bottom: 1, left: 1 } },
    scales: {
      color: { type: 'ordinal', scheme: 'Tableau10' }
    },
    layers: [
      { id: 'bubbles', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { field: 'r' }, fill: { field: 'group', scale: 'color' }, fillOpacity: { value: 0.7 } } }
    ]
  },

  beeswarmMirrored: {
    id: 'beeswarm-mirrored',
    title: 'Beeswarm Mirrored',
    data: {
      source: { type: 'generated', options: { type: 'cars' } },
      transforms: [
        { type: 'dodge', params: { radius: 7.5, x: 'weight' } }
      ],
      fields: [
        { name: 'weight', type: 'quantitative', accessor: 'weight' },
        { name: 'name', type: 'nominal', accessor: 'name' }
      ]
    },
    space: { width: 928, height: 160, margin: { top: 20, right: 20, bottom: 20, left: 20 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'weight', method: 'extent' }, range: [20, 908] }
    },
    layers: [
      { id: 'points-top', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y', transform: [{ type: 'custom', expression: (d, data) => 80 - 3 - 1.5 - data.y }] }, r: { value: 3 } } },
      { id: 'points-bottom', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y', transform: [{ type: 'custom', expression: (d, data) => 80 + 3 + 1.5 + data.y }] }, r: { value: 3 } } }
    ]
  },

  hertzsprungRussellDiagram: {
    id: 'hertzsprung-russell-diagram',
    title: 'Hertzsprung-Russell Diagram',
    data: {
      source: { type: 'generated', options: { type: 'star-data' } },
      fields: [
        { name: 'color', type: 'quantitative', accessor: 'color' },
        { name: 'absolute_magnitude', type: 'quantitative', accessor: 'absolute_magnitude' }
      ]
    },
    space: { width: 928, height: 1114, margin: { top: 40, right: 40, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'linear', domain: [-0.39, 2.19], range: [40, 888] },
      y: { type: 'linear', domain: [-7, 19], range: [40, 1074] }
    },
    layers: [
      { id: 'stars', mark: { type: 'rect' }, encoding: { x: { field: 'color', scale: 'x' }, y: { field: 'absolute_magnitude', scale: 'y' }, width: { value: 0.75 }, height: { value: 0.75 }, fill: { field: 'color', transform: [{ type: 'custom', expression: (d, data) => this.bv2rgb(data.color) }] } } }
    ]
  },

  // === ADDITIONAL CHART TYPES ===

  spikeMap: {
    id: 'spike-map',
    title: 'Spike Map',
    data: {
      source: { type: 'generated', options: { type: 'us-counties-population' } },
      fields: [
        { name: 'population', type: 'quantitative', accessor: 'population' },
        { name: 'centroid', type: 'geojson', accessor: 'centroid' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {
      length: { type: 'linear', domainFrom: { data: 'main', field: 'population', method: 'max', transform: values => [0, d3.max(values)] }, range: [0, 200] }
    },
    layers: [
      { id: 'background', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#ddd' } } },
      { id: 'spikes', mark: { type: 'path' }, encoding: { fill: { value: 'red' }, fillOpacity: { value: 0.5 }, stroke: { value: 'red' }, strokeWidth: { value: 0.5 }, d: { field: 'spike-path' } } }
    ]
  },

  beesWarm: {
    id: 'beeswarm',
    title: 'Beeswarm Plot',
    data: {
      source: { type: 'generated', options: { type: 'cars' } },
      transforms: [
        { type: 'dodge', params: { radius: 7.5, x: 'weight' } }
      ],
      fields: [
        { name: 'weight', type: 'quantitative', accessor: 'weight' },
        { name: 'name', type: 'nominal', accessor: 'name' }
      ]
    },
    space: { width: 928, height: 160, margin: { top: 20, right: 20, bottom: 20, left: 20 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'weight', method: 'extent' }, range: [20, 908] }
    },
    layers: [
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y', transform: [{ type: 'offset', params: { offset: 140 - 20 - 3 - 1.5 } }] }, r: { value: 3 } } }
    ]
  },

  // === LABELS AND ANNOTATIONS ===

  inlineLabels: {
    id: 'inline-labels',
    title: 'Inline Labels',
    data: {
      source: { type: 'generated', options: { type: 'fruit-sales' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'fruit', type: 'nominal', accessor: 'fruit' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 50, bottom: 30, left: 30 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [30, 878] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 30] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'fruit', method: 'values' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['fruit'] }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, stroke: { field: 'fruit', scale: 'color' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'labels', mark: { type: 'text' }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, text: { field: 'value' }, textAnchor: { value: 'middle' }, dy: { value: '0.35em' }, stroke: { value: 'white' }, strokeWidth: { value: 6 }, fill: { value: 'currentColor' } } }
    ]
  },

  directlyLabellingLines: {
    id: 'directly-labelling-lines',
    title: 'Directly Labelling Lines',
    data: {
      source: { type: 'generated', options: { type: 'multi-series' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'series', type: 'nominal', accessor: 'series' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [0, 928] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [500, 0] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'series', method: 'values' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['series'] }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, stroke: { field: 'series', scale: 'color' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } },
      { id: 'end-labels', mark: { type: 'text' }, encoding: { x: { field: 'last-date', scale: 'x', transform: [{ type: 'offset', params: { offset: 3 } }] }, y: { field: 'last-value', scale: 'y' }, text: { field: 'series' }, fill: { field: 'series', scale: 'color' }, paintOrder: { value: 'stroke' }, stroke: { value: 'white' }, strokeWidth: { value: 3 } } }
    ]
  },

  voronoiLabels: {
    id: 'voronoi-labels',
    title: 'Voronoi Labels',
    data: {
      source: { type: 'generated', options: { type: 'random-points' } },
      transforms: [
        { type: 'voronoi', params: { extent: [[0, 0], [928, 500]] } }
      ],
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'index', type: 'quantitative', accessor: 'index' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'connectors', mark: { type: 'line' }, encoding: { x1: { field: 'centroid.x' }, y1: { field: 'centroid.y' }, x2: { field: 'x' }, y2: { field: 'y' }, stroke: { value: 'orange' } } },
      { id: 'voronoi', mark: { type: 'path', generator: { type: 'voronoi' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#ccc' } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { value: 2 } } },
      { id: 'labels', mark: { type: 'text' }, encoding: { x: { field: 'centroid.x' }, y: { field: 'centroid.y' }, text: { field: 'index' } } }
    ]
  },

  occlusion: {
    id: 'occlusion',
    title: 'Occlusion',
    data: {
      source: { type: 'generated', options: { count: 1000, type: 'random-words' } },
      fields: [
        { name: 'word', type: 'nominal', accessor: 'word' },
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' }
      ]
    },
    space: { width: 928, height: 400 },
    scales: {},
    layers: [
      { id: 'labels', mark: { type: 'text' }, encoding: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'word' } } }
    ],
    behaviors: [
      { type: 'hover', target: '.labels text', handlers: { mouseover: { action: 'raiseAndOcclude' }, mouseout: { action: 'resetOcclusion' } } },
      { type: 'click', target: '.labels text', handlers: { click: { action: 'setPriority' } } }
    ]
  },

  graticuleLabelsStereographic: {
    id: 'graticule-labels-stereographic',
    title: 'Graticule Labels Stereographic',
    data: {
      source: { type: 'generated', options: { type: 'world-graticule' } },
      transforms: [
        { type: 'projection', params: { type: 'stereographic' } }
      ],
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'graticule', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: '#ccc' } } },
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' } } },
      { id: 'labels', mark: { type: 'text' }, encoding: { text: { field: 'label' }, textAnchor: { value: 'middle' } } }
    ]
  },

  styledAxes: {
    id: 'styled-axes',
    title: 'Styled Axes',
    data: {
      source: { type: 'generated', options: { type: 'revenue-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 0, bottom: 30, left: 0 } },
    scales: {
      x: { type: 'time', domain: [new Date('2010-08-01'), new Date('2012-08-01')], range: [0, 928] },
      y: { type: 'linear', domain: [0, 2e6], range: [470, 20] }
    },
    layers: [
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom', tickFormat: d => d <= d3.utcYear(d) ? d.getUTCFullYear() : null } }, encoding: { scale: { value: 'x' }, position: { value: [0, 470] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'right', tickSize: 928, tickFormat: 'formatTick' } }, encoding: { scale: { value: 'y' }, position: { value: [0, 0] } } }
    ]
  },

  colorLegend: {
    id: 'color-legend',
    title: 'Color Legend',
    data: {
      source: { type: 'inline', data: [] },
      fields: []
    },
    space: { width: 320, height: 44 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolateViridis', domain: [0, 100] }
    },
    layers: [
      { id: 'legend', mark: { type: 'legend', params: { type: 'color', title: 'Temperature (°F)' } }, encoding: { scale: { value: 'color' } } }
    ]
  },

  // === GROUPED AND DIVERGING ===

  groupedBarChart: {
    id: 'grouped-bar-chart',
    title: 'Grouped Bar Chart',
    data: {
      source: { type: 'generated', options: { type: 'population-by-age-state' } },
      fields: [
        { name: 'state', type: 'nominal', accessor: 'state' },
        { name: 'age', type: 'nominal', accessor: 'age' },
        { name: 'population', type: 'quantitative', accessor: 'population' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 10, right: 10, bottom: 20, left: 40 } },
    scales: {
      fx: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [40, 918], params: { paddingInner: 0.1 } },
      x: { type: 'band', domainFrom: { data: 'main', field: 'age', method: 'values' }, range: [0, 'fx.bandwidth'], params: { padding: 0.05 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'population', method: 'max', transform: values => [0, d3.max(values)] }, range: [580, 10], nice: true },
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'age', scale: 'x', transform: [{ type: 'offset', params: { offset: 'fx-position' } }] }, y: { field: 'population', scale: 'y' }, width: { value: 'x.bandwidth' }, height: { field: 'population', transform: [{ type: 'custom', expression: (d, data) => 580 - this.getEncodedValue(data, { field: 'population', scale: 'y' }) }] }, fill: { field: 'age', scale: 'color' } } }
    ]
  },

  divergingBarChart: {
    id: 'diverging-bar-chart',
    title: 'Diverging Bar Chart',
    data: {
      source: { type: 'generated', options: { type: 'state-population-change' } },
      fields: [
        { name: 'State', type: 'nominal', accessor: 'State' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 60, bottom: 10, left: 60 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [60, 868] },
      y: { type: 'band', domainFrom: { data: 'main', field: 'State', method: 'values' }, range: [30, 490], params: { padding: 0.1 } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'value', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(Math.min(data.value, 0)) }] }, y: { field: 'State', scale: 'y' }, width: { field: 'value', transform: [{ type: 'custom', expression: (d, data) => Math.abs(this.scales.get('x')(data.value) - this.scales.get('x')(0)) }] }, height: { value: 'bandwidth' }, fill: { field: 'value', transform: [{ type: 'custom', expression: (d, data) => data.value > 0 ? '#4575b4' : '#d73027' }] } } }
    ]
  },

  divergingStackedBarChart: {
    id: 'diverging-stacked-bar-chart',
    title: 'Diverging Stacked Bar Chart',
    data: {
      source: { type: 'generated', options: { type: 'survey-responses' } },
      transforms: [{ type: 'stack', params: { offset: 'stackOffsetDiverging' } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'name' },
        { name: 'category', type: 'nominal', accessor: 'category' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 40, right: 30, bottom: 0, left: 80 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [80, 898] },
      y: { type: 'band', domainFrom: { data: 'main', field: 'name', method: 'values' }, range: [40, 500], params: { padding: 0.1 } },
      color: { type: 'ordinal', scheme: 'Spectral' }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: '0', scale: 'x' }, y: { field: 'name', scale: 'y' }, width: { field: 'width', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data[1]) - this.scales.get('x')(data[0]) }] }, height: { value: 'bandwidth' }, fill: { field: 'category', scale: 'color' } } }
    ]
  },

  // === ADDITIONAL SPECIALIZED CHARTS ===

  revenueByMusicFormat: {
    id: 'revenue-by-music-format',
    title: 'Revenue by Music Format 1973-2018',
    data: {
      source: { type: 'generated', options: { type: 'music-revenue' } },
      transforms: [{ type: 'stack', params: {} }],
      fields: [
        { name: 'year', type: 'temporal', accessor: 'year' },
        { name: 'format', type: 'nominal', accessor: 'format' },
        { name: 'revenue', type: 'quantitative', accessor: 'revenue' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 30, bottom: 30, left: 30 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'year', method: 'values' }, range: [30, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'revenue', method: 'max' }, range: [470, 20], nice: true },
      color: { type: 'ordinal', domainFrom: { data: 'main', field: 'format', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'year', scale: 'x' }, y: { field: '1', scale: 'y' }, width: { value: 'bandwidth', transform: [{ type: 'offset', params: { offset: -1 } }] }, height: { field: 'height', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('y')(data[0]) - this.scales.get('y')(data[1]) }] }, fill: { field: 'format', scale: 'color' } } }
    ]
  },

  theImpactOfVaccines: {
    id: 'the-impact-of-vaccines',
    title: 'The Impact of Vaccines',
    data: {
      source: { type: 'generated', options: { type: 'measles-data' } },
      fields: [
        { name: 'state', type: 'nominal', accessor: 'state' },
        { name: 'year', type: 'temporal', accessor: 'year' },
        { name: 'rate', type: 'quantitative', accessor: 'rate' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 1, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'year', method: 'extent' }, range: [40, 927] },
      y: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [20, 460] },
      color: { type: 'sequential', interpolator: 'interpolatePuRd', domainFrom: { data: 'main', field: 'rate', method: 'max', transform: values => [0, d3.max(values)] } }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'year', scale: 'x', transform: [{ type: 'offset', params: { offset: 1 } }] }, y: { field: 'state', scale: 'y' }, width: { field: 'year', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data.year + 1) - this.scales.get('x')(data.year) - 1 }] }, height: { value: 'bandwidth', transform: [{ type: 'offset', params: { offset: -1 } }] }, fill: { field: 'rate', scale: 'color' } } }
    ]
  },

  electricUsage2019: {
    id: 'electric-usage-2019',
    title: 'Electric Usage 2019',
    data: {
      source: { type: 'generated', options: { type: 'electric-usage' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'usage', type: 'quantitative', accessor: 'usage' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [0, 928] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'usage', method: 'extent' }, range: [500, 0] }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'usage', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } }
    ]
  },

  // === STACKED VARIANTS ===

  stackedHorizontalBarChart: {
    id: 'stacked-horizontal-bar-chart',
    title: 'Stacked Horizontal Bar Chart',
    data: {
      source: { type: 'generated', options: { type: 'population-by-age-state' } },
      transforms: [{ type: 'stack', params: { keys: ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '≥70'] } }],
      fields: [
        { name: 'state', type: 'nominal', accessor: 'data.state' },
        { name: 'age', type: 'nominal', accessor: 'key' },
        { name: 'population', type: 'quantitative', accessor: '1' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 10, bottom: 0, left: 30 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'population', method: 'max' }, range: [30, 918] },
      y: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [30, 500], params: { padding: 0.08 } },
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: '0', scale: 'x' }, y: { field: 'state', scale: 'y' }, width: { field: 'width', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data[1]) - this.scales.get('x')(data[0]) }] }, height: { value: 'bandwidth' }, fill: { field: 'age', scale: 'color' } } }
    ]
  },

  stackedNormalizedHorizontalBar: {
    id: 'stacked-normalized-horizontal-bar',
    title: 'Stacked Normalized Horizontal Bar',
    data: {
      source: { type: 'generated', options: { type: 'population-by-age-state' } },
      transforms: [{ type: 'stack', params: { keys: ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '≥70'], offset: 'stackOffsetExpand' } }],
      fields: [
        { name: 'state', type: 'nominal', accessor: 'data.state' },
        { name: 'age', type: 'nominal', accessor: 'key' },
        { name: 'population', type: 'quantitative', accessor: '1' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 20, bottom: 0, left: 30 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'population', method: 'max' }, range: [30, 908] },
      y: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [30, 500], params: { padding: 0.08 } },
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: '0', scale: 'x' }, y: { field: 'state', scale: 'y' }, width: { field: 'width', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data[1]) - this.scales.get('x')(data[0]) }] }, height: { value: 'bandwidth' }, fill: { field: 'age', scale: 'color' } } }
    ]
  }
};

// Export all chart types
export function getAllCompleteChartTypes(): string[] {
  return Object.keys(completeChartSchemas);
}

// Get schema by type
export function getCompleteSchemaByType(type: string): CanonicalChartSchema | null {
  return completeChartSchemas[type] || null;
}

// Merge with main schemas
export const allChartSchemas = 
{
  ...chartSchemas,
  ...completeChartSchemas
};