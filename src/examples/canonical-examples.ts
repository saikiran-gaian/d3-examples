import { CanonicalChartSchema } from '../types/canonical-schema';

/**
 * Examples showing how any D3 chart can be represented with the canonical schema
 */

// Bar Chart - Traditional approach
export const barChart: CanonicalChartSchema = {
  id: 'canonical-bar-chart',
  title: 'Sales by Category',
  
  data: {
    source: {
      type: 'inline',
      data: [
        { category: 'A', value: 30 },
        { category: 'B', value: 80 },
        { category: 'C', value: 45 },
        { category: 'D', value: 60 },
        { category: 'E', value: 20 }
      ]
    },
    fields: [
      { name: 'category', type: 'nominal', accessor: 'category' },
      { name: 'value', type: 'quantitative', accessor: 'value' }
    ]
  },
  
  space: {
    width: 800,
    height: 400,
    coordinates: [{
      id: 'main',
      type: 'cartesian',
      bounds: [[40, 20], [760, 360]]
    }]
  },
  
  scales: {
    x: {
      type: 'band',
      domainFrom: { data: 'main', field: 'category', method: 'values' },
      range: [40, 760],
      params: { padding: 0.1 }
    },
    y: {
      type: 'linear',
      domainFrom: { data: 'main', field: 'value', method: 'max', transform: values => [0, d3.max(values)] },
      range: [360, 20],
      nice: true
    },
    color: {
      type: 'ordinal',
      scheme: 'Category10'
    }
  },
  
  layers: [
    {
      id: 'bars',
      mark: {
        type: 'rect'
      },
      encoding: {
        x: { field: 'category', scale: 'x' },
        y: { field: 'value', scale: 'y' },
        color: { field: 'category', scale: 'color' }
      }
    },
    {
      id: 'x-axis',
      mark: {
        type: 'axis',
        params: { orient: 'bottom', position: [0, 360] }
      },
      encoding: {
        scale: { value: 'x' }
      }
    },
    {
      id: 'y-axis',
      mark: {
        type: 'axis',
        params: { orient: 'left', position: [40, 0] }
      },
      encoding: {
        scale: { value: 'y' }
      }
    }
  ]
};

// Force-Directed Graph - Complex layout
export const forceDirectedGraph: CanonicalChartSchema = {
  id: 'canonical-force-graph',
  title: 'Network Visualization',
  
  data: {
    source: {
      type: 'inline',
      data: {
        nodes: [
          { id: 'A', group: 1, size: 10 },
          { id: 'B', group: 1, size: 8 },
          { id: 'C', group: 2, size: 12 },
          { id: 'D', group: 2, size: 6 }
        ],
        links: [
          { source: 'A', target: 'B', weight: 1 },
          { source: 'B', target: 'C', weight: 2 },
          { source: 'C', target: 'D', weight: 1 }
        ]
      }
    },
    transforms: [
      {
        type: 'force',
        params: {
          nodes: 'nodes',
          links: 'links',
          forces: {
            link: { distance: 50, strength: 0.5 },
            manyBody: { strength: -300 },
            center: { x: 400, y: 300 }
          }
        },
        output: 'simulation'
      }
    ],
    fields: [
      { name: 'id', type: 'nominal', accessor: 'id' },
      { name: 'group', type: 'nominal', accessor: 'group' },
      { name: 'x', type: 'quantitative', accessor: 'x' },
      { name: 'y', type: 'quantitative', accessor: 'y' }
    ]
  },
  
  space: {
    width: 800,
    height: 600
  },
  
  scales: {
    color: {
      type: 'ordinal',
      scheme: 'Category10',
      domainFrom: { data: 'main', field: 'group', method: 'values' }
    },
    size: {
      type: 'linear',
      domainFrom: { data: 'main', field: 'size', method: 'extent' },
      range: [3, 15]
    }
  },
  
  layers: [
    {
      id: 'links',
      data: 'links',
      mark: { type: 'line' },
      encoding: {
        x: { field: 'source.x' },
        y: { field: 'source.y' },
        x2: { field: 'target.x' },
        y2: { field: 'target.y' },
        stroke: { value: '#999' },
        strokeWidth: { field: 'weight', transform: [{ type: 'sqrt' }] }
      },
      order: 1
    },
    {
      id: 'nodes',
      data: 'nodes',
      mark: { type: 'circle' },
      encoding: {
        x: { field: 'x' },
        y: { field: 'y' },
        size: { field: 'size', scale: 'size' },
        color: { field: 'group', scale: 'color' },
        stroke: { value: '#fff' },
        strokeWidth: { value: 1.5 }
      },
      order: 2
    }
  ],
  
  behaviors: [
    {
      type: 'drag',
      target: '.nodes circle',
      handlers: {
        start: { action: 'simulation.restart' },
        drag: { action: 'updatePosition' },
        end: { action: 'simulation.stop' }
      }
    }
  ]
};

