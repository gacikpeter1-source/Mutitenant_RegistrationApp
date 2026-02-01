export interface ThemeConfig {
    name: string;
    domain: string;
    colors: {
      primary: string;
      primaryDark: string;
      background: {
        darkest: string;
        dark: string;
        card: string;
        cardHover: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
      };
      border: {
        default: string;
        light: string;
      };
    };
  }
  
  export const themes: Record<string, ThemeConfig> = {
    // Customer 1 - Arena Sršňov (original)
    'localhost': {
      name: 'Arena Sršňov',
      domain: 'localhost',
      colors: {
        primary: '#FDB913',
        primaryDark: '#E6A800',
        background: {
          darkest: '#0a0a0a',
          dark: '#1a1a1a',
          card: '#2a2a2a',
          cardHover: '#333333',
        },
        text: {
          primary: '#ffffff',
          secondary: '#e0e0e0',
          muted: '#a0a0a0',
        },
        border: {
          default: '#3a3a3a',
          light: '#4a4a4a',
        },
      },
    },
    
    // Customer 2 - Example Blue Theme
    'customer2.com': {
      name: 'Customer 2',
      domain: 'customer2.com',
      colors: {
        primary: '#3B82F6',
        primaryDark: '#2563EB',
        background: {
          darkest: '#0f172a',
          dark: '#1e293b',
          card: '#334155',
          cardHover: '#475569',
        },
        text: {
          primary: '#ffffff',
          secondary: '#e2e8f0',
          muted: '#94a3b8',
        },
        border: {
          default: '#475569',
          light: '#64748b',
        },
      },
    },
    
    // Customer 3 - Example Green Theme
    'customer3.com': {
      name: 'Customer 3',
      domain: 'customer3.com',
      colors: {
        primary: '#10B981',
        primaryDark: '#059669',
        background: {
          darkest: '#064e3b',
          dark: '#065f46',
          card: '#047857',
          cardHover: '#059669',
        },
        text: {
          primary: '#ffffff',
          secondary: '#d1fae5',
          muted: '#a7f3d0',
        },
        border: {
          default: '#059669',
          light: '#10b981',
        },
      },
    },
  };
  
  // Default theme fallback
  export const defaultTheme = themes['localhost'];
  
  // Helper function to get theme by domain
  export const getThemeByDomain = (domain: string): ThemeConfig => {
    return themes[domain] || defaultTheme;
  };