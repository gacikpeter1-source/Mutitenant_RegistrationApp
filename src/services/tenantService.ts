import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tenant, DEFAULT_TENANT } from '../types/tenant';

/**
 * Get current domain from window location
 * Handles localhost, development domains, and production domains
 */
export const getCurrentDomain = (): string => {
  if (typeof window === 'undefined') return 'localhost';
  
  const hostname = window.location.hostname;
  
  // For development, always use localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'localhost';
  }
  
  // For production, return the actual domain
  return hostname;
};

/**
 * Fetch tenant configuration from Firestore based on domain
 */
export const getTenantByDomain = async (domain: string): Promise<Tenant> => {
  try {
    const tenantsRef = collection(db, 'tenants');
    const q = query(
      tenantsRef,
      where('domain', '==', domain),
      where('isActive', '==', true),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No tenant found for domain: ${domain}, using default`);
      return DEFAULT_TENANT;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      name: data.name,
      domain: data.domain,
      isActive: data.isActive,
      theme: data.theme,
      logo: data.logo,
      createdAt: data.createdAt?.toDate(),
    } as Tenant;
    
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return DEFAULT_TENANT;
  }
};

/**
 * Get current tenant based on browser domain
 */
export const getCurrentTenant = async (): Promise<Tenant> => {
  const domain = getCurrentDomain();
  return getTenantByDomain(domain);
};