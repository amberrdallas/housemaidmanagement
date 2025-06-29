import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Save, 
  RotateCcw, 
  Image, 
  Palette, 
  Type, 
  X, 
  Eye, 
  Trash2,
  Download,
  Building,
  Copyright,
  Plus,
  Edit,
  Check,
  AlertTriangle
} from 'lucide-react';
import { BrandSettings as BrandSettingsType, ColorScheme } from '../types/brand';
import { 
  saveColorScheme, 
  deleteColorScheme, 
  setActiveColorScheme, 
  getActiveColorScheme 
} from '../utils/brandSettings';
import { defaultColorSchemes } from '../utils/colorSchemes';
import { checkContrast } from '../utils/colorUtils';
import BrandLogo from './BrandLogo';
import ColorSchemeEditor from './ColorSchemeEditor';

interface BrandSettingsProps {
  brandSettings: BrandSettingsType;
  onSave: (settings: BrandSettingsType) => void;
  onClose: () => void;
}

const BrandSettings: React.FC<BrandSettingsProps> = ({ brandSettings, onSave, onClose }) => {
  const [formData, setFormData] = useState<BrandSettingsType>(brandSettings);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorEditor, setShowColorEditor] = useState(false);
  const [editingColorScheme, setEditingColorScheme] = useState<ColorScheme | undefined>();
  const [activeTab, setActiveTab] = useState<'general' | 'colors'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeColorScheme = getActiveColorScheme(formData);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - only images
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/svg+xml'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPG, PNG, WebP, SVG).');
      return;
    }

    // Validate file size (1MB limit for logos)
    if (file.size > 1 * 1024 * 1024) {
      alert('Logo size must be less than 1MB.');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setFormData(prev => ({
          ...prev,
          logoFileName: file.name,
          logoFileData: base64Data,
          logoFileType: file.type,
          logoUploadDate: new Date().toISOString()
        }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading logo file. Please try again.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error uploading logo. Please try again.');
      setIsUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logoFileName: undefined,
      logoFileData: undefined,
      logoFileType: undefined,
      logoUploadDate: undefined
    }));
  };

  const handleDownloadLogo = () => {
    if (!formData.logoFileData || !formData.logoFileName) return;

    try {
      const link = document.createElement('a');
      link.href = formData.logoFileData;
      link.download = formData.logoFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error downloading logo. Please try again.');
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all brand settings to default?')) {
      setFormData({
        companyName: 'Housemaid Management',
        tagline: 'Professional Database System',
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        copyrightText: '© 2024 Housemaid Management. All rights reserved.',
        activeColorScheme: 'default-blue',
        colorSchemes: defaultColorSchemes,
      });
    }
  };

  const handleColorSchemeSelect = (schemeId: string) => {
    const updatedSettings = setActiveColorScheme(formData, schemeId);
    setFormData(updatedSettings);
  };

  const handleColorSchemeSave = (colorScheme: ColorScheme) => {
    const updatedSettings = saveColorScheme(formData, colorScheme);
    setFormData(updatedSettings);
    setShowColorEditor(false);
    setEditingColorScheme(undefined);
  };

  const handleColorSchemeDelete = (schemeId: string) => {
    if (window.confirm('Are you sure you want to delete this color scheme?')) {
      const updatedSettings = deleteColorScheme(formData, schemeId);
      setFormData(updatedSettings);
    }
  };

  const handleEditColorScheme = (colorScheme: ColorScheme) => {
    setEditingColorScheme(colorScheme);
    setShowColorEditor(true);
  };

  const handleCreateColorScheme = () => {
    setEditingColorScheme(undefined);
    setShowColorEditor(true);
  };

  const formatFileSize = (base64String: string): string => {
    try {
      const sizeInBytes = (base64String.length * 3) / 4;
      if (sizeInBytes < 1024) return `${sizeInBytes.toFixed(0)} B`;
      if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return 'Unknown size';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const checkColorSchemeAccessibility = (colorScheme: ColorScheme): number => {
    const checks = [
      { fg: colorScheme.colors.headingText, bg: colorScheme.colors.mainBackground },
      { fg: colorScheme.colors.bodyText, bg: colorScheme.colors.mainBackground },
      { fg: colorScheme.colors.buttonText, bg: colorScheme.colors.buttonBackground },
      { fg: colorScheme.colors.navigationText, bg: colorScheme.colors.headerBackground },
    ];

    return checks.filter(check => checkContrast(check.fg, check.bg).isAccessible).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Brand Settings</h3>
                <p className="text-blue-100 text-sm">Customize your application branding and colors</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-1 px-6">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                    activeTab === 'general'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>General</span>
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                    activeTab === 'colors'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  <span>Color Schemes</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="space-y-8">
                  {/* Logo Upload Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Image className="h-5 w-5 mr-2 text-blue-600" />
                      Company Logo
                    </h4>
                    
                    {formData.logoFileData ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                              <img
                                src={formData.logoFileData}
                                alt="Logo preview"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{formData.logoFileName}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(formData.logoFileData)} • Uploaded {formData.logoUploadDate ? formatDate(formData.logoUploadDate) : 'Unknown date'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setShowPreview(true)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview Logo"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDownloadLogo}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download Logo"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleRemoveLogo}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove Logo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
                        <div className="text-center">
                          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                            {isUploading ? (
                              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                            ) : (
                              <Image className="h-16 w-16" />
                            )}
                          </div>
                          <div className="mb-4">
                            <p className="text-lg font-medium text-gray-900 mb-1">
                              {isUploading ? 'Uploading Logo...' : 'Upload Company Logo'}
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, WebP, or SVG up to 1MB
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.svg"
                            onChange={handleLogoUpload}
                            disabled={isUploading}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                          >
                            <Upload className="h-4 w-4" />
                            <span>{isUploading ? 'Uploading...' : 'Choose Logo'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Company Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Type className="h-5 w-5 mr-2 text-blue-600" />
                      Company Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyName || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={formData.tagline || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company tagline"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copyright Text Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Copyright className="h-5 w-5 mr-2 text-blue-600" />
                      Login Page Footer
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Copyright Text
                      </label>
                      <input
                        type="text"
                        value={formData.copyrightText || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, copyrightText: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="© 2024 Housemaid Management. All rights reserved."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This text will appear at the bottom of the login page. Leave empty to use the default format.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Color Schemes</h4>
                      <p className="text-sm text-gray-600">Manage your brand color schemes and accessibility</p>
                    </div>
                    <button
                      onClick={handleCreateColorScheme}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Scheme</span>
                    </button>
                  </div>

                  {/* Color Schemes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.colorSchemes?.map((colorScheme) => {
                      const accessibilityScore = checkColorSchemeAccessibility(colorScheme);
                      const isActive = formData.activeColorScheme === colorScheme.id;

                      return (
                        <div
                          key={colorScheme.id}
                          className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                            isActive 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleColorSchemeSelect(colorScheme.id)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-semibold text-gray-900">{colorScheme.name}</h5>
                                {isActive && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <Check className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                )}
                                {colorScheme.isDefault && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Default
                                  </span>
                                )}
                              </div>
                              
                              {/* Accessibility Score */}
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center space-x-1">
                                  {accessibilityScore === 4 ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  )}
                                  <span className="text-xs text-gray-600">
                                    Accessibility: {accessibilityScore}/4 checks passed
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditColorScheme(colorScheme);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Color Scheme"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              
                              {!colorScheme.isDefault && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleColorSchemeDelete(colorScheme.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Color Scheme"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Color Preview */}
                          <div className="grid grid-cols-8 gap-1 mb-3">
                            {[
                              colorScheme.colors.primary,
                              colorScheme.colors.secondary,
                              colorScheme.colors.headingText,
                              colorScheme.colors.bodyText,
                              colorScheme.colors.buttonBackground,
                              colorScheme.colors.alertSuccess,
                              colorScheme.colors.alertWarning,
                              colorScheme.colors.alertError
                            ].map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>

                          {/* Sample Text */}
                          <div 
                            className="p-3 rounded"
                            style={{ backgroundColor: colorScheme.colors.mainBackground }}
                          >
                            <h6 
                              className="font-semibold text-sm mb-1"
                              style={{ color: colorScheme.colors.headingText }}
                            >
                              Sample Heading
                            </h6>
                            <p 
                              className="text-xs"
                              style={{ color: colorScheme.colors.bodyText }}
                            >
                              Sample body text with{' '}
                              <span style={{ color: colorScheme.colors.linkDefault }}>
                                a link
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Default</span>
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="w-80 bg-gray-50 border-l p-6 overflow-y-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h4>
            <div className="space-y-6">
              {/* Header Preview */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Navigation Header</h5>
                <div 
                  className="rounded-lg p-3"
                  style={{ backgroundColor: activeColorScheme.colors.headerBackground }}
                >
                  <BrandLogo brandSettings={formData} size="medium" />
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Main Content</h5>
                <div 
                  className="rounded-lg p-4"
                  style={{ backgroundColor: activeColorScheme.colors.mainBackground }}
                >
                  <h6 
                    className="font-bold text-lg mb-2"
                    style={{ color: activeColorScheme.colors.headingText }}
                  >
                    Sample Heading
                  </h6>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: activeColorScheme.colors.bodyText }}
                  >
                    This is sample body text to demonstrate how your content will look.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm underline"
                    style={{ color: activeColorScheme.colors.linkDefault }}
                  >
                    Sample Link
                  </a>
                </div>
              </div>

              {/* Button Preview */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Buttons</h5>
                <div className="space-y-2">
                  <button 
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                    style={{ 
                      backgroundColor: activeColorScheme.colors.buttonBackground,
                      color: activeColorScheme.colors.buttonText 
                    }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                    style={{ 
                      backgroundColor: activeColorScheme.colors.ctaBackground,
                      color: activeColorScheme.colors.buttonText 
                    }}
                  >
                    Call-to-Action
                  </button>
                </div>
              </div>

              {/* Alert Preview */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Alerts</h5>
                <div className="space-y-2">
                  {[
                    { type: 'Success', color: activeColorScheme.colors.alertSuccess },
                    { type: 'Warning', color: activeColorScheme.colors.alertWarning },
                    { type: 'Error', color: activeColorScheme.colors.alertError },
                    { type: 'Info', color: activeColorScheme.colors.alertInfo }
                  ].map((alert) => (
                    <div 
                      key={alert.type}
                      className="p-2 rounded text-white text-xs font-medium"
                      style={{ backgroundColor: alert.color }}
                    >
                      {alert.type} Alert
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Active Color Palette</h5>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(activeColorScheme.colors).slice(0, 12).map(([key, color]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-8 h-8 rounded border border-gray-300 mx-auto mb-1"
                        style={{ backgroundColor: color }}
                        title={`${key}: ${color}`}
                      />
                      <span className="text-xs text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Preview Modal */}
        {showPreview && formData.logoFileData && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-lg font-semibold text-gray-900">Logo Preview</h4>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 flex justify-center">
                <img
                  src={formData.logoFileData}
                  alt="Logo preview"
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Color Scheme Editor Modal */}
        {showColorEditor && (
          <ColorSchemeEditor
            colorScheme={editingColorScheme}
            onSave={handleColorSchemeSave}
            onCancel={() => {
              setShowColorEditor(false);
              setEditingColorScheme(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BrandSettings;