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
  // CRITICAL: Initialize tenant from localStorage synchronously to prevent flash
  const getInitialTenant = (): Tenant => {
    const savedTenantId = localStorage.getItem('selectedTenantId')
    if (savedTenantId) {
      // Try to get cached tenant data
      const cachedTenantData = localStorage.getItem(`tenant_${savedTenantId}`)
      if (cachedTenantData) {
        try {
          return JSON.parse(cachedTenantData)
        } catch (e) {
          console.error('Failed to parse cached tenant:', e)
        }
      }
    }
    return DEFAULT_TENANT
  }

  const [tenant, setTenant] = useState<Tenant>(getInitialTenant())
  const [isLoading, setIsLoading] = useState(true)

  // Apply theme immediately on mount (synchronously)
  useEffect(() => {
    applyTheme(tenant)
  }, []) // Only on mount

  useEffect(() => {
    const loadTenant = async () => {
      try {
        // Check if user manually selected a tenant via TenantSwitcher
        const savedTenantId = localStorage.getItem('selectedTenantId');
        
        if (savedTenantId) {
          // Load the saved tenant from Firestore
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const tenantDoc = await getDoc(doc(db, 'tenants', savedTenantId));
          
          if (tenantDoc.exists()) {
            const tenantData: Tenant = {
              id: tenantDoc.id,
              name: tenantDoc.data().name,
              domain: tenantDoc.data().domain,
              isActive: tenantDoc.data().isActive,
              theme: tenantDoc.data().theme,
              logo: tenantDoc.data().logo,
              createdAt: tenantDoc.data().createdAt?.toDate(),
            };
            
            // Cache tenant data for instant loading next time
            localStorage.setItem(`tenant_${savedTenantId}`, JSON.stringify(tenantData))
            
            setTenant(tenantData);
            applyTheme(tenantData);
          } else {
            // Saved tenant not found, fall back to domain-based
            const tenantData = await getCurrentTenant();
            setTenant(tenantData);
            applyTheme(tenantData);
          }
        } else {
          // No saved tenant, use domain-based detection
          const tenantData = await getCurrentTenant();
          setTenant(tenantData);
          applyTheme(tenantData);
        }
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
    
    // MULTI-TENANT: Apply all dynamic branding
    applyFavicon(tenantData.favicon);
    applyTitle(tenantData.name);
    applyThemeColor(theme.primary);
    applyAppleTouchIcon(tenantData.logo);
    
    console.log(`Theme applied for tenant: ${tenantData.name}`);
  };

  const applyFavicon = (faviconUrl?: string) => {
    // Find or create favicon link element
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      document.head.appendChild(link);
    }
    
    // Use tenant favicon or fallback to default
    link.href = faviconUrl || '/favicon.ico';
    console.log(`Favicon applied: ${link.href}`);
  };

  const applyTitle = (tenantName: string) => {
    // Update page title
    document.title = `${tenantName} - Rezervácia tréningov`;
    console.log(`Title applied: ${document.title}`);
  };

  const applyThemeColor = (primaryColor: string) => {
    // Find or create theme-color meta tag
    let meta = document.querySelector("meta[name='theme-color']") as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    
    meta.content = primaryColor;
    console.log(`Theme color applied: ${primaryColor}`);
  };

  const applyAppleTouchIcon = (logoUrl?: string) => {
    // Find or create apple-touch-icon link element
    let link = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'apple-touch-icon';
      document.head.appendChild(link);
    }
    
    // Use tenant logo or fallback to default
    link.href = logoUrl || '/apple-touch-icon.png';
    console.log(`Apple touch icon applied: ${link.href}`);
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
