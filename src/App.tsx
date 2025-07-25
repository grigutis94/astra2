import './App.css'
import TankConfigForm from './components/TankConfigForm'
import LanguageSelector from './components/LanguageSelector'
import Logo from './components/Logo'
import { useTranslation } from './contexts/LanguageContext'

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={false} />
              <div>
                <h1 className="text-xl font-bold text-neutral-dark">
                  {t('header.title')}
                </h1>
                <p className="text-sm text-muted">
                  {t('header.subtitle')}
                </p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8">
        <TankConfigForm />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center">
            <p className="text-sm text-muted">
              {t('© 2025 Astra Tank Configurator. All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
