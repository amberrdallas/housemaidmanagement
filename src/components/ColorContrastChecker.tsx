import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { checkContrast } from '../utils/colorUtils';
import type { ColorContrast } from '../utils/colorUtils';

interface ColorContrastCheckerProps {
  foreground: string;
  background: string;
  label?: string;
  isLargeText?: boolean;
  className?: string;
}

const ColorContrastChecker: React.FC<ColorContrastCheckerProps> = ({
  foreground,
  background,
  label,
  isLargeText = false,
  className = ''
}) => {
  const contrast: ColorContrast = checkContrast(foreground, background);
  
  const getIcon = () => {
    switch (contrast.level) {
      case 'AAA':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'AA':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'A':
        return <Info className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (contrast.level) {
      case 'AAA':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'AA':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'A':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const getStatusText = () => {
    const ratio = contrast.ratio.toFixed(2);
    const minRatio = isLargeText ? '3:1' : '4.5:1';
    
    switch (contrast.level) {
      case 'AAA':
        return `Excellent (${ratio}:1) - Exceeds all accessibility standards`;
      case 'AA':
        return `Good (${ratio}:1) - Meets WCAG AA standards`;
      case 'A':
        return `Fair (${ratio}:1) - Meets WCAG A standards but not recommended`;
      default:
        return `Poor (${ratio}:1) - Does not meet accessibility standards (min: ${minRatio})`;
    }
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`flex items-center space-x-3 p-3 rounded-lg border ${getStatusColor()}`}>
        {getIcon()}
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium">Contrast Ratio: {contrast.ratio.toFixed(2)}:1</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              contrast.level === 'AAA' ? 'bg-green-100 text-green-800' :
              contrast.level === 'AA' ? 'bg-blue-100 text-blue-800' :
              contrast.level === 'A' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              WCAG {contrast.level}
            </span>
          </div>
          
          <p className="text-sm">{getStatusText()}</p>
          
          {isLargeText && (
            <p className="text-xs mt-1 opacity-75">
              * Large text (18pt+ or 14pt+ bold) has lower contrast requirements
            </p>
          )}
        </div>

        {/* Color Preview */}
        <div className="flex items-center space-x-2">
          <div 
            className="w-12 h-8 rounded border border-gray-300 flex items-center justify-center text-xs font-medium"
            style={{ backgroundColor: background, color: foreground }}
          >
            Aa
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorContrastChecker;