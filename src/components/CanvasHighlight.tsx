import { useEffect, useRef } from 'react';

interface HighlightProps {
  type?: 'highlight' | 'underline'; // Two different highlight styles
  width?: number; // Width of the canvas
  height?: number; // Height of the canvas
}

const CanvasHighlight: React.FC<HighlightProps> = ({ 
  type = 'highlight',
  width = 300,
  height = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions - this is crucial for proper rendering
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (type === 'highlight') {
      // Brown highlight style
      ctx.fillStyle = 'rgba(255, 187, 61, 0.8)'; // Warm brown/yellow highlight
      
      // Draw a full highlight
      ctx.beginPath();
      ctx.moveTo(0, height / 3);
      ctx.bezierCurveTo(
        width / 4, height / 5,  // Control point 1
        (3 * width) / 4, (2 * height) / 5,  // Control point 2
        width, height / 3  // End point
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    } else {
      // Dark blue underline style
      ctx.strokeStyle = '#0a2463'; // Dark blue color
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // Draw a slightly wavy underline
      ctx.beginPath();
      ctx.moveTo(0, height - 3);
      ctx.bezierCurveTo(
        width / 3, height - 2,  
        (2 * width) / 3, height - 4,  
        width, height - 3
      );
      ctx.stroke();
    }
    
  }, [width, height, type]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 0, // Changed from -1 to 0 to ensure visibility
        display: 'block', // Ensures the canvas is displayed
      }}
    />
  );
};

export default CanvasHighlight;