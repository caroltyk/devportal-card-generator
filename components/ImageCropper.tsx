import React, { useEffect, useRef } from 'react';

interface ImageCropperProps {
  base64Source: string | null;
  targetWidth: number;
  targetHeight: number;
  onProcessed: (processedBase64: string) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ base64Source, targetWidth, targetHeight, onProcessed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!base64Source || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Logic to cover the canvas with the source image (maintaining aspect ratio, center crop)
      const targetRatio = targetWidth / targetHeight;
      const sourceRatio = img.width / img.height;

      let renderWidth = targetWidth;
      let renderHeight = targetHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (sourceRatio > targetRatio) {
        // Source is wider than target - fit height, crop width
        renderHeight = targetHeight;
        renderWidth = img.width * (targetHeight / img.height);
        offsetX = (targetWidth - renderWidth) / 2; // Center horizontally
      } else {
        // Source is taller than target (or same) - fit width, crop height
        renderWidth = targetWidth;
        renderHeight = img.height * (targetWidth / img.width);
        offsetY = (targetHeight - renderHeight) / 2; // Center vertically
      }

      // Clear and draw
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

      // Export
      const processed = canvas.toDataURL('image/png');
      onProcessed(processed);
    };

    img.src = `data:image/png;base64,${base64Source}`;
  }, [base64Source, targetWidth, targetHeight, onProcessed]);

  return (
    <canvas 
      ref={canvasRef} 
      width={targetWidth} 
      height={targetHeight} 
      className="hidden" 
      aria-hidden="true"
    />
  );
};
