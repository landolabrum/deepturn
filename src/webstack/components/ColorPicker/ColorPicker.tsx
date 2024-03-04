// components/FixedColorPicker.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ColorPicker.scss'; // Importing the SCSS file
import { debounce } from 'lodash';
import UiInput from '../UiInput/UiInput';

interface IColorPicker {
  hex?: string;
  onChange?: (color: string) => void;
}

const ColorPicker = ({ hex, onChange }: IColorPicker) => {
  const [color, setColor] = useState<string | undefined>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth; // Set the internal canvas width
      canvas.height = canvas.offsetHeight; // Set the internal canvas height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.15, 'yellow');
        gradient.addColorStop(0.33, 'green');
        gradient.addColorStop(0.49, 'cyan');
        gradient.addColorStop(0.67, 'blue');
        gradient.addColorStop(0.84, 'magenta');
        gradient.addColorStop(1, 'red');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const debouncedOnChange = useCallback(
    debounce((pickedColor) => {
      if (onChange) {
        onChange(pickedColor);
      }
    }, 1000),
    [onChange]
  );

  const rgbaToHex = (r: number, g: number, b: number) => {
    const rgb = (r << 16) | (g << 8) | (b << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  };
  const pickColor = (event: any) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const rect = canvas.getBoundingClientRect(); // Get canvas dimensions and position
        const x = event.clientX - rect.left; // Adjust mouse position to canvas coordinates
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const pickedColor = rgbaToHex(pixel[0], pixel[1], pixel[2]);
        !hex && setColor(pickedColor);
        debouncedOnChange(pickedColor); // Call the debounced onChange
      }
    }
  };
const handleInput = (e: any)=>{
  const {name, value}=e.target;
  console.log('[ handleInput ]',{name,value})
  setColor(`#${value}`);
  value.length === 6 && debouncedOnChange(value);
};

useEffect(() => {
  if(!color){
    setColor(hex?hex:"#fff");
  }
}, [hex, setColor, handleInput]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='color-picker'>
        <div className='color-picker__info'>
        <div
          className='preview-color'
          style={{ backgroundColor: color }}
        />
        <div className='color-picker__info'>
          #
        <UiInput 
          value={color?.replaceAll('#','')}
          name='hex'
          onChange={handleInput}
          size='sm'
          />
        </div>
         </div>
        <canvas ref={canvasRef} className='color-canvas' onClick={pickColor}></canvas>
      </div>
    </>
  );
};

export default ColorPicker;
