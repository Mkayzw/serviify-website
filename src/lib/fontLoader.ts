// Aggressive Caveat font loading - NO FALLBACKS
import caveatFontUrl from '/assets/fonts/Caveat-VariableFont_wght.ttf';

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

  // Aggressively preload ONLY Caveat font
  async preloadCaveatFont(): Promise<void> {
    if (this.caveatLoaded) return;
    
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this.loadFont();
    return this.loadPromise;
  }

  private async loadFont(): Promise<void> {
    try {
      // Use FontFace API for immediate loading
      if ('FontFace' in window) {
        const caveatFont = new FontFace(
          'Caveat',
          `url(${caveatFontUrl}) format("truetype")`,
          {
            weight: '100 900',
            display: 'block' // Block until loaded - no fallbacks
          }
        );

        await caveatFont.load();
        document.fonts.add(caveatFont);
        this.caveatLoaded = true;
        console.log('Caveat font loaded successfully');
      } else {
        // For older browsers, force load via CSS
        this.caveatLoaded = true;
      }
    } catch (error) {
      console.error('Caveat font failed to load:', error);
      // Still mark as loaded to prevent infinite retries
      this.caveatLoaded = true;
    }
  }

  isCaveatLoaded(): boolean {
    return this.caveatLoaded;
  }

  // Apply font immediately when ready
  applyCaveatWhenReady(): void {
    this.preloadCaveatFont().then(() => {
      document.body.classList.add('caveat-loaded');
    });
  }
}

// Auto-initialize font loading
export const fontLoader = FontLoader.getInstance();

// Start loading immediately
fontLoader.applyCaveatWhenReady();
