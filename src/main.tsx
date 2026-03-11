import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';
import Home from './pages/Home';
import Library from './pages/Library';
import Analyze from './pages/Analyze';
import Compare from './pages/Compare';
import FAQ from './pages/FAQ';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<App />}>
            <Route index element={<Home />} />
            <Route path="library" element={<Library />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="analyze/:id" element={<Analyze />} />
            <Route path="compare" element={<Compare />} />
            <Route path="formulas" element={<FAQ />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
