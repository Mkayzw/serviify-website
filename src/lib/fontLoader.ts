// Font loading optimization utility
export class FontLoader {
  private static instance: FontLoader;
  private caveatLoaded = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }

  // Preload Caveat font with fallback handling
  async preloadCaveatFont(): Promise<void> {
    if (this.caveatLoaded) return;
    
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this.loadFont();
    return this.loadPromise;
  }

  private async loadFont(): Promise<void> {
    try {
      // Check if FontFace API is supported
      if ('FontFace' in window) {
        // Try to load the variable font first
        const variableFont = new FontFace(
          'Caveat',
          'url("/src/assets/fonts/Caveat-VariableFont_wght.ttf") format("truetype")',
          {
            weight: '100 900',
            display: 'swap'
          }
        );

        await variableFont.load();
        document.fonts.add(variableFont);
        this.caveatLoaded = true;
      } else {
        // Fallback for browsers without FontFace API
        await this.loadFontViaCSS();
      }
    } catch (error) {
      console.warn('Caveat variable font failed to load, using fallback:', error);
      await this.loadFallbackFont();
    }
  }

  private async loadFontViaCSS(): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.caveatLoaded = true;
        resolve();
      };
      img.onerror = () => reject(new Error('Font loading failed'));
      
      // Use a small font sample to test loading
      img.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="30" font-family="Caveat" font-size="24">Test</text>
        </svg>
      `);
    });
  }

  private async loadFallbackFont(): Promise<void> {
    try {
      if ('FontFace' in window) {
        const fallbackFont = new FontFace(
          'Caveat',
          'url("/src/assets/fonts/static/Caveat-Regular.ttf") format("truetype")',
          {
            weight: '400',
            display: 'swap'
          }
        );

        await fallbackFont.load();
        document.fonts.add(fallbackFont);
        this.caveatLoaded = true;
      }
    } catch (error) {
      console.warn('Caveat fallback font also failed to load:', error);
      // Use system fallbacks
    }
  }

  isCaveatLoaded(): boolean {
    return this.caveatLoaded;
  }

  // Add CSS class to body when font is loaded
  applyCaveatWhenReady(): void {
    this.preloadCaveatFont().then(() => {
      document.body.classList.add('caveat-loaded');
    }).catch(() => {
      document.body.classList.add('caveat-fallback');
    });
  }
}

// Auto-initialize font loading
export const fontLoader = FontLoader.getInstance();

// Start loading immediately
fontLoader.applyCaveatWhenReady();
