import { CanonicalChartSchema } from '../types/canonical-schema';
import { completeChartSchemas, getAllCompleteChartTypes } from './complete-chart-schemas';

/**
 * Complete canonical schemas for all 154+ D3 chart types
 * Each schema demonstrates how any chart can be represented universally
 */

export const chartSchemas: Record<string, CanonicalChartSchema> = {
  // === BASIC CHARTS ===
  
  // 1. Bar Chart
  barChart: {
    id: 'bar-chart',
    title: 'Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 26, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 0, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [40, 928], params: { padding: 0.1 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 30], nice: true }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'letter', scale: 'x' }, y: { field: 'frequency', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'frequency', transform: [{ type: 'custom', expression: (d, data) => 470 - this.getEncodedValue(data, { field: 'frequency', scale: 'y' }) }] }, fill: { value: 'steelblue' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 470] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 2. Horizontal Bar Chart
  horizontalBarChart: {
    id: 'horizontal-bar-chart',
    title: 'Horizontal Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 26, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 0, bottom: 10, left: 30 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [0, d3.max(values)] }, range: [30, 928], nice: true },
      y: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [30, 490], params: { padding: 0.1 } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { value: 30 }, y: { field: 'letter', scale: 'y' }, width: { field: 'frequency', scale: 'x', transform: [{ type: 'offset', params: { offset: -30 } }] }, height: { value: 'bandwidth' }, fill: { value: 'steelblue' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'top' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 30] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [30, 0] } } }
    ]
  },

  // 3. Stacked Bar Chart
  stackedBarChart: {
    id: 'stacked-bar-chart',
    title: 'Stacked Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 50, type: 'stacked-data' } },
      transforms: [{ type: 'stack', params: { keys: ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '≥70'] } }],
      fields: [
        { name: 'state', type: 'ordinal', accessor: 'data.state' },
        { name: 'age', type: 'ordinal', accessor: 'key' },
        { name: 'population', type: 'quantitative', accessor: '1' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 10, right: 10, bottom: 20, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [40, 918], params: { padding: 0.1 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'population', method: 'max' }, range: [480, 10] },
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'state', scale: 'x' }, y: { field: '1', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'population', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('y')(data[0]) - this.scales.get('y')(data[1]) }] }, fill: { field: 'age', scale: 'color' } } }
    ]
  },

  // 4. Line Chart
  lineChart: {
    id: 'line-chart',
    title: 'Line Chart',
    data: {
      source: { type: 'generated', options: { count: 100, type: 'timeseries' } },
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
      { id: 'line', mark: { type: 'line', generator: { type: 'line' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  // 5. Area Chart
  areaChart: {
    id: 'area-chart',
    title: 'Area Chart',
    data: {
      source: { type: 'generated', options: { count: 100, type: 'timeseries' } },
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
      { id: 'area', mark: { type: 'area', generator: { type: 'area' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'close', scale: 'y' }, y2: { value: 470 }, fill: { value: 'steelblue' } } }
    ]
  },

  // 6. Scatter Plot
  scatterPlot: {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    data: {
      source: { type: 'generated', options: { count: 100, type: 'cars' } },
      fields: [
        { name: 'mpg', type: 'quantitative', accessor: 'mpg' },
        { name: 'hp', type: 'quantitative', accessor: 'hp' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 25, right: 20, bottom: 35, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'mpg', method: 'extent' }, range: [40, 908], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'hp', method: 'extent' }, range: [565, 25], nice: true }
    },
    layers: [
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'mpg', scale: 'x' }, cy: { field: 'hp', scale: 'y' }, r: { value: 3 }, fill: { value: 'none' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  // 7. Pie Chart
  pieChart: {
    id: 'pie-chart',
    title: 'Pie Chart',
    data: {
      source: { type: 'generated', options: { count: 6, type: 'pie-data' } },
      transforms: [{ type: 'pie', params: { value: 'value', sort: null } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'name', method: 'values' } }
    },
    layers: [
      {
        id: 'slices',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 0, outerRadius: 200 } } },
        encoding: {
          fill: { field: 'name', scale: 'color' },
          stroke: { value: 'white' }
        },
        style: { transform: 'translate(464px, 250px)' }
      }
    ]
  },

  // 8. Donut Chart
  donutChart: {
    id: 'donut-chart',
    title: 'Donut Chart',
    data: {
      source: { type: 'generated', options: { count: 6, type: 'pie-data' } },
      transforms: [{ type: 'pie', params: { value: 'value', padAngle: 0.02 } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'name', method: 'values' } }
    },
    layers: [
      {
        id: 'slices',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 134, outerRadius: 200 } } },
        encoding: {
          fill: { field: 'name', scale: 'color' },
          stroke: { value: 'white' }
        },
        style: { transform: 'translate(464px, 250px)' }
      }
    ]
  },

  // === HIERARCHICAL CHARTS ===

  // 9. Treemap
  treemap: {
    id: 'treemap',
    title: 'Treemap',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'treemap', params: { size: [1154, 1154], padding: 1, round: true } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 1154, height: 1154 },
    scales: {
      color: { type: 'ordinal', scheme: 'Tableau10', domainFrom: { data: 'main', field: 'depth', method: 'values' } }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'depth', scale: 'color' }, fillOpacity: { value: 0.6 } } }
    ]
  },

  // 10. Sunburst
  sunburst: {
    id: 'sunburst',
    title: 'Sunburst Chart',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'partition', params: { size: [2 * Math.PI, 464] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      color: { type: 'ordinal', scheme: 'Rainbow', domainFrom: { data: 'main', field: 'depth', method: 'values' } }
    },
    layers: [
      {
        id: 'arcs',
        mark: { type: 'arc', generator: { type: 'arc', params: { padAngle: 0.005, padRadius: 232 } } },
        encoding: {
          startAngle: { field: 'x0' },
          endAngle: { field: 'x1' },
          innerRadius: { field: 'y0' },
          outerRadius: { field: 'y1', transform: [{ type: 'offset', params: { offset: -1 } }] },
          fill: { field: 'depth', scale: 'color' },
          fillOpacity: { value: 0.6 }
        },
        style: { transform: 'translate(464px, 464px)' },
        when: { type: 'expression', test: 'd => d.depth > 0' }
      }
    ]
  },

  // 11. Pack (Circle Packing)
  pack: {
    id: 'pack',
    title: 'Circle Packing',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'pack', params: { size: [926, 926], padding: 3 } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 928, margin: { top: 1, right: 1, bottom: 1, left: 1 } },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'circles', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { field: 'r' }, fill: { value: '#ddd' }, stroke: { value: '#bbb' } } }
    ]
  },

  // 12. Tree
  tree: {
    id: 'tree',
    title: 'Tree Diagram',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { sort: (a, b) => d3.ascending(a.data.name, b.data.name) } },
        { type: 'tree', params: { nodeSize: [10, 928 / 4] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' }
      ]
    },
    space: { width: 928, height: 600 },
    scales: {},
    layers: [
      { id: 'links', mark: { type: 'path', generator: { type: 'linkHorizontal' } }, encoding: { stroke: { value: '#555' }, strokeOpacity: { value: 0.4 }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'nodes', mark: { type: 'circle' }, encoding: { cx: { field: 'y' }, cy: { field: 'x' }, r: { value: 2.5 }, fill: { value: '#555' } } }
    ]
  },

  // === NETWORK CHARTS ===

  // 13. Force-Directed Graph
  forceDirectedGraph: {
    id: 'force-directed-graph',
    title: 'Force-Directed Graph',
    data: {
      source: { type: 'generated', options: { type: 'network', nodeCount: 50, linkCount: 100 } },
      transforms: [
        {
          type: 'force',
          params: {
            forces: {
              link: { distance: 30, strength: 1 },
              manyBody: { strength: -300 },
              center: { x: 464, y: 300 }
            }
          }
        }
      ],
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'group', type: 'nominal', accessor: 'group' },
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' }
      ]
    },
    space: { width: 928, height: 600 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'group', method: 'values' } }
    },
    layers: [
      { id: 'links', data: 'links', mark: { type: 'line' }, encoding: { x1: { field: 'source.x' }, y1: { field: 'source.y' }, x2: { field: 'target.x' }, y2: { field: 'target.y' }, stroke: { value: '#999' }, strokeOpacity: { value: 0.6 }, strokeWidth: { value: 1.5 } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { value: 5 }, fill: { field: 'group', scale: 'color' }, stroke: { value: '#fff' }, strokeWidth: { value: 1.5 } } }
    ]
  },

  // 14. Sankey Diagram
  sankey: {
    id: 'sankey',
    title: 'Sankey Diagram',
    data: {
      source: { type: 'generated', options: { type: 'sankey' } },
      transforms: [
        { type: 'sankey', params: { nodeWidth: 15, nodePadding: 10, extent: [[1, 5], [927, 595]] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 600 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'links', data: 'links', mark: { type: 'path', generator: { type: 'sankeyLinkHorizontal' } }, encoding: { fill: { value: 'none' }, stroke: { field: 'source.category', scale: 'color' }, strokeOpacity: { value: 0.5 }, strokeWidth: { field: 'width' } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'category', scale: 'color' }, stroke: { value: '#000' } } }
    ]
  },

  // 15. Chord Diagram
  chordDiagram: {
    id: 'chord-diagram',
    title: 'Chord Diagram',
    data: {
      source: { type: 'generated', options: { type: 'chord-matrix' } },
      transforms: [
        { type: 'chord', params: { padAngle: 0.02, sortSubgroups: d3.descending, sortChords: d3.descending } }
      ],
      fields: [
        { name: 'index', type: 'quantitative', accessor: 'index' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 640, height: 640 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      {
        id: 'arcs',
        data: 'groups',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 310, outerRadius: 320 } } },
        encoding: { fill: { field: 'index', scale: 'color' } },
        style: { transform: 'translate(320px, 320px)' }
      },
      {
        id: 'ribbons',
        data: 'chords',
        mark: { type: 'path', generator: { type: 'ribbon', params: { radius: 309 } } },
        encoding: { fill: { field: 'target.index', scale: 'color' }, fillOpacity: { value: 0.7 }, stroke: { value: 'white' } },
        style: { transform: 'translate(320px, 320px)' }
      }
    ]
  },

  // === GEOGRAPHIC CHARTS ===

  // 16. Choropleth Map
  choroplethMap: {
    id: 'choropleth-map',
    title: 'Choropleth Map',
    data: {
      source: { type: 'generated', options: { type: 'us-counties' } },
      transforms: [
        { type: 'projection', params: { type: 'albersUsa' } }
      ],
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
      { id: 'counties', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { field: 'rate', scale: 'color' }, stroke: { value: 'white' }, strokeWidth: { value: 0.5 } } }
    ]
  },

  // 17. Bubble Map
  bubbleMap: {
    id: 'bubble-map',
    title: 'Bubble Map',
    data: {
      source: { type: 'generated', options: { type: 'us-counties-population' } },
      fields: [
        { name: 'population', type: 'quantitative', accessor: 'population' },
        { name: 'centroid', type: 'geojson', accessor: 'centroid' }
      ]
    },
    space: { width: 975, height: 610 },
    scales: {
      size: { type: 'sqrt', domainFrom: { data: 'main', field: 'population', method: 'max', transform: values => [0, d3.max(values)] }, range: [0, 40] }
    },
    layers: [
      { id: 'background', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#ddd' } } },
      { id: 'bubbles', mark: { type: 'circle' }, encoding: { cx: { field: 'centroid.x' }, cy: { field: 'centroid.y' }, r: { field: 'population', scale: 'size' }, fill: { value: 'brown' }, fillOpacity: { value: 0.5 }, stroke: { value: '#fff' }, strokeWidth: { value: 0.5 } } }
    ]
  },

  // === STATISTICAL CHARTS ===

  // 18. Histogram
  histogram: {
    id: 'histogram',
    title: 'Histogram',
    data: {
      source: { type: 'generated', options: { count: 1000, type: 'unemployment' } },
      transforms: [{ type: 'bin', params: { field: 'rate', thresholds: 40 } }],
      fields: [
        { name: 'x0', type: 'quantitative', accessor: 'x0' },
        { name: 'x1', type: 'quantitative', accessor: 'x1' },
        { name: 'length', type: 'quantitative', accessor: 'length' }
      ]
    },
    space: { width: 960, height: 500, margin: { top: 20, right: 20, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'x0', method: 'extent' }, range: [40, 940] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'length', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20] }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'x0', scale: 'x', transform: [{ type: 'offset', params: { offset: 1 } }] }, y: { field: 'length', scale: 'y' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data.x1) - this.scales.get('x')(data.x0) - 1 }] }, height: { field: 'length', transform: [{ type: 'custom', expression: (d, data) => 470 - this.getEncodedValue(data, { field: 'length', scale: 'y' }) }] }, fill: { value: 'steelblue' } } }
    ]
  },

  // 19. Box Plot
  boxPlot: {
    id: 'box-plot',
    title: 'Box Plot',
    data: {
      source: { type: 'generated', options: { type: 'diamonds' } },
      transforms: [{ type: 'bin', params: { field: 'carat', thresholds: 23 } }, { type: 'boxplot', params: { field: 'price' } }],
      fields: [
        { name: 'carat', type: 'quantitative', accessor: 'carat' },
        { name: 'price', type: 'quantitative', accessor: 'price' },
        { name: 'quartiles', type: 'quantitative', accessor: 'quartiles' },
        { name: 'range', type: 'quantitative', accessor: 'range' },
        { name: 'outliers', type: 'quantitative', accessor: 'outliers' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 20, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'carat', method: 'extent' }, range: [40, 908] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'price', method: 'extent' }, range: [570, 20], nice: true }
    },
    layers: [
      { id: 'boxes', mark: { type: 'rect' }, encoding: { x: { field: 'x0', scale: 'x' }, y: { field: 'quartiles.2', scale: 'y' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data.x1) - this.scales.get('x')(data.x0) }] }, height: { field: 'quartiles', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('y')(data.quartiles[0]) - this.scales.get('y')(data.quartiles[2]) }] }, fill: { value: '#ddd' } } }
    ]
  },

  // 20. Density Contours
  densityContours: {
    id: 'density-contours',
    title: 'Density Contours',
    data: {
      source: { type: 'generated', options: { type: 'faithful' } },
      transforms: [
        { type: 'contourDensity', params: { x: 'waiting', y: 'eruptions', size: [928, 600], bandwidth: 30, thresholds: 30 } }
      ],
      fields: [
        { name: 'waiting', type: 'quantitative', accessor: 'waiting' },
        { name: 'eruptions', type: 'quantitative', accessor: 'eruptions' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'waiting', method: 'extent' }, range: [40, 898], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'eruptions', method: 'extent' }, range: [570, 20], nice: true }
    },
    layers: [
      { id: 'contours', mark: { type: 'path', generator: { type: 'geoPath' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'steelblue' }, strokeLinejoin: { value: 'round' }, strokeWidth: { field: 'index', transform: [{ type: 'custom', expression: (d, data) => data.index % 5 ? 0.25 : 1 }] } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'waiting', scale: 'x' }, cy: { field: 'eruptions', scale: 'y' }, r: { value: 2 }, stroke: { value: 'white' } } }
    ]
  },

  // === SPECIALIZED CHARTS ===

  // 21. Calendar Heatmap
  calendar: {
    id: 'calendar',
    title: 'Calendar Heatmap',
    data: {
      source: { type: 'generated', options: { type: 'daily-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'Date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 136 },
    scales: {
      color: { type: 'sequential', interpolator: 'interpolatePiYG', domainFrom: { data: 'main', field: 'value', method: 'extent' } }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'week', transform: [{ type: 'scale', params: { factor: 17 } }] }, y: { field: 'day', transform: [{ type: 'scale', params: { factor: 17 } }] }, width: { value: 15 }, height: { value: 15 }, fill: { field: 'value', scale: 'color' } } }
    ]
  },

  // 22. Candlestick Chart
  candlestickChart: {
    id: 'candlestick-chart',
    title: 'Candlestick Chart',
    data: {
      source: { type: 'generated', options: { type: 'ohlc' } },
      fields: [
        { name: 'Date', type: 'temporal', accessor: 'Date' },
        { name: 'Open', type: 'quantitative', accessor: 'Open' },
        { name: 'High', type: 'quantitative', accessor: 'High' },
        { name: 'Low', type: 'quantitative', accessor: 'Low' },
        { name: 'Close', type: 'quantitative', accessor: 'Close' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'Date', method: 'values' }, range: [40, 898], params: { padding: 0.2 } },
      y: { type: 'log', domainFrom: { data: 'main', field: 'High', method: 'extent' }, range: [570, 20] }
    },
    layers: [
      { id: 'wicks', mark: { type: 'line' }, encoding: { x: { field: 'Date', scale: 'x', transform: [{ type: 'offset', params: { offset: 'bandwidth/2' } }] }, y: { field: 'Low', scale: 'y' }, x2: { field: 'Date', scale: 'x', transform: [{ type: 'offset', params: { offset: 'bandwidth/2' } }] }, y2: { field: 'High', scale: 'y' }, stroke: { value: 'black' }, strokeLinecap: { value: 'round' } } },
      { id: 'bodies', mark: { type: 'line' }, encoding: { x: { field: 'Date', scale: 'x', transform: [{ type: 'offset', params: { offset: 'bandwidth/2' } }] }, y: { field: 'Open', scale: 'y' }, x2: { field: 'Date', scale: 'x', transform: [{ type: 'offset', params: { offset: 'bandwidth/2' } }] }, y2: { field: 'Close', scale: 'y' }, stroke: { field: 'direction', transform: [{ type: 'custom', expression: (d, data) => data.Open > data.Close ? '#e41a1c' : data.Close > data.Open ? '#4daf4a' : '#984ea3' }] }, strokeWidth: { value: 'bandwidth' }, strokeLinecap: { value: 'round' } } }
    ]
  },

  // 23. Horizon Chart
  horizonChart: {
    id: 'horizon-chart',
    title: 'Horizon Chart',
    data: {
      source: { type: 'generated', options: { type: 'timeseries-multiple' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'name', type: 'nominal', accessor: 'name' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: 10, bottom: 0, left: 10 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [0, 928] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max' }, range: [25, -75] }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area' }, groupBy: ['name'] }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, y2: { value: 25 }, fill: { value: 'steelblue' } } }
    ]
  },

  // === ANIMATED CHARTS ===

  // 24. Animated Treemap
  animatedTreemap: {
    id: 'animated-treemap',
    title: 'Animated Treemap',
    data: {
      source: { type: 'generated', options: { type: 'temporal-hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true } },
        { type: 'treemap', params: { size: [928, 928], tile: 'treemapResquarify', padding: 1, round: true } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'date', type: 'temporal', accessor: 'date' }
      ]
    },
    space: { width: 928, height: 948 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0' }, y: { field: 'y0' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'name', scale: 'color' } } }
    ],
    animations: [
      {
        trigger: 'time',
        sequence: [
          { target: '.cells rect', properties: { x: 'x0', y: 'y0', width: 'width', height: 'height' }, duration: 750, easing: 'easeLinear' }
        ]
      }
    ]
  },

  // 25. Bar Chart Race
  barChartRace: {
    id: 'bar-chart-race',
    title: 'Bar Chart Race',
    data: {
      source: { type: 'generated', options: { type: 'temporal-ranking' } },
      fields: [
        { name: 'name', type: 'nominal', accessor: 'name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'rank', type: 'quantitative', accessor: 'rank' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max' }, range: [0, 928] },
      y: { type: 'band', domainFrom: { data: 'main', field: 'rank', method: 'values' }, range: [0, 500], params: { padding: 0.1 } },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'name', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { value: 0 }, y: { field: 'rank', scale: 'y' }, width: { field: 'value', scale: 'x' }, height: { value: 'bandwidth' }, fill: { field: 'name', scale: 'color' } } }
    ],
    animations: [
      {
        trigger: 'time',
        sequence: [
          { target: '.bars rect', properties: { y: 'rank', width: 'value' }, duration: 250, easing: 'easeLinear' }
        ]
      }
    ]
  },

  // === RADIAL CHARTS ===

  // 26. Radial Area Chart
  radialAreaChart: {
    id: 'radial-area-chart',
    title: 'Radial Area Chart',
    data: {
      source: { type: 'generated', options: { type: 'temperature-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'minmin', type: 'quantitative', accessor: 'minmin' },
        { name: 'maxmax', type: 'quantitative', accessor: 'maxmax' },
        { name: 'min', type: 'quantitative', accessor: 'min' },
        { name: 'max', type: 'quantitative', accessor: 'max' },
        { name: 'avg', type: 'quantitative', accessor: 'avg' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      x: { type: 'point', domainFrom: { data: 'main', field: 'date', method: 'values' }, range: [0, 2 * Math.PI], params: { padding: 0.5 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'maxmax', method: 'extent' }, range: [20, 400] }
    },
    layers: [
      {
        id: 'area-outer',
        mark: { type: 'area', generator: { type: 'areaRadial', curve: 'curveLinearClosed' } },
        encoding: {
          angle: { field: 'date', scale: 'x' },
          innerRadius: { field: 'minmin', scale: 'y' },
          outerRadius: { field: 'maxmax', scale: 'y' },
          fill: { value: 'lightsteelblue' },
          fillOpacity: { value: 0.2 }
        },
        style: { transform: 'translate(464px, 464px)' }
      }
    ]
  },

  // 27. Radial Stacked Bar Chart
  radialStackedBarChart: {
    id: 'radial-stacked-bar-chart',
    title: 'Radial Stacked Bar Chart',
    data: {
      source: { type: 'generated', options: { type: 'population-by-age' } },
      transforms: [{ type: 'stack', params: { keys: ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '≥70'] } }],
      fields: [
        { name: 'state', type: 'ordinal', accessor: 'data.state' },
        { name: 'age', type: 'ordinal', accessor: 'key' },
        { name: 'population', type: 'quantitative', accessor: '1' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [0, 2 * Math.PI], params: { align: 0 } },
      y: { type: 'radial', domainFrom: { data: 'main', field: 'population', method: 'max' }, range: [180, 464] },
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      {
        id: 'bars',
        mark: { type: 'arc', generator: { type: 'arc', params: { padAngle: 1.5 / 180, padRadius: 180 } } },
        encoding: {
          startAngle: { field: 'state', scale: 'x' },
          endAngle: { field: 'state', scale: 'x', transform: [{ type: 'offset', params: { offset: 'bandwidth' } }] },
          innerRadius: { field: '0', scale: 'y' },
          outerRadius: { field: '1', scale: 'y' },
          fill: { field: 'age', scale: 'color' }
        },
        style: { transform: 'translate(464px, 464px)' }
      }
    ]
  },

  // === COMPLEX INTERACTIVE CHARTS ===

  // 28. Brushable Scatterplot
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
      {
        type: 'brush',
        target: 'svg',
        handlers: {
          brush: { action: 'selectPoints' }
        }
      }
    ]
  },

  // 29. Zoomable Area Chart
  zoomableAreaChart: {
    id: 'zoomable-area-chart',
    title: 'Zoomable Area Chart',
    data: {
      source: { type: 'generated', options: { type: 'flights' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 20, right: 20, bottom: 30, left: 30 }, clips: [{ id: 'chart-area', type: 'rect', params: { x: 30, y: 5, width: 878, height: 445 } }] },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [30, 908] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max', transform: values => [0, d3.max(values)] }, range: [470, 20], nice: true }
    },
    layers: [
      { id: 'area', mark: { type: 'area', generator: { type: 'area', curve: 'curveStepAfter' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, y2: { value: 470 }, fill: { value: 'steelblue' } }, clipPath: 'chart-area' }
    ],
    behaviors: [
      {
        type: 'zoom',
        target: 'svg',
        params: { scaleExtent: [1, 32], extent: [[30, 0], [908, 500]], translateExtent: [[30, -Infinity], [908, Infinity]] }
      }
    ]
  },

  // === GEOGRAPHIC SPECIALIZED ===

  // 30. World Map
  worldMap: {
    id: 'world-map',
    title: 'World Map',
    data: {
      source: { type: 'generated', options: { type: 'world-countries' } },
      transforms: [
        { type: 'projection', params: { type: 'naturalEarth1', scale: 153, translate: [480, 250] } }
      ],
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' },
        { name: 'name', type: 'nominal', accessor: 'properties.name' }
      ]
    },
    space: { width: 960, height: 500 },
    scales: {},
    layers: [
      { id: 'sphere', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'white' }, stroke: { value: 'currentColor' } } },
      { id: 'countries', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' } } },
      { id: 'borders', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: 'none' }, stroke: { value: 'white' }, strokeLinejoin: { value: 'round' } } }
    ]
  },

  // 31. Projection Comparison
  projectionComparison: {
    id: 'projection-comparison',
    title: 'Projection Comparison',
    data: {
      source: { type: 'generated', options: { type: 'world-land' } },
      fields: [
        { name: 'geometry', type: 'geojson', accessor: 'geometry' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {},
    layers: [
      { id: 'land', mark: { type: 'geoshape', generator: { type: 'path' } }, encoding: { fill: { value: '#000' }, stroke: { value: '#fff' }, strokeWidth: { value: 0.5 } } }
    ]
  },

  // === NETWORK SPECIALIZED ===

  // 32. Arc Diagram
  arcDiagram: {
    id: 'arc-diagram',
    title: 'Arc Diagram',
    data: {
      source: { type: 'generated', options: { type: 'network' } },
      fields: [
        { name: 'id', type: 'nominal', accessor: 'id' },
        { name: 'group', type: 'nominal', accessor: 'group' }
      ]
    },
    space: { width: 640, height: 400, margin: { top: 20, right: 20, bottom: 20, left: 130 } },
    scales: {
      y: { type: 'point', domainFrom: { data: 'main', field: 'id', method: 'values' }, range: [20, 380] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'group', method: 'values' } }
    },
    layers: [
      { id: 'arcs', data: 'links', mark: { type: 'path' }, encoding: { d: { field: 'arc' }, fill: { value: 'none' }, stroke: { field: 'samegroup', scale: 'color' }, strokeOpacity: { value: 0.6 }, strokeWidth: { value: 1.5 } } },
      { id: 'nodes', mark: { type: 'circle' }, encoding: { cx: { value: 130 }, cy: { field: 'id', scale: 'y' }, r: { value: 3 }, fill: { field: 'group', scale: 'color' } } }
    ]
  },

  // 33. Hierarchical Edge Bundling
  hierarchicalEdgeBundling: {
    id: 'hierarchical-edge-bundling',
    title: 'Hierarchical Edge Bundling',
    data: {
      source: { type: 'generated', options: { type: 'hierarchical-network' } },
      transforms: [
        { type: 'cluster', params: { size: [2 * Math.PI, 477] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' }
      ]
    },
    space: { width: 954, height: 954 },
    scales: {},
    layers: [
      {
        id: 'links',
        mark: { type: 'path', generator: { type: 'lineRadial', curve: 'curveBundle', params: { beta: 0.85 } } },
        encoding: { stroke: { value: '#000' }, strokeOpacity: { value: 0.1 }, fill: { value: 'none' } },
        style: { transform: 'translate(477px, 477px)', mixBlendMode: 'multiply' }
      },
      {
        id: 'nodes',
        mark: { type: 'text' },
        encoding: {
          x: { field: 'y', transform: [{ type: 'custom', expression: (d, data) => Math.cos(data.x - Math.PI / 2) * data.y }] },
          y: { field: 'y', transform: [{ type: 'custom', expression: (d, data) => Math.sin(data.x - Math.PI / 2) * data.y }] },
          text: { field: 'name' },
          textAnchor: { field: 'x', transform: [{ type: 'custom', expression: (d, data) => data.x < Math.PI ? 'start' : 'end' }] }
        },
        style: { transform: 'translate(477px, 477px)' }
      }
    ]
  },

  // === TEMPORAL CHARTS ===

  // 34. Connected Scatterplot
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
    space: { width: 928, height: 720, margin: { top: 20, right: 30, bottom: 30, left: 50 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'miles', method: 'extent' }, range: [50, 898], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'gas', method: 'extent' }, range: [690, 20], nice: true }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line', curve: 'curveCatmullRom' } }, encoding: { x: { field: 'miles', scale: 'x' }, y: { field: 'gas', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'miles', scale: 'x' }, cy: { field: 'gas', scale: 'y' }, r: { value: 3 }, fill: { value: 'white' }, stroke: { value: 'black' }, strokeWidth: { value: 2 } } }
    ]
  },

  // 35. Index Chart
  indexChart: {
    id: 'index-chart',
    title: 'Index Chart',
    data: {
      source: { type: 'generated', options: { type: 'stocks' } },
      fields: [
        { name: 'Date', type: 'temporal', accessor: 'Date' },
        { name: 'Close', type: 'quantitative', accessor: 'Close' },
        { name: 'Symbol', type: 'nominal', accessor: 'Symbol' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 40, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'Date', method: 'extent' }, range: [40, 888], clamp: true },
      y: { type: 'log', domain: [1/10, 10], range: [570, 20] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'Symbol', method: 'values' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['Symbol'] }, encoding: { x: { field: 'Date', scale: 'x' }, y: { field: 'normalized', scale: 'y' }, stroke: { field: 'Symbol', scale: 'color' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  // === STATISTICAL ADVANCED ===

  // 36. Hexbin
  hexbin: {
    id: 'hexbin',
    title: 'Hexbin Plot',
    data: {
      source: { type: 'generated', options: { type: 'diamonds' } },
      transforms: [
        { type: 'hexbin', params: { x: 'carat', y: 'price', radius: 10, extent: [[40, 20], [908, 580]] } }
      ],
      fields: [
        { name: 'carat', type: 'quantitative', accessor: 'carat' },
        { name: 'price', type: 'quantitative', accessor: 'price' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 20, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'log', domainFrom: { data: 'main', field: 'carat', method: 'extent' }, range: [40, 908] },
      y: { type: 'log', domainFrom: { data: 'main', field: 'price', method: 'extent' }, range: [580, 20] },
      color: { type: 'sequential', interpolator: 'interpolateBuPu', domainFrom: { data: 'main', field: 'length', method: 'max', transform: values => [0, d3.max(values) / 2] } }
    },
    layers: [
      { id: 'hexagons', mark: { type: 'path', generator: { type: 'hexagon' } }, encoding: { fill: { field: 'length', scale: 'color' }, stroke: { value: 'black' } } }
    ]
  },

  // 37. Parallel Coordinates
  parallelCoordinates: {
    id: 'parallel-coordinates',
    title: 'Parallel Coordinates',
    data: {
      source: { type: 'generated', options: { type: 'cars-multi' } },
      fields: [
        { name: 'economy', type: 'quantitative', accessor: 'economy' },
        { name: 'cylinders', type: 'quantitative', accessor: 'cylinders' },
        { name: 'displacement', type: 'quantitative', accessor: 'displacement' },
        { name: 'power', type: 'quantitative', accessor: 'power' },
        { name: 'weight', type: 'quantitative', accessor: 'weight' },
        { name: 'acceleration', type: 'quantitative', accessor: 'acceleration' },
        { name: 'year', type: 'quantitative', accessor: 'year' }
      ]
    },
    space: { width: 928, height: 840, margin: { top: 20, right: 10, bottom: 20, left: 10 } },
    scales: {
      y: { type: 'point', domain: ['economy', 'cylinders', 'displacement', 'power', 'weight', 'acceleration', 'year'], range: [20, 820] },
      color: { type: 'sequential', interpolator: 'interpolateBrBG', domainFrom: { data: 'main', field: 'economy', method: 'extent' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' } }, encoding: { stroke: { field: 'economy', scale: 'color' }, strokeWidth: { value: 1.5 }, strokeOpacity: { value: 0.4 }, fill: { value: 'none' } } }
    ]
  },

  // === REAL-TIME CHARTS ===

  // 38. Realtime Horizon Chart
  realtimeHorizonChart: {
    id: 'realtime-horizon-chart',
    title: 'Realtime Horizon Chart',
    data: {
      source: { type: 'stream', url: 'ws://localhost:8080/data', options: { bufferSize: 100 } },
      fields: [
        { name: 'timestamp', type: 'temporal', accessor: 'timestamp' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'series', type: 'nominal', accessor: 'series' }
      ]
    },
    space: { width: 928, height: 500 },
    scales: {
      x: { type: 'time', range: [0, 928] },
      y: { type: 'linear', range: [0, -120] }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area' }, groupBy: ['series'] }, encoding: { x: { field: 'timestamp', scale: 'x' }, y: { field: 'value', scale: 'y' }, y2: { value: 0 }, fill: { value: 'steelblue' } } }
    ]
  },

  // === SPECIALIZED VISUALIZATIONS ===

  // 39. Marimekko Chart
  marimekkoChart: {
    id: 'marimekko-chart',
    title: 'Marimekko Chart',
    data: {
      source: { type: 'generated', options: { type: 'sales-data' } },
      transforms: [
        { type: 'treemap', params: { tile: 'treemapSliceDice', size: [907, 459] } }
      ],
      fields: [
        { name: 'market', type: 'nominal', accessor: 'market' },
        { name: 'segment', type: 'nominal', accessor: 'segment' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 30, right: -1, bottom: -1, left: 1 } },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'segment', method: 'values' } }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0', transform: [{ type: 'offset', params: { offset: 1 } }] }, y: { field: 'y0', transform: [{ type: 'offset', params: { offset: 30 } }] }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'segment', scale: 'color' }, fillOpacity: { field: 'value', transform: [{ type: 'custom', expression: (d, data) => data.value / data.parent.value }] } } }
    ]
  },

  // 40. Slope Chart
  slopeChart: {
    id: 'slope-chart',
    title: 'Slope Chart',
    data: {
      source: { type: 'generated', options: { type: 'slope-data' } },
      fields: [
        { name: 'country', type: 'nominal', accessor: 'country' },
        { name: '1970', type: 'quantitative', accessor: '1970' },
        { name: '1979', type: 'quantitative', accessor: '1979' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 40, right: 50, bottom: 10, left: 50 } },
    scales: {
      x: { type: 'point', domain: [0, 1], range: [50, 878], params: { padding: 0.5 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: '1970', method: 'extent' }, range: [590, 40] }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' } }, encoding: { stroke: { value: 'currentColor' }, fill: { value: 'none' } } }
    ]
  },

  // === ADVANCED INTERACTIONS ===

  // 41. Brushable Scatterplot Matrix
  brushableScatterplotMatrix: {
    id: 'brushable-scatterplot-matrix',
    title: 'Brushable Scatterplot Matrix',
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
    ],
    behaviors: [
      {
        type: 'brush',
        target: '.matrix',
        handlers: { brush: { action: 'highlightSelection' } }
      }
    ]
  },

  // 42. Zoomable Circle Packing
  zoomableCirclePacking: {
    id: 'zoomable-circle-packing',
    title: 'Zoomable Circle Packing',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.value - a.value } },
        { type: 'pack', params: { size: [928, 928], padding: 3 } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {
      color: { type: 'linear', domain: [0, 5], range: ['hsl(152,80%,80%)', 'hsl(228,30%,40%)'], interpolate: 'interpolateHcl' }
    },
    layers: [
      { id: 'circles', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { field: 'r' }, fill: { field: 'depth', scale: 'color' }, stroke: { value: '#fff' }, strokeWidth: { value: 1.5 } } }
    ],
    behaviors: [
      {
        type: 'zoom',
        target: '.circles circle',
        handlers: { click: { action: 'zoomToNode' } }
      }
    ]
  },

  // === TEMPORAL SPECIALIZED ===

  // 43. Sea Ice Extent
  seaIceExtent: {
    id: 'sea-ice-extent',
    title: 'Sea Ice Extent 1978-2017',
    data: {
      source: { type: 'generated', options: { type: 'sea-ice' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'year', type: 'quantitative', accessor: 'year' }
      ]
    },
    space: { width: 928, height: 720, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domain: [new Date('2000-01-01'), new Date('2001-01-01')], range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max', transform: values => [0, d3.max(values)] }, range: [690, 20] },
      color: { type: 'sequential', interpolator: 'interpolateSpectral', domainFrom: { data: 'main', field: 'year', method: 'extent' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line' }, groupBy: ['year'] }, encoding: { x: { field: 'intrayear', scale: 'x' }, y: { field: 'value', scale: 'y' }, stroke: { field: 'year', scale: 'color' }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } }
    ]
  },

  // 44. Global Temperature Trends
  globalTemperatureTrends: {
    id: 'global-temperature-trends',
    title: 'Global Temperature Trends',
    data: {
      source: { type: 'generated', options: { type: 'temperature-anomaly' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 928, height: 600, margin: { top: 20, right: 30, bottom: 30, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 898] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [570, 20], nice: true },
      color: { type: 'sequential', interpolator: 'interpolateRdBu', domainFrom: { data: 'main', field: 'value', method: 'extent' } }
    },
    layers: [
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'date', scale: 'x' }, cy: { field: 'value', scale: 'y' }, r: { value: 2.5 }, fill: { field: 'value', scale: 'color' }, stroke: { value: '#000' }, strokeOpacity: { value: 0.2 } } }
    ]
  },

  // === SPECIALIZED LAYOUTS ===

  // 45. Icicle
  icicle: {
    id: 'icicle',
    title: 'Icicle Chart',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { value: 'value', sum: true, sort: (a, b) => b.height - a.height || b.value - a.value } },
        { type: 'partition', params: { size: [2400, 928] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 928, height: 2400 },
    scales: {
      color: { type: 'ordinal', scheme: 'Rainbow', domainFrom: { data: 'main', field: 'depth', method: 'values' } }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'y0' }, y: { field: 'x0' }, width: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, height: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, fill: { field: 'depth', scale: 'color' } } }
    ]
  },

  // 46. Cluster Dendrogram
  cluster: {
    id: 'cluster',
    title: 'Cluster Dendrogram',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { sort: (a, b) => d3.ascending(a.data.name, b.data.name) } },
        { type: 'cluster', params: { nodeSize: [10, 928 / 4] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' }
      ]
    },
    space: { width: 928, height: 600 },
    scales: {},
    layers: [
      { id: 'links', mark: { type: 'path', generator: { type: 'linkHorizontal' } }, encoding: { stroke: { value: '#555' }, strokeOpacity: { value: 0.4 }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } } },
      { id: 'nodes', mark: { type: 'circle' }, encoding: { cx: { field: 'y' }, cy: { field: 'x' }, r: { value: 2.5 }, fill: { value: '#555' } } }
    ]
  },

  // 47. Radial Tree
  radialTree: {
    id: 'radial-tree',
    title: 'Radial Tree',
    data: {
      source: { type: 'generated', options: { type: 'hierarchy' } },
      transforms: [
        { type: 'hierarchy', params: { sort: (a, b) => d3.ascending(a.data.name, b.data.name) } },
        { type: 'tree', params: { size: [2 * Math.PI, 434], separation: (a, b) => (a.parent == b.parent ? 1 : 2) / a.depth } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' }
      ]
    },
    space: { width: 928, height: 928 },
    scales: {},
    layers: [
      {
        id: 'links',
        mark: { type: 'path', generator: { type: 'linkRadial' } },
        encoding: { stroke: { value: '#555' }, strokeOpacity: { value: 0.4 }, strokeWidth: { value: 1.5 }, fill: { value: 'none' } },
        style: { transform: 'translate(464px, 548px)' }
      },
      {
        id: 'nodes',
        mark: { type: 'circle' },
        encoding: { r: { value: 2.5 }, fill: { value: '#555' } },
        style: { transform: 'translate(464px, 548px)' }
      }
    ]
  },

  // === ADDITIONAL CHART TYPES ===

  // 48. Beeswarm Plot
  beeswarm: {
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

  // 49. Dot Plot
  dotPlot: {
    id: 'dot-plot',
    title: 'Dot Plot',
    data: {
      source: { type: 'generated', options: { type: 'population-by-age-state' } },
      fields: [
        { name: 'state', type: 'nominal', accessor: 'state' },
        { name: 'age', type: 'nominal', accessor: 'age' },
        { name: 'share', type: 'quantitative', accessor: 'share' }
      ]
    },
    space: { width: 928, height: 800, margin: { top: 30, right: 10, bottom: 10, left: 10 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'share', method: 'max', transform: values => [0, d3.max(values)] }, range: [10, 918] },
      y: { type: 'point', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [30, 790], params: { padding: 1 } },
      color: { type: 'ordinal', scheme: 'Spectral', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', groupBy: ['state'] }, encoding: { x1: { field: 'min', scale: 'x' }, x2: { field: 'max', scale: 'x' }, y1: { field: 'state', scale: 'y' }, y2: { field: 'state', scale: 'y' }, stroke: { value: '#aaa' } } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'share', scale: 'x' }, cy: { field: 'state', scale: 'y' }, r: { value: 3.5 }, fill: { field: 'age', scale: 'color' } } }
    ]
  },

  // 50. Ridgeline Plot
  ridgelinePlot: {
    id: 'ridgeline-plot',
    title: 'Ridgeline Plot',
    data: {
      source: { type: 'generated', options: { type: 'traffic-data' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'name', type: 'nominal', accessor: 'name' }
      ]
    },
    space: { width: 928, height: 500, margin: { top: 40, right: 20, bottom: 30, left: 120 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [120, 908] },
      y: { type: 'point', domainFrom: { data: 'main', field: 'name', method: 'values' }, range: [40, 470] },
      z: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'max' }, range: [0, -136] }
    },
    layers: [
      { id: 'areas', mark: { type: 'area', generator: { type: 'area', curve: 'curveBasis' }, groupBy: ['name'] }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'z', transform: [{ type: 'offset', params: { offset: 'y-position' } }] }, y2: { field: 'name', scale: 'y' }, fill: { value: '#ddd' } } }
    ]
  }
};

// Helper function to get all chart types
export function getAllChartTypes(): string[] {
  return Object.keys(chartSchemas);
}

// Helper function to get schema by type
export function getSchemaByType(type: string): CanonicalChartSchema | null {
  return chartSchemas[type] || null;
}

// Export combined schemas
export const allChartSchemas = {
  ...chartSchemas,
  ...completeChartSchemas
};