// Geographic Choropleth - Map visualization
export const choroplethMap: CanonicalChartSchema = {
  id: 'canonical-choropleth',
  title: 'Population by State',
  
  data: {
    source: {
      type: 'url',
      url: '/data/us-states.topojson',
      format: 'topojson'
    },
    transforms: [
      {
        type: 'projection',
        params: {
          type: 'albersUsa',
          scale: 1000,
          translate: [400, 250]
        }
      },
      {
        type: 'join',
        params: {
          data: '/data/population.csv',
          on: { left: 'properties.name', right: 'state' }
        }
      }
    ],
    fields: [
      { name: 'geometry', type: 'geojson', accessor: 'geometry' },
      { name: 'population', type: 'quantitative', accessor: 'properties.population' },
      { name: 'name', type: 'nominal', accessor: 'properties.name' }
    ]
  },
  
  space: {
    width: 800,
    height: 500,
    coordinates: [{
      id: 'map',
      type: 'geographic',
      projection: {
        type: 'albersUsa',
        scale: 1000,
        translate: [400, 250]
      }
    }]
  },
  
  scales: {
    color: {
      type: 'sequential',
      scheme: 'Blues',
      domainFrom: { data: 'main', field: 'population', method: 'extent' }
    }
  },
  
  layers: [
    {
      id: 'states',
      mark: {
        type: 'geoshape',
        generator: { type: 'path' }
      },
      encoding: {
        color: { field: 'population', scale: 'color' },
        stroke: { value: 'white' },
        strokeWidth: { value: 0.5 }
      }
    }
  ]
};

// Hierarchical Treemap
export const treemap: CanonicalChartSchema = {
  id: 'canonical-treemap',
  title: 'File System Hierarchy',
  
  data: {
    source: {
      type: 'inline',
      data: {
        name: 'root',
        children: [
          {
            name: 'src',
            children: [
              { name: 'app.js', value: 1000 },
              { name: 'utils.js', value: 500 }
            ]
          },
          {
            name: 'docs',
            children: [
              { name: 'readme.md', value: 200 },
              { name: 'api.md', value: 300 }
            ]
          }
        ]
      }
    },
    transforms: [
      {
        type: 'hierarchy',
        params: {
          value: 'value',
          sum: true,
          sort: (a: any, b: any) => b.value - a.value
        }
      },
      {
        type: 'treemap',
        params: {
          size: [760, 360],
          padding: 1,
          round: true
        }
      }
    ],
    fields: [
      { name: 'name', type: 'nominal', accessor: 'data.name' },
      { name: 'value', type: 'quantitative', accessor: 'value' },
      { name: 'depth', type: 'quantitative', accessor: 'depth' },
      { name: 'x0', type: 'quantitative', accessor: 'x0' },
      { name: 'y0', type: 'quantitative', accessor: 'y0' },
      { name: 'x1', type: 'quantitative', accessor: 'x1' },
      { name: 'y1', type: 'quantitative', accessor: 'y1' }
    ]
  },
  
  space: {
    width: 800,
    height: 400
  },
  
  scales: {
    color: {
      type: 'ordinal',
      scheme: 'Category10',
      domainFrom: { data: 'main', field: 'depth', method: 'values' }
    }
  },
  
  layers: [
    {
      id: 'cells',
      mark: { type: 'rect' },
      encoding: {
        x: { field: 'x0' },
        y: { field: 'y0' },
        width: { field: 'x1', transform: [{ type: 'offset', params: { offset: 'x0', operation: 'subtract' } }] },
        height: { field: 'y1', transform: [{ type: 'offset', params: { offset: 'y0', operation: 'subtract' } }] },
        color: { field: 'depth', scale: 'color' },
        stroke: { value: 'white' },
        strokeWidth: { value: 1 }
      }
    },
    {
      id: 'labels',
      mark: { type: 'text' },
      encoding: {
        x: { field: 'x0', transform: [{ type: 'offset', params: { offset: 3 } }] },
        y: { field: 'y0', transform: [{ type: 'offset', params: { offset: 15 } }] },
        text: { field: 'name' },
        fontSize: { value: 10 },
        fontFamily: { value: 'sans-serif' }
      },
      when: {
        type: 'expression',
        test: 'd => (d.x1 - d.x0) > 50 && (d.y1 - d.y0) > 20'
      }
    }
  ]
};

