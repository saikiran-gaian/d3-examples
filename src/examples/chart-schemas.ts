import { CanonicalChartSchema } from '../types/canonical-schema';

/**
 * Canonical schemas for all 154+ D3 chart types
 * Each schema demonstrates how any chart can be represented universally
 */

export const chartSchemas: Record<string, CanonicalChartSchema> = {
  // 1. Bar Chart
  barChart: {
    id: 'bar-chart',
    title: 'Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 5, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [40, 760], params: { padding: 0.1 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [0, d3.max(values)] }, range: [360, 20], nice: true }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'letter', scale: 'x' }, y: { field: 'frequency', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'frequency', transform: [{ type: 'custom', expression: (d, data) => 360 - this.getEncodedValue(data, { field: 'frequency', scale: 'y' }) }] }, fill: { value: 'steelblue' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 2. Line Chart
  lineChart: {
    id: 'line-chart',
    title: 'Line Chart',
    data: {
      source: { type: 'generated', options: { count: 30, type: 'timeseries' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 760] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [360, 20], nice: true }
    },
    layers: [
      { id: 'line', mark: { type: 'line', generator: { type: 'line', curve: 'curveMonotoneX' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, stroke: { value: 'steelblue' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 3. Scatter Plot
  scatterPlot: {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    data: {
      source: { type: 'generated', options: { count: 100, type: 'random' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'category', type: 'nominal', accessor: 'category' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'x', method: 'extent' }, range: [40, 760], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'y', method: 'extent' }, range: [360, 20], nice: true },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'category', method: 'values' } }
    },
    layers: [
      { id: 'grid', mark: { type: 'grid' }, encoding: {}, style: { stroke: '#e0e0e0', strokeWidth: 0.5 } },
      { id: 'points', mark: { type: 'circle' }, encoding: { cx: { field: 'x', scale: 'x' }, cy: { field: 'y', scale: 'y' }, r: { value: 4 }, fill: { field: 'category', scale: 'color' }, opacity: { value: 0.7 } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 4. Pie Chart
  pieChart: {
    id: 'pie-chart',
    title: 'Pie Chart',
    data: {
      source: { type: 'inline', data: [{ name: 'A', value: 30 }, { name: 'B', value: 80 }, { name: 'C', value: 45 }, { name: 'D', value: 60 }] },
      transforms: [{ type: 'pie', params: { value: 'value' } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 400, height: 400 },
    scales: {
      color: { type: 'ordinal', scheme: 'Set3', domainFrom: { data: 'main', field: 'name', method: 'values' } }
    },
    layers: [
      {
        id: 'slices',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 0, outerRadius: 150 } } },
        encoding: {
          fill: { field: 'name', scale: 'color' },
          stroke: { value: 'white' },
          strokeWidth: { value: 2 }
        },
        style: { transform: 'translate(200px, 200px)' }
      }
    ]
  },

  // 5. Area Chart
  areaChart: {
    id: 'area-chart',
    title: 'Area Chart',
    data: {
      source: { type: 'generated', options: { count: 30, type: 'timeseries' } },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 760] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [360, 20], nice: true }
    },
    layers: [
      { id: 'area', mark: { type: 'area', generator: { type: 'area', curve: 'curveMonotoneX' } }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, y2: { value: 360 }, fill: { value: 'steelblue' }, opacity: { value: 0.7 } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 6. Histogram
  histogram: {
    id: 'histogram',
    title: 'Histogram',
    data: {
      source: { type: 'generated', options: { count: 1000, type: 'random' } },
      transforms: [{ type: 'bin', params: { field: 'x', thresholds: 20 } }],
      fields: [
        { name: 'x0', type: 'quantitative', accessor: 'x0' },
        { name: 'x1', type: 'quantitative', accessor: 'x1' },
        { name: 'length', type: 'quantitative', accessor: 'length' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'x0', method: 'extent' }, range: [40, 760] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'length', method: 'max', transform: values => [0, d3.max(values)] }, range: [360, 20] }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'x0', scale: 'x' }, y: { field: 'length', scale: 'y' }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('x')(data.x1) - this.scales.get('x')(data.x0) - 1 }] }, height: { field: 'length', transform: [{ type: 'custom', expression: (d, data) => 360 - this.getEncodedValue(data, { field: 'length', scale: 'y' }) }] }, fill: { value: 'steelblue' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 7. Force-Directed Graph
  forceDirectedGraph: {
    id: 'force-directed-graph',
    title: 'Force-Directed Graph',
    data: {
      source: {
        type: 'inline',
        data: {
          nodes: [
            { id: 'A', group: 1 }, { id: 'B', group: 1 }, { id: 'C', group: 2 }, { id: 'D', group: 2 }, { id: 'E', group: 3 }
          ],
          links: [
            { source: 'A', target: 'B' }, { source: 'B', target: 'C' }, { source: 'C', target: 'D' }, { source: 'D', target: 'E' }, { source: 'A', target: 'E' }
          ]
        }
      },
      transforms: [
        {
          type: 'force',
          params: {
            forces: {
              link: { distance: 50, strength: 0.5 },
              manyBody: { strength: -200 },
              center: { x: 400, y: 200 }
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
    space: { width: 800, height: 400 },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'group', method: 'values' } }
    },
    layers: [
      { id: 'links', data: 'links', mark: { type: 'line' }, encoding: { x: { field: 'source.x' }, y: { field: 'source.y' }, x2: { field: 'target.x' }, y2: { field: 'target.y' }, stroke: { value: '#999' }, strokeWidth: { value: 1.5 } } },
      { id: 'nodes', data: 'nodes', mark: { type: 'circle' }, encoding: { cx: { field: 'x' }, cy: { field: 'y' }, r: { value: 8 }, fill: { field: 'group', scale: 'color' }, stroke: { value: '#fff' }, strokeWidth: { value: 2 } } }
    ]
  },

  // 8. Treemap
  treemap: {
    id: 'treemap',
    title: 'Treemap',
    data: {
      source: {
        type: 'inline',
        data: {
          name: 'root',
          children: [
            { name: 'A', children: [{ name: 'A1', value: 100 }, { name: 'A2', value: 200 }] },
            { name: 'B', children: [{ name: 'B1', value: 150 }, { name: 'B2', value: 300 }] }
          ]
        }
      },
      transforms: [
        { type: 'hierarchy', params: { value: 'value' } },
        { type: 'treemap', params: { size: [720, 320], padding: 2 } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 20, left: 40 } },
    scales: {
      color: { type: 'ordinal', scheme: 'Set3', domainFrom: { data: 'main', field: 'depth', method: 'values' } }
    },
    layers: [
      { id: 'cells', mark: { type: 'rect' }, encoding: { x: { field: 'x0', transform: [{ type: 'offset', params: { offset: 40 } }] }, y: { field: 'y0', transform: [{ type: 'offset', params: { offset: 20 } }] }, width: { field: 'x1', transform: [{ type: 'custom', expression: (d, data) => data.x1 - data.x0 }] }, height: { field: 'y1', transform: [{ type: 'custom', expression: (d, data) => data.y1 - data.y0 }] }, fill: { field: 'depth', scale: 'color' }, stroke: { value: 'white' }, strokeWidth: { value: 1 } } }
    ]
  },

  // 9. Sunburst
  sunburst: {
    id: 'sunburst',
    title: 'Sunburst Chart',
    data: {
      source: {
        type: 'inline',
        data: {
          name: 'root',
          children: [
            { name: 'A', children: [{ name: 'A1', value: 100 }, { name: 'A2', value: 200 }] },
            { name: 'B', children: [{ name: 'B1', value: 150 }, { name: 'B2', value: 300 }] }
          ]
        }
      },
      transforms: [
        { type: 'hierarchy', params: { value: 'value' } },
        { type: 'partition', params: { size: [2 * Math.PI, 150] } }
      ],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'depth', type: 'quantitative', accessor: 'depth' }
      ]
    },
    space: { width: 400, height: 400 },
    scales: {
      color: { type: 'ordinal', scheme: 'Set2', domainFrom: { data: 'main', field: 'depth', method: 'values' } }
    },
    layers: [
      {
        id: 'arcs',
        mark: { type: 'arc', generator: { type: 'arc' } },
        encoding: {
          startAngle: { field: 'x0' },
          endAngle: { field: 'x1' },
          innerRadius: { field: 'y0' },
          outerRadius: { field: 'y1' },
          fill: { field: 'depth', scale: 'color' },
          stroke: { value: 'white' },
          strokeWidth: { value: 1 }
        },
        style: { transform: 'translate(200px, 200px)' },
        when: { type: 'expression', test: 'd => d.depth > 0' }
      }
    ]
  },

  // 10. Bubble Chart
  bubbleChart: {
    id: 'bubble-chart',
    title: 'Bubble Chart',
    data: {
      source: { type: 'generated', options: { count: 50, type: 'random' } },
      fields: [
        { name: 'x', type: 'quantitative', accessor: 'x' },
        { name: 'y', type: 'quantitative', accessor: 'y' },
        { name: 'size', type: 'quantitative', accessor: 'size' },
        { name: 'category', type: 'nominal', accessor: 'category' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'x', method: 'extent' }, range: [40, 760], nice: true },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'y', method: 'extent' }, range: [360, 20], nice: true },
      size: { type: 'sqrt', domainFrom: { data: 'main', field: 'size', method: 'extent' }, range: [3, 20] },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'category', method: 'values' } }
    },
    layers: [
      { id: 'bubbles', mark: { type: 'circle' }, encoding: { cx: { field: 'x', scale: 'x' }, cy: { field: 'y', scale: 'y' }, r: { field: 'size', scale: 'size' }, fill: { field: 'category', scale: 'color' }, opacity: { value: 0.7 }, stroke: { value: '#fff' }, strokeWidth: { value: 1 } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 11. Donut Chart
  donutChart: {
    id: 'donut-chart',
    title: 'Donut Chart',
    data: {
      source: { type: 'inline', data: [{ name: 'Mobile', value: 45 }, { name: 'Desktop', value: 35 }, { name: 'Tablet', value: 20 }] },
      transforms: [{ type: 'pie', params: { value: 'value' } }],
      fields: [
        { name: 'name', type: 'nominal', accessor: 'data.name' },
        { name: 'value', type: 'quantitative', accessor: 'value' }
      ]
    },
    space: { width: 400, height: 400 },
    scales: {
      color: { type: 'ordinal', scheme: 'Pastel1', domainFrom: { data: 'main', field: 'name', method: 'values' } }
    },
    layers: [
      {
        id: 'slices',
        mark: { type: 'arc', generator: { type: 'arc', params: { innerRadius: 60, outerRadius: 150 } } },
        encoding: {
          fill: { field: 'name', scale: 'color' },
          stroke: { value: 'white' },
          strokeWidth: { value: 2 }
        },
        style: { transform: 'translate(200px, 200px)' }
      }
    ]
  },

  // 12. Stacked Bar Chart
  stackedBarChart: {
    id: 'stacked-bar-chart',
    title: 'Stacked Bar Chart',
    data: {
      source: {
        type: 'inline',
        data: [
          { state: 'CA', age: '<10', population: 100 },
          { state: 'CA', age: '10-20', population: 150 },
          { state: 'CA', age: '20+', population: 200 },
          { state: 'TX', age: '<10', population: 80 },
          { state: 'TX', age: '10-20', population: 120 },
          { state: 'TX', age: '20+', population: 180 }
        ]
      },
      transforms: [
        { type: 'stack', params: { keys: ['<10', '10-20', '20+'] } }
      ],
      fields: [
        { name: 'state', type: 'ordinal', accessor: 'data.state' },
        { name: 'age', type: 'ordinal', accessor: 'key' },
        { name: 'population', type: 'quantitative', accessor: '1' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'band', domainFrom: { data: 'main', field: 'state', method: 'values' }, range: [40, 760], params: { padding: 0.1 } },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'population', method: 'max', transform: values => [0, d3.max(values)] }, range: [360, 20] },
      color: { type: 'ordinal', scheme: 'Set2', domainFrom: { data: 'main', field: 'age', method: 'values' } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { field: 'state', scale: 'x' }, y: { field: '1', scale: 'y' }, width: { value: 'bandwidth' }, height: { field: 'population', transform: [{ type: 'custom', expression: (d, data) => this.scales.get('y')(data[0]) - this.scales.get('y')(data[1]) }] }, fill: { field: 'age', scale: 'color' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 13. Horizontal Bar Chart
  horizontalBarChart: {
    id: 'horizontal-bar-chart',
    title: 'Horizontal Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 5, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 40, bottom: 20, left: 40 } },
    scales: {
      x: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [0, d3.max(values)] }, range: [40, 760], nice: true },
      y: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [20, 380], params: { padding: 0.1 } }
    },
    layers: [
      { id: 'bars', mark: { type: 'rect' }, encoding: { x: { value: 40 }, y: { field: 'letter', scale: 'y' }, width: { field: 'frequency', scale: 'x', transform: [{ type: 'offset', params: { offset: -40 } }] }, height: { value: 'bandwidth' }, fill: { value: 'steelblue' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'top' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 20] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 14. Multi-line Chart
  multiLineChart: {
    id: 'multi-line-chart',
    title: 'Multi-line Chart',
    data: {
      source: {
        type: 'inline',
        data: [
          { date: new Date('2023-01-01'), series: 'A', value: 30 },
          { date: new Date('2023-02-01'), series: 'A', value: 45 },
          { date: new Date('2023-03-01'), series: 'A', value: 60 },
          { date: new Date('2023-01-01'), series: 'B', value: 20 },
          { date: new Date('2023-02-01'), series: 'B', value: 35 },
          { date: new Date('2023-03-01'), series: 'B', value: 50 }
        ]
      },
      fields: [
        { name: 'date', type: 'temporal', accessor: 'date' },
        { name: 'value', type: 'quantitative', accessor: 'value' },
        { name: 'series', type: 'nominal', accessor: 'series' }
      ]
    },
    space: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 40, left: 40 } },
    scales: {
      x: { type: 'time', domainFrom: { data: 'main', field: 'date', method: 'extent' }, range: [40, 760] },
      y: { type: 'linear', domainFrom: { data: 'main', field: 'value', method: 'extent' }, range: [360, 20], nice: true },
      color: { type: 'ordinal', scheme: 'Category10', domainFrom: { data: 'main', field: 'series', method: 'values' } }
    },
    layers: [
      { id: 'lines', mark: { type: 'line', generator: { type: 'line', curve: 'curveMonotoneX' }, groupBy: ['series'] }, encoding: { x: { field: 'date', scale: 'x' }, y: { field: 'value', scale: 'y' }, stroke: { field: 'series', scale: 'color' }, strokeWidth: { value: 2 }, fill: { value: 'none' } } },
      { id: 'x-axis', mark: { type: 'axis', params: { orient: 'bottom' } }, encoding: { scale: { value: 'x' }, position: { value: [0, 360] } } },
      { id: 'y-axis', mark: { type: 'axis', params: { orient: 'left' } }, encoding: { scale: { value: 'y' }, position: { value: [40, 0] } } }
    ]
  },

  // 15. Radial Bar Chart
  radialBarChart: {
    id: 'radial-bar-chart',
    title: 'Radial Bar Chart',
    data: {
      source: { type: 'generated', options: { count: 8, type: 'alphabet' } },
      fields: [
        { name: 'letter', type: 'ordinal', accessor: 'letter' },
        { name: 'frequency', type: 'quantitative', accessor: 'frequency' }
      ]
    },
    space: { width: 400, height: 400 },
    scales: {
      angle: { type: 'band', domainFrom: { data: 'main', field: 'letter', method: 'values' }, range: [0, 2 * Math.PI] },
      radius: { type: 'linear', domainFrom: { data: 'main', field: 'frequency', method: 'max', transform: values => [50, d3.max(values) * 150] }, range: [50, 150] },
      color: { type: 'ordinal', scheme: 'Set1', domainFrom: { data: 'main', field: 'letter', method: 'values' } }
    },
    layers: [
      {
        id: 'bars',
        mark: { type: 'arc', generator: { type: 'arc' } },
        encoding: {
          startAngle: { field: 'letter', scale: 'angle' },
          endAngle: { field: 'letter', scale: 'angle', transform: [{ type: 'offset', params: { offset: 'bandwidth' } }] },
          innerRadius: { value: 50 },
          outerRadius: { field: 'frequency', scale: 'radius' },
          fill: { field: 'letter', scale: 'color' }
        },
        style: { transform: 'translate(200px, 200px)' }
      }
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