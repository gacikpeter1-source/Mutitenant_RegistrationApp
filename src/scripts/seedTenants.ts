import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const tenants = [
  {
    name: 'Arena Sršňov',
    domain: 'localhost',
    isActive: true,
    createdAt: Timestamp.now(),
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
  },
  {
    name: 'Customer 2 - Blue Theme',
    domain: 'customer2.example.com',
    isActive: true,
    createdAt: Timestamp.now(),
    theme: {
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
  {
    name: 'Customer 3 - Green Theme',
    domain: 'customer3.example.com',
    isActive: true,
    createdAt: Timestamp.now(),
    theme: {
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
];

export const seedTenants = async () => {
  console.log('Starting tenant seeding...');
  
  try {
    const tenantsRef = collection(db, 'tenants');
    
    for (const tenant of tenants) {
      const docRef = await addDoc(tenantsRef, tenant);
      console.log(`✅ Created tenant: ${tenant.name} (ID: ${docRef.id})`);
    }
    
    console.log('✅ Tenant seeding completed successfully!');
    console.log(`Total tenants created: ${tenants.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding tenants:', error);
    throw error;
  }
};
