import { useState } from 'react';
import { seedTenants } from '../scripts/seedTenants';

export const SeedButton = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    setMessage('Seeding tenants...');
    
    try {
      await seedTenants();
      setStatus('success');
      setMessage('✅ Tenants seeded successfully! Check your Firestore console.');
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 9999,
      background: '#2a2a2a',
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid #FDB913'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Seed Tenants</h3>
      <button
        onClick={handleSeed}
        disabled={status === 'loading'}
        style={{
          padding: '10px 20px',
          background: '#FDB913',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: '4px',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px',
          width: '100%'
        }}
      >
        {status === 'loading' ? 'Seeding...' : 'Seed Database'}
      </button>
      {message && (
        <p style={{ 
          margin: '10px 0 0 0', 
          color: status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#fff',
          fontSize: '14px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};
