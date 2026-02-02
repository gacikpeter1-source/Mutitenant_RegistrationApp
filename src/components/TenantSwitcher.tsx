import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tenant } from '../types/tenant';

interface TenantSwitcherProps {
  onTenantChange: (tenant: Tenant) => void;
}

export const TenantSwitcher = ({ onTenantChange }: TenantSwitcherProps) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const tenantsRef = collection(db, 'tenants');
        const q = query(tenantsRef, where('isActive', '==', true));
        const snapshot = await getDocs(q);
        
        const tenantList: Tenant[] = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          domain: doc.data().domain,
          isActive: doc.data().isActive,
          theme: doc.data().theme,
          logo: doc.data().logo,
        }));
        
        setTenants(tenantList);
        
        // Load saved tenant from localStorage
        const savedTenantId = localStorage.getItem('selectedTenantId');
        if (savedTenantId && tenantList.find(t => t.id === savedTenantId)) {
          setSelectedTenant(savedTenantId);
          const tenant = tenantList.find(t => t.id === savedTenantId);
          if (tenant) onTenantChange(tenant);
        } else if (tenantList.length > 0) {
          setSelectedTenant(tenantList[0].id);
        }
      } catch (error) {
        console.error('Error loading tenants:', error);
      }
    };

    loadTenants();
  }, []);

  const handleChange = (tenantId: string) => {
    setSelectedTenant(tenantId);
    localStorage.setItem('selectedTenantId', tenantId); // Save to localStorage
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      // Cache full tenant data for instant loading
      localStorage.setItem(`tenant_${tenantId}`, JSON.stringify(tenant));
      onTenantChange(tenant);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#2a2a2a',
      padding: '15px',
      borderRadius: '8px',
      border: '2px solid var(--color-primary)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        🎨 Test Theme:
      </label>
      <select
        value={selectedTenant}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          width: '200px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid var(--color-border-default)',
          background: '#1a1a1a',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        {tenants.map(tenant => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
    </div>
  );
};
