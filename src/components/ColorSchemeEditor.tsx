import React, { useState } from 'react';
import { Save, X, Copy, Palette, Eye, AlertTriangle } from 'lucide-react';
import { ColorScheme } from '../types/brand';
import { createCustomColorScheme } from '../utils/colorSchemes';
import { checkContrast } from '../utils/colorUtils';
import ColorPicker from './ColorPicker';
import ColorContrastChecker from './ColorContrastChecker';

interface ColorSchemeEditorProps {
  colorScheme?: ColorScheme;
  onSave: (colorScheme: ColorScheme) => void;
  onCancel: () => void;
}

const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({
  colorScheme,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<ColorScheme>(
    colorScheme || createCustomColorScheme('New Color Scheme')
  );
  const [activeTab, setActiveTab] = useState<'brand' | 'text' | 'backgrounds' | 'accents' | 'ui'>('brand');
  const [showPreview, setShowPreview] = useState(false);

  const handleColorChange = (colorKey: keyof ColorScheme['colors'], value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name for the color scheme.');
      return;
    }
    onSave(formData);
  };

  const duplicateScheme = () => {
    const duplicated = createCustomColorScheme(
      `${formData.name} (Copy)`,
      formData.colors
    );
    setFormData(duplicated);
  };

  const checkAccessibility = () => {
    const issues: string[] = [];
    
    // Check critical contrast ratios
    const checks = [
      { fg: formData.colors.headingText, bg: formData.colors.mainBackground, label: 'Heading text on main background' },
      { fg: formData.colors.bodyText, bg: formData.colors.mainBackground, label: 'Body text on main background' },
      { fg: formData.colors.buttonText, bg: formData.colors.buttonBackground, label: 'Button text on button background' },
      { fg: formData.colors.navigationText, bg: formData.colors.headerBackground, label: 'Navigation text on header background' },
    ];

    checks.forEach(check => {
      const contrast = checkContrast(check.fg, check.bg);
      if (!contrast.isAccessible) {
        issues.push(`${check.label}: ${contrast.ratio.toFixed(2)}:1 (needs 4.5:1)`);
      }
    });

    if (issues.length > 0) {
      alert(`Accessibility Issues Found:\n\n${issues.join('\n')}\n\nPlease adjust colors to meet WCAG standards.`);
    } else {
      alert('All critical color combinations meet WCAG AA accessibility standards!');
    }
  };

  const tabs = [
    { id: 'brand', label: 'Brand Colors', icon: <Palette className="h-4 w-4" /> },
    { id: 'text', label: 'Text Colors', icon: <span className="h-4 w-4 font-bold">Aa</span> },
    { id: 'backgrounds', label: 'Backgrounds', icon: <div className="h-4 w-4 bg-gray-300 rounded"></div> },
    { id: 'accents', label: 'Accents', icon: <div className="h-4 w-4 bg-blue-500 rounded-full"></div> },
    { id: 'ui', label: 'UI Elements', icon: <div className="h-4 w-4 border-2 border-gray-400 rounded"></div> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {colorScheme ? 'Edit Color Scheme' : 'Create Color Scheme'}
                </h3>
                <p className="text-blue-100 text-sm">Customize colors for your brand</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Toggle Preview"
              >
                <Eye className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={checkAccessibility}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Check Accessibility"
              >
                <AlertTriangle className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Editor Panel */}
          <div className="flex-1 flex flex-col">
            {/* Scheme Name */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Scheme Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter scheme name..."
                  />
                </div>
                {colorScheme && (
                  <button
                    onClick={duplicateScheme}
                    className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Duplicate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-1 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Controls */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'brand' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Primary Brand Colors</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Primary Color"
                      value={formData.colors.primary}
                      onChange={(value) => handleColorChange('primary', value)}
                    />
                    
                    <ColorPicker
                      label="Secondary Color"
                      value={formData.colors.secondary}
                      onChange={(value) => handleColorChange('secondary', value)}
                    />
                  </div>

                  <ColorContrastChecker
                    foreground={formData.colors.primary}
                    background={formData.colors.mainBackground}
                    label="Primary Color Accessibility"
                  />
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Text Colors</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Heading Text"
                      value={formData.colors.headingText}
                      onChange={(value) => handleColorChange('headingText', value)}
                    />
                    
                    <ColorPicker
                      label="Body Text"
                      value={formData.colors.bodyText}
                      onChange={(value) => handleColorChange('bodyText', value)}
                    />
                    
                    <ColorPicker
                      label="Link Default"
                      value={formData.colors.linkDefault}
                      onChange={(value) => handleColorChange('linkDefault', value)}
                    />
                    
                    <ColorPicker
                      label="Link Hover"
                      value={formData.colors.linkHover}
                      onChange={(value) => handleColorChange('linkHover', value)}
                    />
                    
                    <ColorPicker
                      label="Link Visited"
                      value={formData.colors.linkVisited}
                      onChange={(value) => handleColorChange('linkVisited', value)}
                    />
                    
                    <ColorPicker
                      label="Navigation Text"
                      value={formData.colors.navigationText}
                      onChange={(value) => handleColorChange('navigationText', value)}
                    />
                    
                    <ColorPicker
                      label="Button Text"
                      value={formData.colors.buttonText}
                      onChange={(value) => handleColorChange('buttonText', value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <ColorContrastChecker
                      foreground={formData.colors.headingText}
                      background={formData.colors.mainBackground}
                      label="Heading Text Contrast"
                    />
                    
                    <ColorContrastChecker
                      foreground={formData.colors.bodyText}
                      background={formData.colors.mainBackground}
                      label="Body Text Contrast"
                    />
                    
                    <ColorContrastChecker
                      foreground={formData.colors.buttonText}
                      background={formData.colors.buttonBackground}
                      label="Button Text Contrast"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'backgrounds' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Background Colors</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Main Background"
                      value={formData.colors.mainBackground}
                      onChange={(value) => handleColorChange('mainBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Header Background"
                      value={formData.colors.headerBackground}
                      onChange={(value) => handleColorChange('headerBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Footer Background"
                      value={formData.colors.footerBackground}
                      onChange={(value) => handleColorChange('footerBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Sidebar Background"
                      value={formData.colors.sidebarBackground}
                      onChange={(value) => handleColorChange('sidebarBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Button Background"
                      value={formData.colors.buttonBackground}
                      onChange={(value) => handleColorChange('buttonBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Button Hover"
                      value={formData.colors.buttonHoverBackground}
                      onChange={(value) => handleColorChange('buttonHoverBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Button Active"
                      value={formData.colors.buttonActiveBackground}
                      onChange={(value) => handleColorChange('buttonActiveBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Call-to-Action"
                      value={formData.colors.ctaBackground}
                      onChange={(value) => handleColorChange('ctaBackground', value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'accents' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Accent Colors</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Border Color"
                      value={formData.colors.borderColor}
                      onChange={(value) => handleColorChange('borderColor', value)}
                    />
                    
                    <ColorPicker
                      label="Icon Color"
                      value={formData.colors.iconColor}
                      onChange={(value) => handleColorChange('iconColor', value)}
                    />
                    
                    <ColorPicker
                      label="Highlight Color"
                      value={formData.colors.highlightColor}
                      onChange={(value) => handleColorChange('highlightColor', value)}
                    />
                    
                    <ColorPicker
                      label="Alert Info"
                      value={formData.colors.alertInfo}
                      onChange={(value) => handleColorChange('alertInfo', value)}
                    />
                    
                    <ColorPicker
                      label="Alert Success"
                      value={formData.colors.alertSuccess}
                      onChange={(value) => handleColorChange('alertSuccess', value)}
                    />
                    
                    <ColorPicker
                      label="Alert Warning"
                      value={formData.colors.alertWarning}
                      onChange={(value) => handleColorChange('alertWarning', value)}
                    />
                    
                    <ColorPicker
                      label="Alert Error"
                      value={formData.colors.alertError}
                      onChange={(value) => handleColorChange('alertError', value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ui' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">UI Element Colors</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Card Background"
                      value={formData.colors.cardBackground}
                      onChange={(value) => handleColorChange('cardBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Input Background"
                      value={formData.colors.inputBackground}
                      onChange={(value) => handleColorChange('inputBackground', value)}
                    />
                    
                    <ColorPicker
                      label="Input Border"
                      value={formData.colors.inputBorder}
                      onChange={(value) => handleColorChange('inputBorder', value)}
                    />
                    
                    <ColorPicker
                      label="Input Focus"
                      value={formData.colors.inputFocus}
                      onChange={(value) => handleColorChange('inputFocus', value)}
                    />
                    
                    <ColorPicker
                      label="Shadow Color"
                      value={formData.colors.shadowColor}
                      onChange={(value) => handleColorChange('shadowColor', value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Color Scheme</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h4>
              
              {/* Header Preview */}
              <div 
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: formData.colors.headerBackground }}
              >
                <h5 
                  className="font-semibold mb-2"
                  style={{ color: formData.colors.navigationText }}
                >
                  Navigation Header
                </h5>
                <div className="flex space-x-4">
                  <span 
                    className="text-sm"
                    style={{ color: formData.colors.navigationText }}
                  >
                    Dashboard
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: formData.colors.navigationText }}
                  >
                    Records
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div 
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: formData.colors.mainBackground }}
              >
                <h5 
                  className="text-lg font-bold mb-2"
                  style={{ color: formData.colors.headingText }}
                >
                  Sample Heading
                </h5>
                <p 
                  className="text-sm mb-3"
                  style={{ color: formData.colors.bodyText }}
                >
                  This is sample body text to show how it looks with your color scheme.
                </p>
                <a 
                  href="#" 
                  className="text-sm underline"
                  style={{ color: formData.colors.linkDefault }}
                >
                  Sample Link
                </a>
              </div>

              {/* Button Preview */}
              <div className="space-y-2 mb-4">
                <button 
                  className="w-full py-2 px-4 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: formData.colors.buttonBackground,
                    color: formData.colors.buttonText 
                  }}
                >
                  Primary Button
                </button>
                <button 
                  className="w-full py-2 px-4 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: formData.colors.ctaBackground,
                    color: formData.colors.buttonText 
                  }}
                >
                  Call-to-Action
                </button>
              </div>

              {/* Card Preview */}
              <div 
                className="rounded-lg p-4 mb-4"
                style={{ 
                  backgroundColor: formData.colors.cardBackground,
                  borderColor: formData.colors.borderColor,
                  borderWidth: '1px'
                }}
              >
                <h6 
                  className="font-semibold mb-2"
                  style={{ color: formData.colors.headingText }}
                >
                  Sample Card
                </h6>
                <p 
                  className="text-sm"
                  style={{ color: formData.colors.bodyText }}
                >
                  Card content with border
                </p>
              </div>

              {/* Alert Previews */}
              <div className="space-y-2">
                {[
                  { type: 'Info', color: formData.colors.alertInfo },
                  { type: 'Success', color: formData.colors.alertSuccess },
                  { type: 'Warning', color: formData.colors.alertWarning },
                  { type: 'Error', color: formData.colors.alertError }
                ].map((alert) => (
                  <div 
                    key={alert.type}
                    className="p-2 rounded text-white text-sm"
                    style={{ backgroundColor: alert.color }}
                  >
                    {alert.type} Alert
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeEditor;