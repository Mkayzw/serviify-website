import { useRef, useEffect, useState } from 'react';
import CanvasHighlight from './CanvasHighlight';

interface TextWithHighlightProps {
  text: string;
  type?: 'highlight' | 'underline';
  className?: string;
  fontSize?: number;
  fontWeight?: number | string;
  lineHeight?: number;
  fontFamily?: string;
}

const TextWithHighlight: React.FC<TextWithHighlightProps> = ({
  text,
  type = 'highlight',
  className = '',
  fontSize = 48,
  fontWeight = 700,
  lineHeight = 1.2,
  fontFamily = 'inherit'
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Load fonts first to prevent rendering issues
  useEffect(() => {
    // Check if document.fonts is supported (modern browsers)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
        // After fonts are loaded, calculate sizes
        setTimeout(calculateSize, 0);
      });
    } else {
      // Fallback for browsers without font loading API
      setFontsLoaded(true);
    }
  }, []);
  
  const calculateSize = () => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      
      if (type === 'highlight') {
        // Set dimensions for the full highlight
        setDimensions({
          width: rect.width + 40, // Increase padding for better visibility
          height: rect.height * 0.7 // Adjust height to better fit under text
        });
        
        // Position for the full highlight
        setPosition({
          x: -20,
          y: rect.height * 0.6 // Position towards the bottom portion of the text
        });
      } else {
        // Set dimensions for the underline
        setDimensions({
          width: rect.width + 20, // Less padding needed for underline
          height: 10 // Small height for underline
        });
        
        // Position for the underline
        setPosition({
          x: -10,
          y: rect.height - 5 // Position at the bottom of the text
        });
      }
    }
  };
  
  useEffect(() => {
    if (fontsLoaded) {
      calculateSize();
      
      // Recalculate on window resize
      window.addEventListener('resize', calculateSize);
      return () => window.removeEventListener('resize', calculateSize);
    }
  }, [text, fontsLoaded, type]);
  
  return (
    <div 
      className={`highlight-container ${className}`}
      style={{ 
        position: 'relative',
        display: 'inline-block',
        fontSize: `${fontSize}px`,
        fontWeight,
        lineHeight,
        fontFamily,
        paddingBottom: '5px' // Add padding to ensure highlight is fully visible
      }}
    >
      <div ref={textRef} style={{ position: 'relative', zIndex: 2 }}>
        {text}
      </div>
      {fontsLoaded && dimensions.width > 0 && (
        <div
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            width: dimensions.width,
            height: dimensions.height,
            zIndex: 1, // Ensure it's below the text but visible
            pointerEvents: 'none' // Make it non-interactive
          }}
        >
          <CanvasHighlight
            type={type}
            width={dimensions.width}
            height={dimensions.height}
          />
        </div>
      )}
    </div>
  );
};

export default TextWithHighlight; 