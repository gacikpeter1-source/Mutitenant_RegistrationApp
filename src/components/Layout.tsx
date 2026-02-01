import { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './ui/button'
import { Menu, X, ArrowLeft, Globe } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation()
  const { userData, signOut, isSuperAdmin } = useAuth()
  const { tenant } = useTheme() // MULTI-TENANT: Get current tenant
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBack, setShowBack] = useState(false)

  // MULTI-TENANT: Background from tenant theme
  const backgroundUrl = tenant.theme?.backgroundImageUrl || null

  useEffect(() => {
    // Check if we can go back in history
    setShowBack(window.history.length > 1)
  }, [])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sk' ? 'en' : 'sk'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div 
        className="bg-container" 
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)'
        }}
      />

      {/* Header */}
      <header className="relative z-10 bg-background-dark/95 backdrop-blur-sm border-b border-border">
        <div className="content-container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {showBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBack}
                  className="text-primary hover:bg-primary/10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Link to="/" className="text-white hover:text-primary transition-colors">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">{tenant?.name || t('app.title')}</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                  {t('nav.home')}
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                  {t('nav.calendar')}
                </Button>
              </Link>
              <Link to="/trainers">
                <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                  {t('nav.trainers')}
                </Button>
              </Link>
              
              {userData ? (
                <>
                  {isSuperAdmin && (
                    <Link to="/superadmin">
                      <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                        SuperAdmin
                      </Button>
                    </Link>
                  )}
                  {(userData.role === 'admin' || isSuperAdmin) && (
                    <>
                      <Link to="/admin">
                        <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                          {t('nav.admin')}
                        </Button>
                      </Link>
                      <Link to="/import-schedule">
                        <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                          {t('nav.importSchedule') || 'Import Schedule'}
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/settings">
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                      {t('nav.settings')}
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">
                      {t('nav.profile')}
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" className="text-white border-border hover:bg-primary/10 hover:border-primary">
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary-gold font-semibold">
                    {t('nav.login')}
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="text-white hover:text-primary hover:bg-primary/10 flex flex-col items-center gap-0.5 h-auto py-2 px-3"
                title={i18n.language === 'sk' ? 'English' : 'Slovenčina'}
              >
                <Globe className="h-5 w-5" />
                <span className="text-[10px] leading-none">{t('nav.language')}</span>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="text-white hover:text-primary hover:bg-primary/10 flex flex-col items-center gap-0.5 h-auto py-2 px-3"
              >
                <Globe className="h-5 w-5" />
                <span className="text-[10px] leading-none">{t('nav.language')}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-primary hover:bg-primary/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-2 border-t border-border mt-4 pt-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                  {t('nav.home')}
                </Button>
              </Link>
              <Link to="/calendar" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                  {t('nav.calendar')}
                </Button>
              </Link>
              <Link to="/trainers" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                  {t('nav.trainers')}
                </Button>
              </Link>
              
              {userData ? (
                <>
                  {isSuperAdmin && (
                    <Link to="/superadmin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                        SuperAdmin
                      </Button>
                    </Link>
                  )}
                  {(userData.role === 'admin' || isSuperAdmin) && (
                    <>
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                          {t('nav.admin')}
                        </Button>
                      </Link>
                      <Link to="/import-schedule" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                          {t('nav.importSchedule') || 'Import Schedule'}
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                      {t('nav.settings')}
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-primary/10 justify-start">
                      {t('nav.profile')}
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} 
                    variant="outline" 
                    className="w-full text-white border-border hover:bg-primary/10 hover:border-primary justify-start"
                  >
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-gold font-semibold justify-start">
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}
