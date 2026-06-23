import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Edit3 } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string | null) => void;
  placeholder?: string;
}

export default function SignatureCanvas({ onSave, placeholder = "امضای خود را اینجا بکشید..." }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set brush options
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b'; // Slate-800
    ctx.lineWidth = 2.5;

    // Fix DPI scaling & resize
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 128;

    // Fill with white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.preventDefault();

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.preventDefault();

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset brush stroke style
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    
    setHasDrawn(false);
    setIsDrawing(false);
    onSave(null);
  };

  return (
    <div id="signature-canvas-container" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 select-none">
          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
          <span>{placeholder}</span>
        </span>
        {hasDrawn && (
          <button
            id="clear-sig-btn"
            type="button"
            onClick={handleClear}
            className="text-[10px] text-rose-500 hover:text-rose-600 flex items-center gap-1 font-bold py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>پاک کردن امضا</span>
          </button>
        )}
      </div>

      <div className="relative border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 rounded-xl overflow-hidden bg-white shadow-inner">
        <canvas
          id="signature-html5-canvas"
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-32 block cursor-crosshair touch-none bg-white"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[11px] text-slate-400 font-bold bg-slate-50 border border-slate-100/80 px-3 py-1.5 rounded-full shadow-xs">
              ترسیم امضاء با فلم یا لمس صفحه
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
