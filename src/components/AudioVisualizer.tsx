import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  accentColor?: string;
  style?: 'neon-bars' | 'wave-oscilloscope' | 'circular-reactor';
  className?: string;
  height?: number;
  width?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyserNode,
  isPlaying,
  accentColor = '#00f5ff',
  style = 'neon-bars',
  className = '',
  height = 50,
  width = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let syntheticPhase = 0;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      } else if (isPlaying) {
        // Generate realistic pulsating cyber audio wave if analyser is disconnected
        syntheticPhase += 0.08;
        for (let i = 0; i < bufferLength; i++) {
          const wave = Math.sin(syntheticPhase + i * 0.3) * 0.5 + 0.5;
          const beat = (Math.sin(syntheticPhase * 2) > 0.6 ? 0.4 : 0.1);
          dataArray[i] = Math.min(255, Math.floor((wave * 140 + beat * 90 + Math.random() * 20)));
        }
      } else {
        // Flatline idle wave
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 4;
        }
      }

      if (style === 'neon-bars') {
        const barCount = Math.min(28, bufferLength);
        const barSpacing = 3;
        const totalSpacing = (barCount - 1) * barSpacing;
        const barWidth = Math.max(2, (w - totalSpacing) / barCount);

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i];
          const percent = val / 255;
          const barHeight = Math.max(3, percent * (h - 4));
          const x = i * (barWidth + barSpacing);
          const y = h - barHeight;

          // Gradient from cyan to purple
          const gradient = ctx.createLinearGradient(0, y, 0, h);
          gradient.addColorStop(0, accentColor);
          gradient.addColorStop(1, '#8b5cf6');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          // Glowing tip
          if (isPlaying && percent > 0.3) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = accentColor;
            ctx.shadowBlur = 6;
            ctx.fillRect(x, y, barWidth, 2);
            ctx.shadowBlur = 0;
          }
        }
      } else if (style === 'wave-oscilloscope') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = w / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 255.0;
          const y = h / 2 + (v - 0.5) * (h * 0.85);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (style === 'circular-reactor') {
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) * 0.32;
        const bars = 24;

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, 0, 2 * Math.PI);
        ctx.stroke();

        for (let i = 0; i < bars; i++) {
          const angle = (i * 2 * Math.PI) / bars;
          const val = dataArray[i % bufferLength] / 255;
          const barLength = Math.max(4, val * (radius * 0.9));

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + barLength);
          const y2 = centerY + Math.sin(angle) * (radius + barLength);

          ctx.strokeStyle = i % 2 === 0 ? accentColor : '#c084fc';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [analyserNode, isPlaying, accentColor, style]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block ${className}`}
      aria-label="Audio Waveform Visualizer"
    />
  );
};
