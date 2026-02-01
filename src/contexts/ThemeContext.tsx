import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Tenant, DEFAULT_TENANT } from '../types/tenant';
import { getCurrentTenant } from '../services/tenantService';

interface ThemeContextType {
  tenant: Tenant;
  isLoading: boolean;
  setTenant: (tenant: Tenant) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  tenant: DEFAULT_TENANT,
  isLoading: true,
  setTenant: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [tenant, setTenant] = useState<Tenant>(DEFAULT_TENANT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const tenantData = await getCurrentTenant();
        setTenant(tenantData);
        applyTheme(tenantData);
      } catch (error) {
        console.error('Failed to load tenant:', error);
        // Use default theme on error
        applyTheme(DEFAULT_TENANT);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, []);

  const applyTheme = (tenantData: Tenant) => {
    const root = document.documentElement;
    const { theme } = tenantData;

    // Apply colors to CSS variables
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-dark', theme.primaryDark);
    
    // Background colors
    root.style.setProperty('--color-background-darkest', theme.background.darkest);
    root.style.setProperty('--color-background-dark', theme.background.dark);
    root.style.setProperty('--color-background-card', theme.background.card);
    root.style.setProperty('--color-background-card-hover', theme.background.cardHover);
    
    // Text colors
    root.style.setProperty('--color-text-primary', theme.text.primary);
    root.style.setProperty('--color-text-secondary', theme.text.secondary);
    root.style.setProperty('--color-text-muted', theme.text.muted);
    
    // Border colors
    root.style.setProperty('--color-border-default', theme.border.default);
    root.style.setProperty('--color-border-light', theme.border.light);

    // Update Tailwind colors via CSS variables (HSL format for Tailwind)
    // Convert hex to RGB for CSS variables
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        : '0 0 0';
    };

    // Update primary color for Tailwind (in RGB format)
    const primaryRgb = hexToRgb(theme.primary);
    root.style.setProperty('--primary', primaryRgb);
    
    console.log(`Theme applied for tenant: ${tenantData.name}`);
  };

  const handleSetTenant = (newTenant: Tenant) => {
    setTenant(newTenant);
    applyTheme(newTenant);
  };

  return (
    <ThemeContext.Provider value={{ tenant, isLoading, setTenant: handleSetTenant }}>
      {children}
    </ThemeContext.Provider>
  );
};
