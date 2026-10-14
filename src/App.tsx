import { useState, useEffect, useCallback } from 'react';
import { BrowserWindow } from './components/browser/BrowserWindow';
import { PublishedSite } from './types/browser';
import { initStorage, getAllSites } from './services/storage';

export default function App() {
  const [sites, setSites] = useState<PublishedSite[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refreshSites = useCallback(async () => {
    try {
      const data = await getAllSites();
      setSites(data);
    } catch (err) {
      console.error('Failed to load sites:', err);
    }
  }, []);

  useEffect(() => {
    async function setup() {
      await initStorage();
      await refreshSites();
      setIsReady(true);
    }
    setup();
  }, [refreshSites]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-950 text-slate-100 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl mb-4 animate-bounce">
          🚀
        </div>
        <div className="text-sm font-bold text-white tracking-wide">
          Запуск PlaytonHT Browser...
        </div>
        <div className="text-xs text-sky-400 mt-1 font-semibold">
          Этот браузер принадлежит корпорации Playton
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      <BrowserWindow sites={sites} onRefreshSites={refreshSites} />
    </div>
  );
}
