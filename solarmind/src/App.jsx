import { useState } from 'react'
import Hero from './components/Hero'
import InputWizard from './components/InputWizard'
import LoadingPipeline from './components/LoadingPipeline'
import ResultsDashboard from './components/ResultsDashboard'
import { useSolarPipeline } from './hooks/useSolarPipeline'
import './App.css'

function App() {
  const [showWizard, setShowWizard] = useState(false)
  const { status, results, error, loadingStep, run, reset } = useSolarPipeline()

  const handleGetStarted = () => {
    setShowWizard(true)
    setTimeout(() => {
      document.getElementById('wizard-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleWizardComplete = (phase1Data) => {
    // Kick off Phase 2→5 pipeline
    run(phase1Data)
    setTimeout(() => {
      document.getElementById('pipeline-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleReset = () => {
    reset()
    setShowWizard(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      {/* Always show hero */}
      <Hero onGetStarted={handleGetStarted} />

      {/* InputWizard — shown until pipeline starts */}
      {showWizard && status === 'idle' && (
        <section id="wizard-section">
          <InputWizard onComplete={handleWizardComplete} />
        </section>
      )}

      {/* Loading & Results */}
      {status !== 'idle' && (
        <section id="pipeline-section">
          {status === 'loading' && <LoadingPipeline loadingStep={loadingStep} />}

          {status === 'error' && (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 solar-glow">
              <div className="max-w-md w-full bg-surface-container-low border border-red-500/20 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-on-surface mb-2">Something went wrong</h2>
                <p className="text-sm text-on-surface-variant mb-6">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container text-sm font-semibold transition-all"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={() => {
                      reset()
                      setShowWizard(true)
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-amber-600 text-on-primary text-sm font-bold transition-all hover:opacity-90"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && results && (
            <ResultsDashboard results={results} onReset={handleReset} />
          )}
        </section>
      )}
    </div>
  )
}

export default App
