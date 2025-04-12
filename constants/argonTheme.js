// constants/argonTheme.js
import { Platform } from 'react-native';

const argonTheme = {
  COLORS: {
    PRIMARY: '#5E72E4',       // Main brand color (purple-blue)
    SECONDARY: '#F7FAFC',     // Light background color
    ACCENT: '#FFD600',        // Highlight color (yellow)
    ERROR: '#FF3D71',         // Error/alert color (red-pink)
    SUCCESS: '#00D68F',       // Success color (green)
    WARNING: '#FFAA00',       // Warning color (orange)
    INFO: '#0095FF',          // Info color (blue)
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GRAY: '#E9ECEF',
    MUTED: '#8E8E93',
    TRANSPARENT: 'transparent',
    ICON: '#172B4D',          // Default icon color
    HEADER: '#525F7F',        // Header text color
    BORDER: '#CAD1D7',        // Border color
    OVERLAY: 'rgba(0, 0, 0, 0.7)' // Dark overlay
  },
  
  SIZES: {
    BASE: 16,                 // Base font size
    FONT: 16,                 // Default font size
    ICON: 24,                 // Default icon size
    OPACITY: 0.8,             // Default opacity
    BORDER_RADIUS: 6,         // Default border radius
    BORDER_WIDTH: 0.8,        // Default border width
    BUTTON_HEIGHT: 50,        // Default button height
    BUTTON_WIDTH: 150,        // Default button width
  },
  
  FONTS: {
    REGULAR: Platform.select({
      ios: 'System',
      android: 'Roboto'
    }),
    BOLD: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold'
    }),
    SEMIBOLD: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium'
    }),
    LIGHT: Platform.select({
      ios: 'System',
      android: 'Roboto-Light'
    }),
    THIN: Platform.select({
      ios: 'System',
      android: 'Roboto-Thin'
    })
  },
  
  SHADOWS: {
    SMALL: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.1,
      elevation: 2
    },
    MEDIUM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      shadowOpacity: 0.1,
      elevation: 4
    },
    LARGE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      shadowOpacity: 0.1,
      elevation: 8
    }
  },
  
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48
  },
  
  // App-specific theme extensions
  APP: {
    SIGN_LANGUAGE_COLOR: '#5E72E4',  // Color for sign language elements
    TEXT_LANGUAGE_COLOR: '#2D3748',  // Color for text elements
    VIDEO_BACKGROUND: '#F8F9FA',     // Video processing background
    TRANSLATION_HIGHLIGHT: '#FFD600' // Highlight for translated text
  }
};

export default argonTheme;