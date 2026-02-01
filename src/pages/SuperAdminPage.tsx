import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Tenant } from '@/types/tenant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

export default function SuperAdminPage() {
  const { isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Redirect if not superadmin
  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/')
    }
  }, [isSuperAdmin, navigate])

  // Load all tenants
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const tenantsRef = collection(db, 'tenants')
        const snapshot = await getDocs(tenantsRef)
        
        const tenantList: Tenant[] = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          domain: doc.data().domain,
          isActive: doc.data().isActive,
          theme: doc.data().theme,
          logo: doc.data().logo,
          createdAt: doc.data().createdAt?.toDate(),
        }))
        
        setTenants(tenantList)
      } catch (error) {
        console.error('Error loading tenants:', error)
        toast({
          title: 'Error',
          description: 'Failed to load tenants',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (isSuperAdmin) {
      loadTenants()
    }
  }, [isSuperAdmin, toast])

  const handleCreateTenant = () => {
    setIsCreating(true)
    setEditingTenant({
      id: '',
      name: '',
      domain: '',
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
    })
  }

  const handleSaveTenant = async () => {
    if (!editingTenant) return

    if (!editingTenant.name || !editingTenant.domain) {
      toast({
        title: 'Error',
        description: 'Name and domain are required',
        variant: 'destructive'
      })
      return
    }

    try {
      if (isCreating) {
        // Create new tenant
        const docRef = await addDoc(collection(db, 'tenants'), {
          name: editingTenant.name,
          domain: editingTenant.domain,
          isActive: editingTenant.isActive,
          theme: editingTenant.theme,
          logo: editingTenant.logo || '',
          createdAt: Timestamp.now(),
        })

        setTenants([...tenants, { ...editingTenant, id: docRef.id }])
        
        toast({
          title: 'Success',
          description: 'Tenant created successfully'
        })
      } else {
        // Update existing tenant
        await updateDoc(doc(db, 'tenants', editingTenant.id), {
          name: editingTenant.name,
          domain: editingTenant.domain,
          isActive: editingTenant.isActive,
          theme: editingTenant.theme,
          logo: editingTenant.logo || '',
        })

        setTenants(tenants.map(t => t.id === editingTenant.id ? editingTenant : t))
        
        toast({
          title: 'Success',
          description: 'Tenant updated successfully'
        })
      }

      setEditingTenant(null)
      setIsCreating(false)
    } catch (error) {
      console.error('Error saving tenant:', error)
      toast({
        title: 'Error',
        description: 'Failed to save tenant',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('Are you sure you want to delete this tenant? This cannot be undone.')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'tenants', tenantId))
      setTenants(tenants.filter(t => t.id !== tenantId))
      
      toast({
        title: 'Success',
        description: 'Tenant deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting tenant:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete tenant',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    setEditingTenant(null)
    setIsCreating(false)
  }

  if (!isSuperAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="content-container py-8">
        <div className="text-white text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="content-container py-8">
      <div className="mb-8">
        <h1 className="text-white mb-2">SuperAdmin Dashboard</h1>
        <p className="text-white/80">Manage tenants and their configurations</p>
      </div>

      {!editingTenant && (
        <div className="mb-6">
          <Button onClick={handleCreateTenant} className="bg-primary hover:bg-primary-gold">
            <Plus className="mr-2 h-4 w-4" />
            Create New Tenant
          </Button>
        </div>
      )}

      {editingTenant && (
        <Card className="arena-card mb-6">
          <CardHeader>
            <CardTitle className="text-white">
              {isCreating ? 'Create New Tenant' : 'Edit Tenant'}
            </CardTitle>
            <CardDescription className="text-white/70">
              Configure tenant settings and theme colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="name" className="text-white">Tenant Name</Label>
                <Input
                  id="name"
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., Arena Sršňov"
                />
              </div>

              <div>
                <Label htmlFor="domain" className="text-white">Domain</Label>
                <Input
                  id="domain"
                  value={editingTenant.domain}
                  onChange={(e) => setEditingTenant({ ...editingTenant, domain: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., arena-srsnov.com or localhost"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingTenant.isActive}
                  onChange={(e) => setEditingTenant({ ...editingTenant, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="text-white">Active</Label>
              </div>
            </div>

            {/* Theme Colors */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Theme Colors</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary" className="text-white">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary"
                      type="color"
                      value={editingTenant.theme.primary}
                      onChange={(e) => setEditingTenant({
                        ...editingTenant,
                        theme: { ...editingTenant.theme, primary: e.target.value }
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={editingTenant.theme.primary}
                      onChange={(e) => setEditingTenant({
                        ...editingTenant,
                        theme: { ...editingTenant.theme, primary: e.target.value }
                      })}
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="primaryDark" className="text-white">Primary Dark</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryDark"
                      type="color"
                      value={editingTenant.theme.primaryDark}
                      onChange={(e) => setEditingTenant({
                        ...editingTenant,
                        theme: { ...editingTenant.theme, primaryDark: e.target.value }
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={editingTenant.theme.primaryDark}
                      onChange={(e) => setEditingTenant({
                        ...editingTenant,
                        theme: { ...editingTenant.theme, primaryDark: e.target.value }
                      })}
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bgDarkest" className="text-white">Background Darkest</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgDarkest"
                      type="color"
                      value={editingTenant.theme.background.darkest}
                      onChange={(e) => setEditingTenant({
                        ...editingTenant,
                        theme: {
                          ...editingTenant.theme,
                          background: { ...editingTenant.theme.background, darkest: e.target.value }
                        }
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={editingTenant.theme.background.darkest}
                      className="bg-white/10 border-white/20 text-white flex-1"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bgCard" className="text-white">Card Background</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgCard"
                      type="color"
                      value={editingTenant.theme.background.card}
                      onChange={(e) => setEditingTenant({
                        ...editingTenant,
                        theme: {
                          ...editingTenant.theme,
                          background: { ...editingTenant.theme.background, card: e.target.value }
                        }
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={editingTenant.theme.background.card}
                      className="bg-white/10 border-white/20 text-white flex-1"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveTenant} className="bg-primary hover:bg-primary-gold">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!editingTenant && (
        <div className="grid gap-4">
          {tenants.map(tenant => (
            <Card key={tenant.id} className="arena-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{tenant.name}</CardTitle>
                    <CardDescription className="text-white/70">
                      {tenant.domain}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setEditingTenant(tenant)}
                      className="bg-primary hover:bg-primary-gold"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTenant(tenant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border-2 border-white/20"
                      style={{ backgroundColor: tenant.theme.primary }}
                    />
                    <span className="text-white/70 text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border-2 border-white/20"
                      style={{ backgroundColor: tenant.theme.background.card }}
                    />
                    <span className="text-white/70 text-sm">Card</span>
                  </div>
                  <div className={`ml-auto px-3 py-1 rounded-full text-sm ${
                    tenant.isActive
                      ? 'bg-status-success/20 text-status-success'
                      : 'bg-status-muted/20 text-status-muted'
                  }`}>
                    {tenant.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
