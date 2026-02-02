export interface TenantTheme {
  primary: string;
  primaryDark: string;
  backgroundImageUrl?: string; // MULTI-TENANT: Per-tenant background image
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
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  theme: TenantTheme;
  logo?: string;
  favicon?: string; // MULTI-TENANT: Per-tenant favicon URL
  createdAt?: Date;
}

export const DEFAULT_TENANT: Tenant = {
  id: 'default',
  name: 'Arena Sršňov',
  domain: 'localhost',
  isActive: true,
  theme: {
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
};