// Multi-line Chart with Complex Interactions
export const multiLineChart: CanonicalChartSchema = {
  id: 'canonical-multi-line',
  title: 'Stock Prices Over Time',
  
  data: {
    source: {
      type: 'url',
      url: '/data/stocks.csv',
      format: 'csv'
    },
    transforms: [
      {
        type: 'group',
        params: { by: 'symbol' },
        output: 'series'
      }
    ],
    fields: [
      { name: 'date', type: 'temporal', accessor: 'date' },
      { name: 'price', type: 'quantitative', accessor: 'price' },
      { name: 'symbol', type: 'nominal', accessor: 'symbol' }
    ]
  },
  
  space: {
    width: 900,
    height: 500,
    clips: [
      {
        id: 'chart-area',
        type: 'rect',
        params: { x: 50, y: 20, width: 830, height: 430 }
      }
    ]
  },
  
  scales: {
    x: {
      type: 'time',
      domainFrom: { data: 'main', field: 'date', method: 'extent' },
      range: [50, 880],
      nice: true
    },
    y: {
      type: 'linear',
      domainFrom: { data: 'main', field: 'price', method: 'extent' },
      range: [450, 20],
      nice: true
    },
    color: {
      type: 'ordinal',
      scheme: 'Category10',
      domainFrom: { data: 'main', field: 'symbol', method: 'values' }
    }
  },
  
  layers: [
    {
      id: 'grid-x',
      mark: {
        type: 'line',
        params: { class: 'grid' }
      },
      encoding: {
        x: { field: 'tick', scale: 'x' },
        y: { value: 20 },
        x2: { field: 'tick', scale: 'x' },
        y2: { value: 450 },
        stroke: { value: '#e0e0e0' },
        strokeWidth: { value: 0.5 }
      }
    },
    {
      id: 'lines',
      data: 'series',
      mark: {
        type: 'line',
        generator: {
          type: 'line',
          curve: 'curveMonotoneX'
        },
        groupBy: ['symbol']
      },
      encoding: {
        x: { field: 'date', scale: 'x' },
        y: { field: 'price', scale: 'y' },
        stroke: { field: 'symbol', scale: 'color' },
        strokeWidth: { value: 2 }
      },
      clipPath: 'chart-area'
    },
    {
      id: 'points',
      mark: { type: 'circle' },
      encoding: {
        x: { field: 'date', scale: 'x' },
        y: { field: 'price', scale: 'y' },
        color: { field: 'symbol', scale: 'color' },
        size: { value: 3 },
        opacity: { value: 0 }
      }
    },
    {
      id: 'x-axis',
      mark: {
        type: 'axis',
        params: { orient: 'bottom' }
      },
      encoding: {
        scale: { value: 'x' },
        position: { value: [0, 450] }
      }
    },
    {
      id: 'y-axis',
      mark: {
        type: 'axis',
        params: { orient: 'left' }
      },
      encoding: {
        scale: { value: 'y' },
        position: { value: [50, 0] }
      }
    }
  ],
  
  behaviors: [
    {
      type: 'hover',
      target: '.lines path',
      handlers: {
        mouseover: {
          action: (event: any, d: any) => {
            // Highlight line and show points
            d3.select(event.target).style('stroke-width', 4);
            d3.selectAll('.points circle')
              .filter((pointData: any) => pointData.symbol === d.symbol)
              .style('opacity', 1);
          }
        },
        mouseout: {
          action: (event: any, d: any) => {
            d3.select(event.target).style('stroke-width', 2);
            d3.selectAll('.points circle').style('opacity', 0);
          }
        }
      }
    },
    {
      type: 'zoom',
      target: 'svg',
      params: {
        scaleExtent: [1, 10],
        translateExtent: [[50, 20], [880, 450]]
      },
      handlers: {
        zoom: {
          action: 'rescaleAxes'
        }
      }
    }
  ],
  
  animations: [
    {
      trigger: 'load',
      sequence: [
        {
          target: '.lines path',
          properties: {
            'stroke-dasharray': '1000',
            'stroke-dashoffset': '1000'
          },
          duration: 0
        },
        {
          target: '.lines path',
          properties: {
            'stroke-dashoffset': '0'
          },
          duration: 2000,
          easing: 'easeLinear'
        }
      ]
    }
  ]
};

