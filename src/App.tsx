import './App.css'
import TankConfigForm from './components/TankConfigForm'
import LanguageSelector from './components/LanguageSelector'
import { useTranslation } from './contexts/LanguageContext'

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-astra-light dark:bg-astra-dark transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('header.title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('header.subtitle')}
              </p>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8">
        <TankConfigForm />
      </main>
    </div>
  )
}

export default App
