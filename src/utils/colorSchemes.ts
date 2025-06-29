import { ColorScheme } from '../types/brand';

// Default color schemes
export const defaultColorSchemes: ColorScheme[] = [
  {
    id: 'default-blue',
    name: 'Professional Blue',
    colors: {
      // Primary brand colors
      primary: '#2563eb',
      secondary: '#7c3aed',
      
      // Text colors
      headingText: '#1f2937',
      bodyText: '#374151',
      linkDefault: '#2563eb',
      linkHover: '#1d4ed8',
      linkVisited: '#7c3aed',
      navigationText: '#ffffff',
      buttonText: '#ffffff',
      
      // Background colors
      mainBackground: '#ffffff',
      headerBackground: '#2563eb',
      footerBackground: '#1f2937',
      sidebarBackground: '#f9fafb',
      buttonBackground: '#2563eb',
      buttonHoverBackground: '#1d4ed8',
      buttonActiveBackground: '#1e40af',
      ctaBackground: '#7c3aed',
      
      // Accent colors
      borderColor: '#e5e7eb',
      iconColor: '#6b7280',
      highlightColor: '#fef3c7',
      alertInfo: '#3b82f6',
      alertSuccess: '#10b981',
      alertWarning: '#f59e0b',
      alertError: '#ef4444',
      
      // Additional UI colors
      cardBackground: '#ffffff',
      inputBackground: '#ffffff',
      inputBorder: '#d1d5db',
      inputFocus: '#2563eb',
      shadowColor: '#00000010'
    },
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'modern-green',
    name: 'Modern Green',
    colors: {
      // Primary brand colors
      primary: '#059669',
      secondary: '#0d9488',
      
      // Text colors
      headingText: '#1f2937',
      bodyText: '#374151',
      linkDefault: '#059669',
      linkHover: '#047857',
      linkVisited: '#0d9488',
      navigationText: '#ffffff',
      buttonText: '#ffffff',
      
      // Background colors
      mainBackground: '#ffffff',
      headerBackground: '#059669',
      footerBackground: '#1f2937',
      sidebarBackground: '#f0fdf4',
      buttonBackground: '#059669',
      buttonHoverBackground: '#047857',
      buttonActiveBackground: '#065f46',
      ctaBackground: '#0d9488',
      
      // Accent colors
      borderColor: '#e5e7eb',
      iconColor: '#6b7280',
      highlightColor: '#dcfce7',
      alertInfo: '#3b82f6',
      alertSuccess: '#10b981',
      alertWarning: '#f59e0b',
      alertError: '#ef4444',
      
      // Additional UI colors
      cardBackground: '#ffffff',
      inputBackground: '#ffffff',
      inputBorder: '#d1d5db',
      inputFocus: '#059669',
      shadowColor: '#00000010'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    colors: {
      // Primary brand colors
      primary: '#7c3aed',
      secondary: '#a855f7',
      
      // Text colors
      headingText: '#1f2937',
      bodyText: '#374151',
      linkDefault: '#7c3aed',
      linkHover: '#6d28d9',
      linkVisited: '#a855f7',
      navigationText: '#ffffff',
      buttonText: '#ffffff',
      
      // Background colors
      mainBackground: '#ffffff',
      headerBackground: '#7c3aed',
      footerBackground: '#1f2937',
      sidebarBackground: '#faf5ff',
      buttonBackground: '#7c3aed',
      buttonHoverBackground: '#6d28d9',
      buttonActiveBackground: '#5b21b6',
      ctaBackground: '#a855f7',
      
      // Accent colors
      borderColor: '#e5e7eb',
      iconColor: '#6b7280',
      highlightColor: '#f3e8ff',
      alertInfo: '#3b82f6',
      alertSuccess: '#10b981',
      alertWarning: '#f59e0b',
      alertError: '#ef4444',
      
      // Additional UI colors
      cardBackground: '#ffffff',
      inputBackground: '#ffffff',
      inputBorder: '#d1d5db',
      inputFocus: '#7c3aed',
      shadowColor: '#00000010'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    colors: {
      // Primary brand colors
      primary: '#ea580c',
      secondary: '#f97316',
      
      // Text colors
      headingText: '#1f2937',
      bodyText: '#374151',
      linkDefault: '#ea580c',
      linkHover: '#c2410c',
      linkVisited: '#f97316',
      navigationText: '#ffffff',
      buttonText: '#ffffff',
      
      // Background colors
      mainBackground: '#ffffff',
      headerBackground: '#ea580c',
      footerBackground: '#1f2937',
      sidebarBackground: '#fff7ed',
      buttonBackground: '#ea580c',
      buttonHoverBackground: '#c2410c',
      buttonActiveBackground: '#9a3412',
      ctaBackground: '#f97316',
      
      // Accent colors
      borderColor: '#e5e7eb',
      iconColor: '#6b7280',
      highlightColor: '#fed7aa',
      alertInfo: '#3b82f6',
      alertSuccess: '#10b981',
      alertWarning: '#f59e0b',
      alertError: '#ef4444',
      
      // Additional UI colors
      cardBackground: '#ffffff',
      inputBackground: '#ffffff',
      inputBorder: '#d1d5db',
      inputFocus: '#ea580c',
      shadowColor: '#00000010'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dark-theme',
    name: 'Dark Professional',
    colors: {
      // Primary brand colors
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      
      // Text colors
      headingText: '#f9fafb',
      bodyText: '#e5e7eb',
      linkDefault: '#60a5fa',
      linkHover: '#93c5fd',
      linkVisited: '#a78bfa',
      navigationText: '#f9fafb',
      buttonText: '#ffffff',
      
      // Background colors
      mainBackground: '#111827',
      headerBackground: '#1f2937',
      footerBackground: '#0f172a',
      sidebarBackground: '#1f2937',
      buttonBackground: '#3b82f6',
      buttonHoverBackground: '#2563eb',
      buttonActiveBackground: '#1d4ed8',
      ctaBackground: '#8b5cf6',
      
      // Accent colors
      borderColor: '#374151',
      iconColor: '#9ca3af',
      highlightColor: '#1e40af',
      alertInfo: '#3b82f6',
      alertSuccess: '#10b981',
      alertWarning: '#f59e0b',
      alertError: '#ef4444',
      
      // Additional UI colors
      cardBackground: '#1f2937',
      inputBackground: '#374151',
      inputBorder: '#4b5563',
      inputFocus: '#3b82f6',
      shadowColor: '#00000040'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getDefaultColorScheme = (): ColorScheme => {
  return defaultColorSchemes.find(scheme => scheme.isDefault) || defaultColorSchemes[0];
};

export const createCustomColorScheme = (name: string, baseColors?: Partial<ColorScheme['colors']>): ColorScheme => {
  const defaultScheme = getDefaultColorScheme();
  
  return {
    id: `custom-${Date.now()}`,
    name,
    colors: {
      ...defaultScheme.colors,
      ...baseColors
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};