// Sunburst - Hierarchical with polar coordinates
export const sunburst: CanonicalChartSchema = {
  id: 'canonical-sunburst',
  title: 'Hierarchical Data Visualization',
  
  data: {
    source: {
      type: 'inline',
      data: {
        name: 'root',
        children: [
          {
            name: 'Category A',
            children: [
              { name: 'Item 1', value: 100 },
              { name: 'Item 2', value: 200 }
            ]
          },
          {
            name: 'Category B',
            children: [
              { name: 'Item 3', value: 150 },
              { name: 'Item 4', value: 300 }
            ]
          }
        ]
      }
    },
    transforms: [
      {
        type: 'hierarchy',
        params: {
          value: 'value',
          sum: true,
          sort: (a: any, b: any) => b.value - a.value
        }
      },
      {
        type: 'partition',
        params: {
          size: [2 * Math.PI, 200]
        }
      }
    ],
    fields: [
      { name: 'name', type: 'nominal', accessor: 'data.name' },
      { name: 'value', type: 'quantitative', accessor: 'value' },
      { name: 'depth', type: 'quantitative', accessor: 'depth' },
      { name: 'x0', type: 'quantitative', accessor: 'x0' },
      { name: 'x1', type: 'quantitative', accessor: 'x1' },
      { name: 'y0', type: 'quantitative', accessor: 'y0' },
      { name: 'y1', type: 'quantitative', accessor: 'y1' }
    ]
  },
  
  space: {
    width: 600,
    height: 600,
    coordinates: [{
      id: 'polar',
      type: 'polar',
      origin: [300, 300]
    }]
  },
  
  scales: {
    color: {
      type: 'ordinal',
      scheme: 'Category10',
      domainFrom: { data: 'main', field: 'depth', method: 'values' }
    }
  },
  
  layers: [
    {
      id: 'arcs',
      mark: {
        type: 'arc',
        generator: {
          type: 'arc',
          params: {
            startAngle: 'x0',
            endAngle: 'x1',
            innerRadius: 'y0',
            outerRadius: 'y1'
          }
        }
      },
      encoding: {
        color: { field: 'depth', scale: 'color' },
        stroke: { value: 'white' },
        strokeWidth: { value: 1 }
      },
      when: {
        type: 'expression',
        test: 'd => d.depth > 0'
      }
    },
    {
      id: 'labels',
      mark: { type: 'text' },
      encoding: {
        x: { field: 'centroid.x' },
        y: { field: 'centroid.y' },
        text: { field: 'name' },
        fontSize: { value: 10 },
        textAnchor: { value: 'middle' }
      },
      when: {
        type: 'expression',
        test: 'd => (d.x1 - d.x0) > 0.1 && (d.y1 - d.y0) > 20'
      }
    }
  ]
};

// Real-time streaming chart
export const realtimeChart: CanonicalChartSchema = {
  id: 'canonical-realtime',
  title: 'Live Data Stream',
  
  data: {
    source: {
      type: 'stream',
      url: 'ws://localhost:8080/data',
      options: { bufferSize: 100 }
    },
    transforms: [
      {
        type: 'window',
        params: { size: 50, slide: 1 }
      }
    ],
    fields: [
      { name: 'timestamp', type: 'temporal', accessor: 'timestamp' },
      { name: 'value', type: 'quantitative', accessor: 'value' }
    ]
  },
  
  space: {
    width: 800,
    height: 300
  },
  
  scales: {
    x: {
      type: 'time',
      domainFrom: { data: 'main', field: 'timestamp', method: 'extent' },
      range: [50, 750]
    },
    y: {
      type: 'linear',
      domainFrom: { data: 'main', field: 'value', method: 'extent' },
      range: [250, 50],
      nice: true
    }
  },
  
  layers: [
    {
      id: 'line',
      mark: {
        type: 'line',
        generator: { type: 'line', curve: 'curveMonotoneX' }
      },
      encoding: {
        x: { field: 'timestamp', scale: 'x' },
        y: { field: 'value', scale: 'y' },
        stroke: { value: 'steelblue' },
        strokeWidth: { value: 2 }
      }
    }
  ],
  
  animations: [
    {
      trigger: 'update',
      sequence: [
        {
          target: '.line path',
          properties: { transform: 'translateX(-10px)' },
          duration: 100,
          easing: 'easeLinear'
        }
      ]
    }
  ]
};

export const canonicalExamples = {
  barChart,
  forceDirectedGraph,
  choroplethMap,
  treemap,
  multiLineChart,
  sunburst,
  realtimeChart
};