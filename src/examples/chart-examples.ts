import { ChartSchema } from '../types/chart-schema';

// Example schemas for different chart types
export const chartExamples: Record<string, ChartSchema> = {
  // Basic bar chart
  barChart: {
    id: 'bar-chart-example',
    type: 'bar',
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
        { name: 'category', type: 'ordinal', role: 'x' },
        { name: 'value', type: 'quantitative', role: 'y' }
      ]
    },
    dimensions: {
      width: 800,
      height: 400,
      margin: { top: 20, right: 20, bottom: 40, left: 40 }
    },
    scales: {
      x: { type: 'band', padding: 0.1 },
      y: { type: 'linear', nice: true },
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    axes: {
      x: { show: true, title: 'Category' },
      y: { show: true, title: 'Value' }
    },
    marks: [{
      type: 'rect',
      encoding: {
        x: { field: 'category' },
        y: { field: 'value' },
        color: { field: 'category' }
      },
      style: {
        fill: 'steelblue'
      }
    }],
    legend: { show: false }
  },

  // Scatter plot
  scatterPlot: {
    id: 'scatter-plot-example',
    type: 'scatter',
    title: 'Height vs Weight',
    data: {
      source: {
        type: 'generated',
        params: { count: 100, type: 'random' }
      },
      fields: [
        { name: 'x', type: 'quantitative', role: 'x' },
        { name: 'y', type: 'quantitative', role: 'y' },
        { name: 'category', type: 'nominal', role: 'color' }
      ]
    },
    dimensions: {
      width: 600,
      height: 400,
      margin: { top: 20, right: 20, bottom: 40, left: 40 }
    },
    scales: {
      x: { type: 'linear', nice: true },
      y: { type: 'linear', nice: true },
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    axes: {
      x: { show: true, title: 'X Value' },
      y: { show: true, title: 'Y Value' }
    },
    marks: [{
      type: 'circle',
      encoding: {
        x: { field: 'x' },
        y: { field: 'y' },
        color: { field: 'category' }
      },
      style: {
        radius: 4,
        opacity: 0.7
      }
    }],
    legend: { show: true, position: 'right' },
    interactions: {
      hover: { enabled: true, tooltip: true },
      zoom: { enabled: true, scaleExtent: [1, 10] }
    }
  },

  // Line chart
  lineChart: {
    id: 'line-chart-example',
    type: 'line',
    title: 'Stock Price Over Time',
    data: {
      source: {
        type: 'generated',
        params: { count: 50, type: 'timeseries' }
      },
      fields: [
        { name: 'date', type: 'temporal', role: 'x' },
        { name: 'value', type: 'quantitative', role: 'y' }
      ]
    },
    dimensions: {
      width: 800,
      height: 300,
      margin: { top: 20, right: 20, bottom: 40, left: 40 }
    },
    scales: {
      x: { type: 'time', nice: true },
      y: { type: 'linear', nice: true }
    },
    axes: {
      x: { show: true, title: 'Date' },
      y: { show: true, title: 'Price ($)' }
    },
    marks: [{
      type: 'line',
      encoding: {
        x: { field: 'date' },
        y: { field: 'value' }
      },
      style: {
        stroke: 'steelblue',
        strokeWidth: 2,
        curve: 'curveMonotoneX'
      }
    }],
    interactions: {
      hover: { enabled: true },
      pan: { enabled: true }
    },
    animations: {
      duration: 1000,
      ease: 'easeLinear'
    }
  },

  // Pie chart
  pieChart: {
    id: 'pie-chart-example',
    type: 'pie',
    title: 'Market Share',
    data: {
      source: {
        type: 'inline',
        data: [
          { segment: 'Mobile', share: 45 },
          { segment: 'Desktop', share: 35 },
          { segment: 'Tablet', share: 20 }
        ]
      },
      fields: [
        { name: 'segment', type: 'nominal', role: 'color' },
        { name: 'share', type: 'quantitative', role: 'angle' }
      ]
    },
    dimensions: {
      width: 400,
      height: 400,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    scales: {
      color: { type: 'ordinal', scheme: 'Set3' }
    },
    marks: [{
      type: 'arc',
      encoding: {
        angle: { field: 'share' },
        color: { field: 'segment' }
      },
      style: {
        innerRadius: 0,
        stroke: 'white',
        strokeWidth: 2
      }
    }],
    legend: { show: true, position: 'right' }
  },

  // Geographic map
  choroplethMap: {
    id: 'choropleth-map-example',
    type: 'choropleth',
    title: 'Population by State',
    data: {
      source: {
        type: 'url',
        url: '/data/us-states.json'
      },
      fields: [
        { name: 'geometry', type: 'geojson', role: 'geoshape' },
        { name: 'population', type: 'quantitative', role: 'color' }
      ]
    },
    dimensions: {
      width: 800,
      height: 500,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    scales: {
      color: { type: 'sequential', scheme: 'Blues' }
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
      translate: [400, 250]
    },
    legend: { show: true, position: 'bottom-right' }
  },

  // Force-directed network
  forceDirectedGraph: {
    id: 'force-directed-example',
    type: 'force-directed',
    title: 'Network Graph',
    data: {
      source: {
        type: 'inline',
        data: {
          nodes: [
            { id: 'A', group: 1 },
            { id: 'B', group: 1 },
            { id: 'C', group: 2 },
            { id: 'D', group: 2 }
          ],
          links: [
            { source: 'A', target: 'B', value: 1 },
            { source: 'B', target: 'C', value: 2 },
            { source: 'C', target: 'D', value: 1 }
          ]
        }
      },
      fields: [
        { name: 'id', type: 'nominal', role: 'text' },
        { name: 'group', type: 'nominal', role: 'color' }
      ]
    },
    dimensions: {
      width: 600,
      height: 400,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    marks: [
      {
        type: 'line',
        encoding: {},
        style: { stroke: '#999', strokeOpacity: 0.6 }
      },
      {
        type: 'circle',
        encoding: {
          color: { field: 'group' }
        },
        style: { radius: 5, stroke: '#fff', strokeWidth: 1.5 }
      }
    ],
    forces: {
      simulation: { alpha: 1, alphaDecay: 0.01 },
      forces: {
        link: { distance: 30, strength: 1 },
        manyBody: { strength: -300 },
        center: { x: 300, y: 200 }
      }
    },
    interactions: {
      drag: { enabled: true }
    }
  },

  // Hierarchical treemap
  treemap: {
    id: 'treemap-example',
    type: 'treemap',
    title: 'File System Hierarchy',
    data: {
      source: {
        type: 'inline',
        data: {
          name: 'root',
          children: [
            {
              name: 'folder1',
              children: [
                { name: 'file1.txt', value: 100 },
                { name: 'file2.txt', value: 200 }
              ]
            },
            {
              name: 'folder2',
              children: [
                { name: 'file3.txt', value: 150 },
                { name: 'file4.txt', value: 300 }
              ]
            }
          ]
        }
      },
      fields: [
        { name: 'name', type: 'nominal', role: 'text' },
        { name: 'value', type: 'quantitative', role: 'size' }
      ]
    },
    dimensions: {
      width: 600,
      height: 400,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    scales: {
      color: { type: 'ordinal', scheme: 'Category10' }
    },
    marks: [{
      type: 'rect',
      encoding: {
        color: { field: 'depth' }
      },
      style: {
        stroke: 'white',
        strokeWidth: 1
      }
    }],
    hierarchy: {
      value: 'value',
      sum: (d: any) => d.value || 0,
      sort: (a: any, b: any) => b.value - a.value
    },
    layout: {
      type: 'treemap',
      padding: 1,
      round: true
    }
  }
};

// Helper function to get example by chart type
export function getExampleByType(chartType: string): ChartSchema | null {
  const examples = Object.values(chartExamples);
  return examples.find(example => example.type === chartType) || null;
}

// Helper function to list all available chart types
export function getAvailableChartTypes(): string[] {
  return Array.from(new Set(Object.values(chartExamples).map(example => example.type)));
}