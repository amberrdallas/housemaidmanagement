import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Copy, RefreshCw } from 'lucide-react';
import { 
  hexToRgb, 
  rgbToHsl, 
  isValidHexColor, 
  normalizeColor,
  generateColorPalette 
} from '../utils/colorUtils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  disabled?: boolean;
  showPalette?: boolean;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  showPalette = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copied, setCopied] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    
    if (format === 'hex' && isValidHexColor(newValue)) {
      onChange(newValue);
    } else if (format !== 'hex') {
      const normalized = normalizeColor(newValue);
      if (normalized !== '#000000' || newValue.includes('0')) {
        onChange(normalized);
      }
    }
  };

  const handleColorClick = (color: string) => {
    onChange(color);
    setInputValue(color);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    onChange(randomColor);
    setInputValue(randomColor);
  };

  const getFormattedValue = () => {
    const rgb = hexToRgb(value);
    if (!rgb) return value;

    switch (format) {
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
      default:
        return value;
    }
  };

  const palette = showPalette ? generateColorPalette(value) : [];

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-center space-x-2">
        {/* Color Preview */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style={{ backgroundColor: value }}
          title={`Current color: ${value}`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
        </button>

        {/* Color Input */}
        <div className="flex-1">
          <div className="flex">
            <input
              type="text"
              value={format === 'hex' ? inputValue : getFormattedValue()}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={format === 'hex' ? '#000000' : 'Enter color...'}
            />
            
            {/* Format Toggle */}
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'hex' | 'rgb' | 'hsl')}
              disabled={disabled}
              className="px-2 py-2 border-l-0 border-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
            </select>

            {/* Action Buttons */}
            <div className="flex border-l-0 border-gray-300 rounded-r-lg overflow-hidden">
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={disabled}
                className="px-2 py-2 bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy color"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
              
              <button
                type="button"
                onClick={generateRandomColor}
                disabled={disabled}
                className="px-2 py-2 bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate random color"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-80">
          {/* Native Color Picker */}
          <div className="mb-4">
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorClick(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Color Palette */}
          {showPalette && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Color Variations</h4>
              <div className="grid grid-cols-9 gap-1 mb-4">
                {palette.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleColorClick(color)}
                    className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Common Colors */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Common Colors</h4>
            <div className="grid grid-cols-8 gap-1">
              {[
                '#000000', '#ffffff', '#ff0000', '#00ff00', 
                '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                '#800000', '#008000', '#000080', '#808000',
                '#800080', '#008080', '#c0c0c0', '#808080'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorClick(color)}
                  className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;