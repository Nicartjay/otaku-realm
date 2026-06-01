import { createContext, useCallback, useContext, useState } from 'react'

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k })

/**
 * Language provider — stores 'en' | 'jp' in state + localStorage.
 * Provides `lang`, `setLang`, and `t(key)` for translations.
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem('lang')
      if (stored === 'jp') return 'jp'
    } catch {
      // localStorage unavailable
    }
    return 'en'
  })

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem('lang', next)
    } catch {
      // ignore
    }
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'jp' : 'en')
  }, [lang, setLang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export default LanguageContext
