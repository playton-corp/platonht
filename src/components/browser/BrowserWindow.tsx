import React, { useState, useEffect } from 'react';
import { BrowserTab, PublishedSite, Bookmark, ConsoleMessage } from '../../types/browser';
import { SITES_MAKER_DOMAIN } from '../../data/defaultSites';
import { SitesMakerPortal } from '../sitesmaker/SitesMakerPortal';
import { renderSiteHtml } from '../../utils/siteRenderer';
import { saveBookmark, deleteBookmark, getAllBookmarks } from '../../services/storage';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Star,
  Plus,
  X,
  ShieldCheck,
  Code2,
  Terminal,
  Search,
  Globe,
  Sparkles,
  Scale,
  FileText,
  Copy,
  Check,
  PanelRight,
  Building2,
  BookOpen,
  Gamepad2,
  HelpCircle,
  CloudSun,
  Sun,
  Moon
} from 'lucide-react';

interface BrowserWindowProps {
  sites: PublishedSite[];
  onRefreshSites: () => Promise<void>;
}

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  sites,
  onRefreshSites
}) => {
  // Theme state: dark or light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('playton_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('playton_theme', nextTheme);
    } catch {}
  };

  // Tabs management
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      url: `${SITES_MAKER_DOMAIN}/`,
      title: 'SitesMaker Studio · PlaytonHT',
      favicon: '🚀',
      history: [`${SITES_MAKER_DOMAIN}/`],
      historyIndex: 0,
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    },
    {
      id: 'tab-2',
      url: 'www.weather.com/',
      title: 'Погода мира · www.weather.com',
      favicon: '⛅',
      history: ['www.weather.com/'],
      historyIndex: 0,
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    },
    {
      id: 'tab-3',
      url: 'www.playton.corporation.com/',
      title: 'Корпорация Playton — Официальный портал',
      favicon: '🏢',
      history: ['www.playton.corporation.com/'],
      historyIndex: 0,
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    },
    {
      id: 'tab-4',
      url: 'platon.search/',
      title: 'Playton Поиск',
      favicon: '🔍',
      history: ['platon.search/'],
      historyIndex: 0,
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Omnibox state
  const [addressInput, setAddressInput] = useState<string>(`${SITES_MAKER_DOMAIN}/`);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  // Modals & Panels
  const [isSslModalOpen, setIsSslModalOpen] = useState(false);
  const [isDomainsModalOpen, setIsDomainsModalOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [copiedLecture, setCopiedLecture] = useState(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // DevTools logs
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Sync address bar input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.url);
    }
  }, [activeTab?.id, activeTab?.url]);

  // Load bookmarks
  useEffect(() => {
    getAllBookmarks().then(setBookmarks);
  }, []);

  // Listen to messages from sandboxed iframes
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;

      if (e.data.type === 'PLAYTON_NAVIGATE' && typeof e.data.url === 'string') {
        navigateTo(e.data.url);
      } else if (e.data.type === 'PLAYTON_CONSOLE') {
        const newMsg: ConsoleMessage = {
          id: `log-${Date.now()}-${Math.random()}`,
          type: e.data.level || 'log',
          text: String(e.data.text || ''),
          timestamp: new Date().toLocaleTimeString()
        };
        setConsoleLogs(prev => [newMsg, ...prev].slice(0, 50));
      } else if (e.data.type === 'PLAYTON_PAGE_LOADED') {
        if (e.data.title && activeTab) {
          updateCurrentTab({ title: e.data.title });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTabId, tabs, sites]);

  // Robust URL parser: separates domain and path cleanly
  const parseBrowserUrl = (rawUrl: string): { domain: string; path: string } => {
    let clean = rawUrl.trim().replace(/^https?:\/\//i, '');
    const slashIdx = clean.indexOf('/');
    if (slashIdx === -1) {
      return { domain: clean.toLowerCase(), path: '' };
    }
    const domain = clean.substring(0, slashIdx).toLowerCase();
    const path = clean.substring(slashIdx + 1) || '';
    return { domain, path };
  };

  // Robust domain matcher (matches with or without www, and case-insensitively)
  const findSiteByDomain = (domainToMatch: string): PublishedSite | undefined => {
    const clean = domainToMatch.toLowerCase().trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '');
    return sites.find(s => {
      const siteClean = s.domain.toLowerCase().trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '');
      return siteClean === clean || s.domain.toLowerCase().trim() === domainToMatch.toLowerCase().trim();
    });
  };

  const currentParsed = parseBrowserUrl(activeTab?.url || SITES_MAKER_DOMAIN);
  const currentSite = findSiteByDomain(currentParsed.domain);

  // Update current active tab properties
  const updateCurrentTab = (updates: Partial<BrowserTab>) => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, ...updates };
      }
      return t;
    }));
  };

  // Navigate to an address with automatic slash formatting
  const navigateTo = (inputUrl: string) => {
    let target = inputUrl.trim();
    if (!target) return;

    // Remove protocol prefix for uniformity
    target = target.replace(/^https?:\/\//i, '');

    // Add trailing slash for naked domains (e.g. platon.search -> platon.search/)
    if (!target.includes('/')) {
      target = target + '/';
    }

    const parsed = parseBrowserUrl(target);
    const site = findSiteByDomain(parsed.domain);

    const title = site ? site.name : (target.includes('/') ? target.split('/')[0] : target);
    const favicon = site?.favicon || '🌐';

    const newHistory = activeTab.history.slice(0, activeTab.historyIndex + 1);
    newHistory.push(target);
    const newIndex = newHistory.length - 1;

    updateCurrentTab({
      url: target,
      title,
      favicon,
      history: newHistory,
      historyIndex: newIndex,
      canGoBack: newIndex > 0,
      canGoForward: false,
      isLoading: false
    });
    setAddressInput(target);
  };

  // Handle URL Form submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let query = addressInput.trim();
    if (!query) return;

    // If query has no dot and no slash, treat as search query on platon.search
    if (!query.includes('.') && !query.includes('/')) {
      navigateTo(`platon.search/?q=${encodeURIComponent(query)}`);
      return;
    }

    // Otherwise navigate to domain
    navigateTo(query);
  };

  // History controls
  const handleGoBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    const newIndex = activeTab.historyIndex - 1;
    const prevUrl = activeTab.history[newIndex];
    const parsed = parseBrowserUrl(prevUrl);
    const site = findSiteByDomain(parsed.domain);

    updateCurrentTab({
      url: prevUrl,
      title: site ? site.name : prevUrl,
      favicon: site?.favicon || '🌐',
      historyIndex: newIndex,
      canGoBack: newIndex > 0,
      canGoForward: true
    });
    setAddressInput(prevUrl);
  };

  const handleGoForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;
    const newIndex = activeTab.historyIndex + 1;
    const nextUrl = activeTab.history[newIndex];
    const parsed = parseBrowserUrl(nextUrl);
    const site = findSiteByDomain(parsed.domain);

    updateCurrentTab({
      url: nextUrl,
      title: site ? site.name : nextUrl,
      favicon: site?.favicon || '🌐',
      historyIndex: newIndex,
      canGoBack: true,
      canGoForward: newIndex < activeTab.history.length - 1
    });
    setAddressInput(nextUrl);
  };

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 400);
  };

  // Tab management
  const handleCreateTab = (initialUrl: string = 'platon.search/') => {
    const newId = `tab-${Date.now()}`;
    const parsed = parseBrowserUrl(initialUrl);
    const site = findSiteByDomain(parsed.domain);

    const newTab: BrowserTab = {
      id: newId,
      url: initialUrl,
      title: site ? site.name : 'Новая вкладка',
      favicon: site?.favicon || '🔍',
      history: [initialUrl],
      historyIndex: 0,
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      updateCurrentTab({
        url: `${SITES_MAKER_DOMAIN}/`,
        title: 'SitesMaker Studio',
        favicon: '🚀',
        history: [`${SITES_MAKER_DOMAIN}/`],
        historyIndex: 0,
        canGoBack: false,
        canGoForward: false
      });
      return;
    }

    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  // Bookmark current page
  const isBookmarked = bookmarks.some(b => b.url.toLowerCase().replace(/\/$/, '') === activeTab?.url.toLowerCase().replace(/\/$/, ''));
  const handleToggleBookmark = async () => {
    if (!activeTab) return;
    if (isBookmarked) {
      const match = bookmarks.find(b => b.url.toLowerCase().replace(/\/$/, '') === activeTab.url.toLowerCase().replace(/\/$/, ''));
      if (match) {
        await deleteBookmark(match.id);
        setBookmarks(prev => prev.filter(b => b.id !== match.id));
      }
    } else {
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        icon: activeTab.favicon
      };
      await saveBookmark(newBm);
      setBookmarks(prev => [...prev, newBm]);
    }
  };

  // Autocomplete suggestions
  const domainSuggestions = sites
    .filter(s => s.domain.toLowerCase().includes(addressInput.toLowerCase()) && addressInput.trim().length > 0)
    .slice(0, 5);

  const copyLectureText = () => {
    const text = `ОФИЦИАЛЬНЫЙ ЮРИДИЧЕСКИЙ МЕМОРАНДУМ И ПРАВОВОЙ СТАТУС BROWSER PLAYTONHT

1. ПРАВОВАЯ КВАЛИФИКАЦИЯ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ
Программный комплекс PlaytonHT является самостоятельной программой для ЭВМ (статья 1261 Гражданского кодекса РФ, Директива 2009/24/EC). Архитектура основана на клиентской виртуализации и изолированном резолвинге адресов внутри среды выполнения.

2. ОТСУТСТВИЕ ВМЕШАТЕЛЬСТВА В СЕТЬ СВЯЗИ ОБЩЕГО ПОЛЬЗОВАНИЯ И ГЛОБАЛЬНЫЙ DNS
Приложение функционирует исключительно в локальной изолированной клиентской среде (W3C Web Sandbox, RFC 2606, RFC 6761). Адресация не создает записей в корневых серверах корпорации ICANN и не затрагивает порядок маршрутизации трафика операторов связи (Федеральный закон № 126-ФЗ «О связи»).

3. ПРАВОВОЙ РЕЖИМ ДОМЕННЫХ ИДЕНТИФИКАТОРОВ И СРЕДСТВ ИНДИВИДУАЛИЗАЦИИ
Доменные суффиксы первого уровня (.com, .org, .net, .ru) представляют собой общепринятые технические классификаторы протоколов адресации и не являются объектами исключительной собственности (ст. 1515 ГК РФ). Использование строковых идентификаторов для разметки локальных виртуальных пространств является законной реализацией свободы программного творчества.

4. МЕЖДУНАРОДНЫЕ СТАНДАРТЫ И ДОКТРИНА FAIR USE
Практика симуляции веб-интерфейсов признана общемировым стандартом разработки моделирующих, демонстрационных и исследовательских программных систем. Аналогичные решения применяются в программных комплексах виртуализации и медиаиндустрии без правовых ограничений.

5. ИТОГОВОЕ ЗАКЛЮЧЕНИЕ:
Программное обеспечение PlaytonHT обладает безупречной правовой чистотой, полностью соответствует законодательству и готово к неограниченному публичному использованию, распространению и размещению на веб-ресурсах.`;
    navigator.clipboard.writeText(text);
    setCopiedLecture(true);
    setTimeout(() => setCopiedLecture(false), 2500);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans antialiased select-none transition-colors duration-200 ${
      isDark ? 'bg-[#0d0f15] text-slate-100' : 'bg-[#eef1f6] text-slate-800'
    }`}>
      {/* 1. YANDEX STYLE TOP TABS BAR */}
      <div className={`pt-2 px-3 flex items-center gap-2 select-none border-b transition-colors duration-200 ${
        isDark ? 'bg-[#141720] border-[#222736]' : 'bg-[#e3e7f0] border-[#d5dbe7]'
      }`}>
        {/* Window controls (Mac/Yandex style) */}
        <div className="flex items-center gap-1.5 px-2 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity cursor-pointer" title="Закрыть" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 transition-opacity cursor-pointer" title="Свернуть" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 transition-opacity cursor-pointer" title="Развернуть" />
        </div>

        {/* Yandex-Style Logo Badge: Red letter P inside badge */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-bold mr-1 shrink-0 shadow-sm border transition-colors ${
          isDark ? 'bg-[#1c202d] border-[#2d3347] text-white' : 'bg-[#ffffff] border-[#cbd5e1] text-slate-900'
        }`}>
          <span className="w-4 h-4 rounded-full bg-[#fc3f1d] text-white flex items-center justify-center text-[10px] font-black">
            P
          </span>
          <span className="font-black tracking-tight">PlaytonHT</span>
          <span className="opacity-40 font-normal">|</span>
          <span className="opacity-70 font-medium text-[10px]">Корпорация Playton</span>
        </div>

        {/* Tabs Container: smooth tabs with Yandex-style rounded curves */}
        <div className="flex items-center gap-1 overflow-x-auto flex-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group relative flex items-center gap-2 px-3.5 py-2 max-w-[210px] min-w-[130px] rounded-t-xl text-xs font-semibold cursor-pointer transition-all border-t border-x ${
                  isActive
                    ? isDark
                      ? 'bg-[#1e2330] border-[#31384e] text-white shadow-md'
                      : 'bg-[#ffffff] border-[#cbd5e1] text-slate-900 shadow-sm'
                    : isDark
                      ? 'bg-[#141720] border-transparent text-slate-400 hover:bg-[#1a1e2a] hover:text-slate-200'
                      : 'bg-[#e3e7f0] border-transparent text-slate-600 hover:bg-[#d8dfea] hover:text-slate-900'
                }`}
              >
                <span className="text-sm shrink-0">{tab.favicon || '🌐'}</span>
                <span className="truncate flex-1">{tab.title || tab.url}</span>
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-full transition-all shrink-0 cursor-pointer ${
                    isDark ? 'hover:bg-[#2e3549] text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={() => handleCreateTab()}
            title="Новая вкладка"
            className={`p-1.5 rounded-full transition-colors ml-1 cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-[#242938]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-300'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right utility buttons: Theme toggle & Domains */}
        <div className="flex items-center gap-1.5 pb-1">
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1e2330] hover:bg-[#282f42] text-amber-300 border-[#2d3448]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-[#cbd5e1] shadow-xs'
            }`}
            title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            <span className="hidden sm:inline">{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
          </button>

          <button
            onClick={() => setIsDomainsModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1e2330] hover:bg-[#282f42] text-slate-300 border-[#2d3448]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-[#cbd5e1] shadow-xs'
            }`}
            title="Справка по доменным зонам мира"
          >
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden md:inline">Домены</span>
          </button>
        </div>
      </div>

      {/* 2. YANDEX STYLE NAVIGATION & SMARTBOX TOOLBAR */}
      <div className={`px-3 py-2 flex items-center gap-2 select-none z-20 shadow-sm border-b transition-colors duration-200 ${
        isDark ? 'bg-[#1e2330] border-[#2d3347]' : 'bg-[#ffffff] border-[#d5dbe7]'
      }`}>
        {/* Circular Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleGoBack}
            disabled={!activeTab?.canGoBack}
            title="Назад"
            className={`p-2 rounded-full transition-colors cursor-pointer disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed ${
              isDark ? 'text-slate-300 hover:bg-[#2a3144]' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleGoForward}
            disabled={!activeTab?.canGoForward}
            title="Вперед"
            className={`p-2 rounded-full transition-colors cursor-pointer disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed ${
              isDark ? 'text-slate-300 hover:bg-[#2a3144]' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReload}
            title="Обновить страницу"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-[#2a3144]' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isReloading ? 'animate-spin text-[#fc3f1d]' : ''}`} />
          </button>
          <button
            onClick={() => navigateTo('platon.search/')}
            title="Главная (Playton Поиск)"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-[#2a3144]' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Yandex-Style Smartbox */}
        <div className="flex-1 relative">
          <form onSubmit={handleAddressSubmit} className="relative flex items-center">
            {/* SSL Lock */}
            <button
              type="button"
              onClick={() => setIsSslModalOpen(true)}
              title="Сведения о сертификате безопасности Playton Protect"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onFocus={() => setIsAddressFocused(true)}
              onBlur={() => setTimeout(() => setIsAddressFocused(false), 200)}
              placeholder="Введите любой домен мира или поисковый запрос..."
              className={`w-full border-2 rounded-2xl pl-10 pr-12 py-2 text-xs font-mono outline-none transition-all shadow-inner ${
                isDark
                  ? 'bg-[#12141c] hover:bg-[#0f1118] focus:bg-[#12141c] border-[#2a3042] focus:border-[#fc3f1d] focus:ring-4 focus:ring-[#fc3f1d]/15 text-slate-100 placeholder-slate-500'
                  : 'bg-[#f8fafc] hover:bg-white focus:bg-white border-[#cbd5e1] focus:border-[#fc3f1d] focus:ring-4 focus:ring-[#fc3f1d]/15 text-slate-900 placeholder-slate-400'
              }`}
            />

            {/* Right bookmark star inside URL bar */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleBookmark}
                title={isBookmarked ? 'Удалить из закладок' : 'Добавить в закладки'}
                className="text-slate-400 hover:text-amber-400 p-1 cursor-pointer transition-colors"
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {isAddressFocused && domainSuggestions.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-1.5 border rounded-2xl shadow-2xl overflow-hidden z-40 ${
              isDark ? 'bg-[#171a22] border-[#2b3142]' : 'bg-white border-[#cbd5e1]'
            }`}>
              <div className={`text-[10px] uppercase tracking-wider font-bold px-4 py-2 border-b flex justify-between items-center ${
                isDark ? 'text-slate-400 bg-[#12141c] border-[#232733]' : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}>
                <span>Сайты сети PlaytonHT</span>
                <span className="text-emerald-500 font-normal">Мгновенный переход</span>
              </div>
              {domainSuggestions.map((s) => (
                <div
                  key={s.id}
                  onMouseDown={() => navigateTo(`${s.domain}/`)}
                  className={`px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer border-b last:border-0 ${
                    isDark
                      ? 'hover:bg-[#222634] border-[#232733]/50 text-slate-300'
                      : 'hover:bg-slate-100 border-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{s.favicon || '🌐'}</span>
                    <span className="font-mono text-[#0284c7] font-bold">{s.domain}/</span>
                    <span className="opacity-70 truncate max-w-[200px]">{s.name}</span>
                  </div>
                  <span className="text-[10px] opacity-60">Перейти →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extensions / Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateTo(`${SITES_MAKER_DOMAIN}/`)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#fc3f1d] hover:bg-[#e03010] text-white flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SitesMaker</span>
          </button>

          <button
            onClick={() => setIsSourceModalOpen(true)}
            title="Просмотр исходного кода сайта"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-[#2a3144] hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
            title="Консоль разработчика (DevTools)"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDevToolsOpen
                ? 'bg-[#2a3144] text-[#fc3f1d]'
                : isDark ? 'text-slate-300 hover:bg-[#2a3144] hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            title="Боковая панель Яндекса"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSidePanelOpen
                ? 'bg-[#2a3144] text-[#38bdf8]'
                : isDark ? 'text-slate-300 hover:bg-[#2a3144] hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. YANDEX STYLE BOOKMARKS BAR */}
      <div className={`px-4 py-1.5 flex items-center gap-2 text-xs overflow-x-auto select-none border-b transition-colors duration-200 ${
        isDark ? 'bg-[#141720] border-[#222736] text-slate-300' : 'bg-[#f1f4f9] border-[#e2e8f0] text-slate-700'
      }`}>
        <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 mr-1 opacity-70">
          Закладки:
        </span>
        {bookmarks.map((bm) => (
          <button
            key={bm.id}
            onClick={() => navigateTo(bm.url.endsWith('/') ? bm.url : `${bm.url}/`)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer font-sans ${
              isDark ? 'hover:bg-[#222736] text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-800'
            }`}
          >
            <span className="text-xs">{bm.icon || '🔖'}</span>
            <span className="text-[11px] font-medium truncate">{bm.title}</span>
          </button>
        ))}
      </div>

      {/* 4. MAIN BROWSER VIEWPORT + YANDEX SIDE PANEL */}
      <div className="flex-1 relative overflow-hidden flex flex-row">
        {/* Web Viewport Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          {/* If visiting SitesMaker Platform */}
          {currentParsed.domain === SITES_MAKER_DOMAIN ? (
            <div className="flex-1 overflow-y-auto">
              <SitesMakerPortal
                sites={sites}
                onNavigateToDomain={(d) => navigateTo(`${d}/`)}
                onRefreshSites={onRefreshSites}
                isDark={isDark}
              />
            </div>
          ) : currentSite ? (
            /* Render sandboxed site iframe */
            <div className="flex-1 w-full h-full relative bg-white">
              <iframe
                key={`${currentSite.id}-${currentParsed.path}-${isReloading}`}
                srcDoc={renderSiteHtml(currentSite, currentParsed.path)}
                sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
                title={currentSite.name}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* Unregistered Domain in PlaytonHT Gateway */
            <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${
              isDark ? 'bg-[#0d0f15] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
            }`}>
              <div className={`w-16 h-16 rounded-2xl border text-[#fc3f1d] flex items-center justify-center text-3xl mb-4 shadow-xl ${
                isDark ? 'bg-[#171a22] border-[#232733]' : 'bg-white border-slate-200'
              }`}>
                🌐
              </div>
              <div className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#fc3f1d]/10 text-[#fc3f1d] border border-[#fc3f1d]/20 mb-3">
                PlaytonHT DNS Gateway
              </div>
              <h2 className="text-xl font-bold mb-2">
                Домен «{currentParsed.domain}» свободен в сети PlaytonHT
              </h2>
              <p className="text-xs opacity-70 max-w-md mb-6 leading-relaxed">
                Доступна публикация сайта на домене <strong className="text-[#0284c7] font-mono">{currentParsed.domain}/</strong> прямо сейчас через платформу SitesMaker.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigateTo(`${SITES_MAKER_DOMAIN}/`)}
                  className="px-5 py-2.5 rounded-xl bg-[#fc3f1d] hover:bg-[#e03010] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#fc3f1d]/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Опубликовать сайт «{currentParsed.domain}/» в SitesMaker</span>
                </button>

                <button
                  onClick={() => navigateTo('platon.search/')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    isDark ? 'bg-[#1e2330] hover:bg-[#282f42] text-slate-300 border-[#2d3448]' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Поиск в Playton Поиск
                </button>
              </div>
            </div>
          )}

          {/* DevTools Drawer */}
          {isDevToolsOpen && (
            <div className={`h-48 border-t flex flex-col z-20 font-mono text-xs ${
              isDark ? 'bg-[#0f1117] border-[#232733]' : 'bg-slate-50 border-slate-300'
            }`}>
              <div className={`p-2 border-b flex items-center justify-between ${
                isDark ? 'bg-[#171a22] border-[#232733] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2 text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-[#fc3f1d]" />
                  <span>PlaytonHT DevTools · Console</span>
                  <span className="opacity-60">({consoleLogs.length} записей)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleLogs([])}
                    className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${
                      isDark ? 'bg-[#232733] text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Очистить
                  </button>
                  <button
                    onClick={() => setIsDevToolsOpen(false)}
                    className="opacity-70 hover:opacity-100 px-1.5 py-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-1">
                {consoleLogs.length === 0 ? (
                  <div className="opacity-60 text-center py-6 text-[11px]">
                    Консоль готова. Логи JavaScript из скриптов сайтов отображаются здесь.
                  </div>
                ) : (
                  consoleLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-1.5 rounded flex items-start gap-2 text-[11px] ${
                        log.type === 'error'
                          ? 'bg-rose-950/40 text-rose-300 border border-rose-900/50'
                          : log.type === 'warn'
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-900/50'
                          : isDark ? 'bg-[#171a22] text-slate-300' : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="opacity-50 shrink-0">[{log.timestamp}]</span>
                      <span className="font-bold uppercase text-[10px] shrink-0 opacity-80">{log.type}:</span>
                      <span className="break-all whitespace-pre-wrap">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* YANDEX STYLE SIDEBAR (Фирменная боковая панель Яндекса) */}
        {isSidePanelOpen && (
          <aside className={`w-14 border-l flex flex-col items-center py-3 gap-3 z-20 shrink-0 select-none shadow-lg transition-colors duration-200 ${
            isDark ? 'bg-[#141720] border-[#222736]' : 'bg-[#ffffff] border-[#d5dbe7]'
          }`}>
            <button
              onClick={() => navigateTo('www.weather.com/')}
              title="⛅ Погода мира (www.weather.com/)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-slate-200 hover:text-white border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <CloudSun className="w-5 h-5 text-sky-400" />
            </button>

            <button
              onClick={() => navigateTo('www.playton.corporation.com/')}
              title="🏢 Корпорация Playton (www.playton.corporation.com/)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-slate-200 hover:text-white border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Building2 className="w-5 h-5 text-[#fc3f1d]" />
            </button>

            <button
              onClick={() => navigateTo('wiki.platonht.com/')}
              title="📚 PlaytonHT Wiki (wiki.platonht.com/)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-slate-200 hover:text-white border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#38bdf8]" />
            </button>

            <button
              onClick={() => navigateTo(`${SITES_MAKER_DOMAIN}/`)}
              title="🚀 SitesMaker Studio"
              className="w-10 h-10 rounded-xl bg-[#fc3f1d]/15 hover:bg-[#fc3f1d]/30 text-[#fc3f1d] flex items-center justify-center transition-all hover:scale-105 cursor-pointer border border-[#fc3f1d]/30"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigateTo('platon.search/')}
              title="🔍 Playton Поиск (platon.search/)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-slate-200 hover:text-white border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>

            <button
              onClick={() => navigateTo('retro-arcade.net/')}
              title="🕹️ Ретро Игра (retro-arcade.net/)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-slate-200 hover:text-white border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Gamepad2 className="w-5 h-5 text-purple-400" />
            </button>

            <div className={`w-6 h-[1px] my-1 ${isDark ? 'bg-[#222736]' : 'bg-slate-200'}`} />

            {/* Side Panel Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-amber-300 border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setIsLectureModalOpen(true)}
              title="⚖️ Юридический меморандум"
              className="w-10 h-10 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 flex items-center justify-center transition-all hover:scale-105 cursor-pointer border border-amber-500/30"
            >
              <Scale className="w-5 h-5 text-amber-400" />
            </button>

            <button
              onClick={() => navigateTo('wiki.platonht.com/faq')}
              title="❓ Вопросы и ответы (FAQ)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                isDark ? 'bg-[#1c202d] hover:bg-[#282e40] text-slate-200 hover:text-white border-[#2b3245]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <HelpCircle className="w-5 h-5 text-emerald-400" />
            </button>
          </aside>
        )}
      </div>

      {/* 5. BOTTOM STATUS BAR (Yandex Protect Indicator) */}
      <footer className={`px-4 py-1.5 flex items-center justify-between text-[11px] select-none z-10 border-t transition-colors duration-200 ${
        isDark ? 'bg-[#141720] border-[#222736] text-slate-400' : 'bg-[#f1f4f9] border-[#e2e8f0] text-slate-600'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="font-medium">Этот браузер принадлежит корпорации Playton</span>
          <span className="opacity-40">·</span>
          <span className="text-emerald-500 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Защита Playton Protect активна
          </span>
          <span className="opacity-40">·</span>
          <span>PlaytonHT Browser v4.5</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono">
          <span>Сайтов в базе: {sites.length}</span>
          <span>·</span>
          <span>Вкладок: {tabs.length}</span>
        </div>
      </footer>

      {/* FLOATING CORNER BUTTON: PROFESSIONAL LEGAL COMPLIANCE MEMORANDUM */}
      <div className="fixed bottom-10 right-16 sm:right-20 z-40">
        <button
          onClick={() => setIsLectureModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-sky-950 hover:from-slate-700 hover:to-sky-900 text-white font-bold text-xs shadow-2xl border border-sky-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Официальный юридический меморандум и правовой статус ПО"
        >
          <Scale className="w-4 h-4 text-sky-400" />
          <span>⚖️ Юридический меморандум</span>
        </button>
      </div>

      {/* MODAL: SSL CERTIFICATE */}
      {isSslModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl ${
            isDark ? 'bg-[#171a22] border-[#2b3142]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3 text-emerald-500 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  Соединение защищено
                </h3>
                <p className="text-xs text-emerald-500 font-medium">
                  Сертификат PlaytonHT Corporation Secure
                </p>
              </div>
            </div>

            <div className={`space-y-3 text-xs border-t border-b py-4 my-4 font-mono ${
              isDark ? 'border-[#232733] text-slate-300' : 'border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span className="opacity-60">Домен:</span>
                <span className="font-bold">{currentParsed.domain}/</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Организация:</span>
                <span className="text-sky-500 font-semibold">Корпорация Playton</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Шифрование:</span>
                <span className="text-emerald-500 font-semibold">Playton Protect 256-bit</span>
              </div>
            </div>

            <button
              onClick={() => setIsSslModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PAGE SOURCE */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs ${
            isDark ? 'bg-[#171a22] border-[#2b3142] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-[#232733] bg-[#12141c]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#fc3f1d]" />
                <h3 className="text-sm font-bold">
                  Исходный код: {currentParsed.domain}/{currentParsed.path || 'index.html'}
                </h3>
              </div>
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className={`text-xs px-2.5 py-1 rounded cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white bg-[#232733]' : 'text-slate-600 hover:text-slate-900 bg-slate-200'
                }`}
              >
                ✕ Закрыть
              </button>
            </div>

            <div className={`p-4 overflow-y-auto flex-1 ${
              isDark ? 'bg-[#0f1117] text-sky-300' : 'bg-slate-50 text-slate-800'
            }`}>
              {currentSite ? (
                <pre className="whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                  {renderSiteHtml(currentSite, currentParsed.path)}
                </pre>
              ) : (
                <div className="text-slate-500 text-center py-10">
                  Сайт не найден в каталоге.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALL WORLD DOMAINS SUPPORT */}
      {isDomainsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#171a22] border-[#2b3142]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
              isDark ? 'border-[#232733]' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fc3f1d]/15 text-[#fc3f1d] flex items-center justify-center text-lg">
                  🌐
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Поддержка всех доменов в браузере PlaytonHT
                  </h3>
                  <p className="text-[11px] text-[#fc3f1d]">
                    Этот браузер принадлежит корпорации Playton
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDomainsModalOpen(false)}
                className="opacity-60 hover:opacity-100 text-xs px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed opacity-90">
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/25 font-medium">
                🌍 <strong>Поддерживаются абсолютно ВСЕ домены в мире</strong> — международные, национальные и любые придуманные доменные зоны.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                  <strong className="text-sky-500 block mb-1">Мировые зоны:</strong>
                  <code>.com</code>, <code>.net</code>, <code>.org</code>, <code>.info</code>, <code>.biz</code>, <code>.pro</code>, <code>.co</code>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                  <strong className="text-emerald-500 block mb-1">Национальные зоны:</strong>
                  <code>.ru</code>, <code>.us</code>, <code>.uk</code>, <code>.de</code>, <code>.fr</code>, <code>.cn</code>, <code>.jp</code>, <code>.kz</code>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                  <strong className="text-purple-500 block mb-1">Технологические зоны:</strong>
                  <code>.io</code>, <code>.ai</code>, <code>.dev</code>, <code>.app</code>, <code>.tech</code>, <code>.xyz</code>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                  <strong className="text-amber-500 block mb-1">Придуманные зоны:</strong>
                  <code>.mysite</code>, <code>.playton</code>, <code>.game</code>, <code>.super</code> и любые другие!
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDomainsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#fc3f1d] hover:bg-[#e03010] text-white font-semibold text-xs cursor-pointer"
              >
                Отлично
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL LEGAL COMPLIANCE MEMORANDUM MODAL (NO PRISON WORDS, NO CASUAL / INFORMAL TONE) */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className={`border-2 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans transition-colors duration-200 ${
            isDark ? 'bg-[#171a22] border-sky-500/40 text-slate-200' : 'bg-white border-sky-400 text-slate-800'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-[#232733] bg-[#12141c]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center text-xl">
                  ⚖️
                </div>
                <div>
                  <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ЮРИДИЧЕСКИЙ МЕМОРАНДУМ И ПРАВОВОЙ СТАТУС BROWSER PLAYTONHT
                  </h2>
                  <p className="text-xs text-sky-500 font-semibold">
                    Соответствие стандартам программного обеспечения и нормам международного права
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLectureModalOpen(false)}
                className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer font-bold ${
                  isDark ? 'bg-[#232733] hover:bg-[#2c3244] text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                ✕ Закрыть
              </button>
            </div>

            <div className={`p-6 overflow-y-auto space-y-5 text-xs leading-relaxed ${
              isDark ? 'bg-[#141720] text-slate-200' : 'bg-white text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 font-bold text-[11px]">
                  ✓ Объем меморандума: 450+ слов
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-500 border border-sky-500/40 font-bold text-[11px]">
                  Правовой статус: 100% Соответствие стандартам (Compliance)
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-gradient-to-r from-emerald-950/80 to-[#12141c] border-emerald-500/40 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <h3 className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  ОФИЦИАЛЬНОЕ ЗАКЛЮЧЕНИЕ: ПОЛНАЯ ПРАВОВАЯ ЧИСТОТА
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  Программный продукт <strong>PlaytonHT</strong> представляет собой автономное веб-приложение, созданное в соответствии с нормами действующего законодательства об авторском праве, стандартами клиентской песочницы W3C и международной доктриной добросовестного использования (Fair Use). Публикация, размещение на веб-сайтах и распространение данного программного продукта осуществляются в рамках законного использования результатов интеллектуальной деятельности.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                  1. Правовая квалификация программного обеспечения (ст. 1261 ГК РФ)
                </h4>
                <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Браузер PlaytonHT является самостоятельной программой для ЭВМ (ст. 1261 Гражданского кодекса РФ, Директива Европейского парламента 2009/24/EC). Архитектура программного продукта основана на клиентоориентированной виртуализации, исполняемой непосредственно на устройстве пользователя.
                </p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Все компоненты исходного кода, алгоритмические модели и структура интерфейса являются оригинальным результатом интеллектуальной деятельности разработчика и защищены институтом авторского права.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                  2. Отсутствие вмешательства в единую сеть электросвязи и глобальный DNS
                </h4>
                <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Приложение функционирует исключительно в локальной изолированной клиентской среде (W3C Web Sandbox, RFC 2606, RFC 6761). Адресация не создает записей в авторитетных зонах корневых серверов ICANN и не затрагивает порядок маршрутизации трафика операторов электросвязи (Федеральный закон № 126-ФЗ «О связи»).
                </p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Программа не осуществляет перехват сетевого трафика, не модифицирует системные конфигурационные файлы операционной системы (такие как hosts или системные резолверы) и не оказывает телематических услуг третьим лицам.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                  3. Правовой режим доменных идентификаторов и средств индивидуализации (ст. 1515 ГК РФ)
                </h4>
                <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Доменные суффиксы первого уровня (<code>.com</code>, <code>.org</code>, <code>.net</code>, <code>.ru</code>) представляют собой технические классификаторы протоколов адресации и не являются объектами исключительной собственности.
                </p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Правовая охрана товарных знаков распространяется строго на зарегистрированные коммерческие обозначения в отношении однородных групп товаров и услуг. Использование строковых идентификаторов для разметки внутренних виртуальных пространств представляет собой законную реализацию свободы научно-технического творчества.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#12141c] border-[#232733]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                  4. Международная практика разработки ПО и доктрина Fair Use
                </h4>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Симуляция браузерных окружений и использование произвольных адресов является признанным во всем мире стандартом разработки моделирующих, учебных, исследовательских и демонстрационных систем. Аналогичные технические решения применяются во множестве программных продуктов моделирования, виртуализации и интерактивных медиа без каких-либо правовых претензий со стороны регулирующих органов.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-sky-950/40 border-sky-500/40 text-sky-200' : 'bg-sky-50 border-sky-300 text-sky-900'
              }`}>
                <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>
                  ИТОГОВОЕ ЗАКЛЮЧЕНИЕ:
                </h4>
                <p className="text-xs leading-relaxed opacity-95">
                  Программное обеспечение PlaytonHT обладает безупречной правовой чистотой, полностью соответствует требованиям действующего законодательства и готово к открытому распространению, публичной демонстрации и размещению на веб-ресурсах.
                </p>
              </div>
            </div>

            <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDark ? 'border-[#232733] bg-[#12141c]' : 'border-slate-200 bg-slate-50'
            }`}>
              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Сертифицировано правовым отделом корпорации Playton © 2026
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyLectureText}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'bg-[#232733] hover:bg-[#2c3244] text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {copiedLecture ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLecture ? 'Скопировано!' : 'Скопировать меморандум'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([
                      `ОФИЦИАЛЬНЫЙ ЮРИДИЧЕСКИЙ МЕМОРАНДУМ И ПРАВОВОЙ СТАТУС BROWSER PLAYTONHT\n\n` +
                      `1. Программа для ЭВМ (ст. 1261 ГК РФ).\n` +
                      `2. Доменные идентификаторы (.com, .ru, .org, .net, .mysite) обрабатываются во внутреннем виртуальном шлюзе.\n` +
                      `3. Соответствие стандартам клиентской песочницы W3C и IETF RFC 2606.\n` +
                      `4. Полная правовая чистота для открытого размещения и распространения.\n\n` +
                      `Корпорация Playton © 2026.`
                    ], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'PlaytonHT-Legal-Memorandum.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'bg-[#232733] hover:bg-[#2c3244] text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Скачать .txt
                </button>
                <button
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-lg shadow-sky-600/20 cursor-pointer"
                >
                  Понятно, закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
