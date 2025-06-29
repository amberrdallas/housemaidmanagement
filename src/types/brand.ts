export interface ColorScheme {
  id: string;
  name: string;
  colors: {
    // Primary brand colors
    primary: string;
    secondary: string;
    
    // Text colors
    headingText: string;
    bodyText: string;
    linkDefault: string;
    linkHover: string;
    linkVisited: string;
    navigationText: string;
    buttonText: string;
    
    // Background colors
    mainBackground: string;
    headerBackground: string;
    footerBackground: string;
    sidebarBackground: string;
    buttonBackground: string;
    buttonHoverBackground: string;
    buttonActiveBackground: string;
    ctaBackground: string;
    
    // Accent colors
    borderColor: string;
    iconColor: string;
    highlightColor: string;
    alertInfo: string;
    alertSuccess: string;
    alertWarning: string;
    alertError: string;
    
    // Additional UI colors
    cardBackground: string;
    inputBackground: string;
    inputBorder: string;
    inputFocus: string;
    shadowColor: string;
  };
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSettings {
  logoFileName?: string;
  logoFileData?: string; // Base64 encoded image data
  logoFileType?: string; // MIME type
  logoUploadDate?: string;
  companyName?: string;
  tagline?: string;
  primaryColor?: string; // Legacy support
  secondaryColor?: string; // Legacy support
  copyrightText?: string;
  
  // New color scheme system
  activeColorScheme?: string; // ID of the active color scheme
  colorSchemes?: ColorScheme[];
}