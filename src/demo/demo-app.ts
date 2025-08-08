import { CanonicalChartRenderer } from '../renderer/canonical-renderer';
import { CanonicalChartSchema } from '../types/canonical-schema';
import { chartSchemas, getAllChartTypes } from '../examples/chart-schemas';

export class DemoApp {
  private currentRenderer: CanonicalChartRenderer | null = null;
  private currentSchema: CanonicalChartSchema | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupUI();
    this.loadInitialChart();
  }

  private setupUI(): void {
    // Setup chart type selector
    const selector = document.getElementById('chart-selector') as HTMLSelectElement;
    const types = getAllChartTypes();
    
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = this.formatChartTypeName(type);
      selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.loadChart(target.value);
    });

    // Setup schema editor
    const editor = document.getElementById('schema-editor') as HTMLTextAreaElement;
    editor.addEventListener('input', () => {
      this.updateSchemaFromEditor();
    });

    // Setup render button
    const renderBtn = document.getElementById('render-btn') as HTMLButtonElement;
    renderBtn.addEventListener('click', () => {
      this.renderCurrentSchema();
    });

    // Setup download button
    const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
    downloadBtn.addEventListener('click', () => {
      this.downloadSchema();
    });

    // Setup upload button
    const uploadBtn = document.getElementById('upload-btn') as HTMLInputElement;
    uploadBtn.addEventListener('change', (e) => {
      this.uploadSchema(e);
    });
  }

  private formatChartTypeName(type: string): string {
    return type
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private loadInitialChart(): void {
    const firstType = getAllChartTypes()[0];
    this.loadChart(firstType);
  }

  private loadChart(type: string): void {
    const schema = chartSchemas[type];
    if (!schema) return;

    this.currentSchema = schema;
    this.updateSchemaEditor();
    this.renderChart(schema);
    this.updateInfo(schema);
  }

  private updateSchemaEditor(): void {
    if (!this.currentSchema) return;
    
    const editor = document.getElementById('schema-editor') as HTMLTextAreaElement;
    editor.value = JSON.stringify(this.currentSchema, null, 2);
  }

  private updateSchemaFromEditor(): void {
    const editor = document.getElementById('schema-editor') as HTMLTextAreaElement;
    try {
      this.currentSchema = JSON.parse(editor.value);
      this.clearError();
    } catch (error) {
      this.showError('Invalid JSON in schema editor');
    }
  }

  private async renderChart(schema: CanonicalChartSchema): Promise<void> {
    try {
      // Clear previous chart
      const container = document.getElementById('chart-container') as HTMLElement;
      container.innerHTML = '';

      // Create SVG container
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      container.appendChild(svg);

      // Create renderer and render
      this.currentRenderer = new CanonicalChartRenderer(svg, schema);
      await this.currentRenderer.render();

      this.clearError();
      this.showSuccess('Chart rendered successfully!');
    } catch (error) {
      console.error('Rendering error:', error);
      this.showError(`Rendering error: ${(error as Error).message}`);
    }
  }

  private renderCurrentSchema(): void {
    if (this.currentSchema) {
      this.renderChart(this.currentSchema);
    }
  }

  private updateInfo(schema: CanonicalChartSchema): void {
    const info = document.getElementById('chart-info') as HTMLElement;
    
    const layerCount = schema.layers.length;
    const scaleCount = Object.keys(schema.scales).length;
    const hasAnimations = schema.animations && schema.animations.length > 0;
    const hasBehaviors = schema.behaviors && schema.behaviors.length > 0;
    const hasTransforms = schema.data.transforms && schema.data.transforms.length > 0;

    info.innerHTML = `
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Layers:</span>
          <span class="info-value">${layerCount}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Scales:</span>
          <span class="info-value">${scaleCount}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Transforms:</span>
          <span class="info-value">${hasTransforms ? '✓' : '✗'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Animations:</span>
          <span class="info-value">${hasAnimations ? '✓' : '✗'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Interactions:</span>
          <span class="info-value">${hasBehaviors ? '✓' : '✗'}</span>
        </div>
      </div>
      <div class="schema-description">
        <h4>Schema Structure:</h4>
        <ul>
          ${schema.layers.map(layer => `<li><strong>${layer.id || 'unnamed'}:</strong> ${layer.mark.type} mark</li>`).join('')}
        </ul>
      </div>
    `;
  }

  private showError(message: string): void {
    const status = document.getElementById('status') as HTMLElement;
    status.className = 'status error';
    status.textContent = message;
  }

  private showSuccess(message: string): void {
    const status = document.getElementById('status') as HTMLElement;
    status.className = 'status success';
    status.textContent = message;
    setTimeout(() => this.clearError(), 3000);
  }

  private clearError(): void {
    const status = document.getElementById('status') as HTMLElement;
    status.className = 'status';
    status.textContent = '';
  }

  private downloadSchema(): void {
    if (!this.currentSchema) return;
    
    const dataStr = JSON.stringify(this.currentSchema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.currentSchema.id}-schema.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  private uploadSchema(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const schema = JSON.parse(e.target?.result as string);
        this.currentSchema = schema;
        this.updateSchemaEditor();
        this.renderChart(schema);
        this.updateInfo(schema);
        this.showSuccess('Schema uploaded successfully!');
      } catch (error) {
        this.showError('Invalid schema file');
      }
    };
    reader.readAsText(file);
  }
}