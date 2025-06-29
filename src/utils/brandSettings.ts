import { BrandSettings, ColorScheme } from '../types/brand';
import { defaultColorSchemes, getDefaultColorScheme } from './colorSchemes';

const BRAND_STORAGE_KEY = 'housemaid_brand_settings';

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  companyName: 'Housemaid Management',
  tagline: 'Professional Database System',
  primaryColor: '#2563eb', // Legacy support
  secondaryColor: '#7c3aed', // Legacy support
  copyrightText: '© 2024 Housemaid Management. All rights reserved.',
  activeColorScheme: 'default-blue',
  colorSchemes: defaultColorSchemes,
};

export const saveBrandSettings = (settings: BrandSettings): void => {
  // Ensure color schemes are included
  if (!settings.colorSchemes || settings.colorSchemes.length === 0) {
    settings.colorSchemes = defaultColorSchemes;
  }
  
  // Ensure active color scheme is set
  if (!settings.activeColorScheme) {
    settings.activeColorScheme = getDefaultColorScheme().id;
  }
  
  localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(settings));
};

export const loadBrandSettings = (): BrandSettings => {
  const data = localStorage.getItem(BRAND_STORAGE_KEY);
  let settings = data ? { ...DEFAULT_BRAND_SETTINGS, ...JSON.parse(data) } : DEFAULT_BRAND_SETTINGS;
  
  // Migration: Ensure color schemes exist
  if (!settings.colorSchemes || settings.colorSchemes.length === 0) {
    settings.colorSchemes = defaultColorSchemes;
  }
  
  // Migration: Set active color scheme if not set
  if (!settings.activeColorScheme) {
    settings.activeColorScheme = getDefaultColorScheme().id;
  }
  
  return settings;
};

export const resetBrandSettings = (): void => {
  localStorage.removeItem(BRAND_STORAGE_KEY);
};

export const getActiveColorScheme = (settings: BrandSettings): ColorScheme => {
  if (!settings.colorSchemes || settings.colorSchemes.length === 0) {
    return getDefaultColorScheme();
  }
  
  const activeScheme = settings.colorSchemes.find(
    scheme => scheme.id === settings.activeColorScheme
  );
  
  return activeScheme || settings.colorSchemes[0] || getDefaultColorScheme();
};

export const saveColorScheme = (settings: BrandSettings, colorScheme: ColorScheme): BrandSettings => {
  const updatedSettings = { ...settings };
  
  if (!updatedSettings.colorSchemes) {
    updatedSettings.colorSchemes = [];
  }
  
  const existingIndex = updatedSettings.colorSchemes.findIndex(
    scheme => scheme.id === colorScheme.id
  );
  
  const updatedScheme = {
    ...colorScheme,
    updatedAt: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    updatedSettings.colorSchemes[existingIndex] = updatedScheme;
  } else {
    updatedSettings.colorSchemes.push(updatedScheme);
  }
  
  return updatedSettings;
};

export const deleteColorScheme = (settings: BrandSettings, schemeId: string): BrandSettings => {
  const updatedSettings = { ...settings };
  
  if (!updatedSettings.colorSchemes) {
    return updatedSettings;
  }
  
  // Don't allow deletion of default schemes
  const schemeToDelete = updatedSettings.colorSchemes.find(scheme => scheme.id === schemeId);
  if (schemeToDelete?.isDefault) {
    return updatedSettings;
  }
  
  updatedSettings.colorSchemes = updatedSettings.colorSchemes.filter(
    scheme => scheme.id !== schemeId
  );
  
  // If the deleted scheme was active, switch to default
  if (updatedSettings.activeColorScheme === schemeId) {
    updatedSettings.activeColorScheme = getDefaultColorScheme().id;
  }
  
  return updatedSettings;
};

export const setActiveColorScheme = (settings: BrandSettings, schemeId: string): BrandSettings => {
  const updatedSettings = { ...settings };
  
  // Verify the scheme exists
  const schemeExists = updatedSettings.colorSchemes?.some(
    scheme => scheme.id === schemeId
  );
  
  if (schemeExists) {
    updatedSettings.activeColorScheme = schemeId;
  }
  
  return updatedSettings;
};