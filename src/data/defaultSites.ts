import { PublishedSite, Bookmark } from '../types/browser';

export const SITES_MAKER_DOMAIN = 'www.sitesmaker.playtonlab.com';

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-maker',
    title: 'SitesMaker Studio',
    url: 'www.sitesmaker.playtonlab.com/',
    icon: 'Hammer'
  },
  {
    id: 'bm-corp',
    title: 'Корпорация Playton',
    url: 'www.playton.corporation.com/',
    icon: 'Building2'
  },
  {
    id: 'bm-weather',
    title: 'Погода мира',
    url: 'www.weather.com/',
    icon: 'CloudSun'
  },
  {
    id: 'bm-wiki',
    title: 'PlaytonHT Wiki',
    url: 'wiki.platonht.com/',
    icon: 'BookOpen'
  },
  {
    id: 'bm-search',
    title: 'Playton Поиск',
    url: 'platon.search/',
    icon: 'Search'
  },
  {
    id: 'bm-arcade',
    title: 'Ретро Аркада',
    url: 'retro-arcade.net/',
    icon: 'Gamepad2'
  }
];

export const DEFAULT_SITES: PublishedSite[] = [
  {
    id: 'system-sites-maker',
    name: 'Playton SitesMaker Platform',
    domain: 'www.sitesmaker.playtonlab.com',
    entryPoint: 'index.html',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() + 200000,
    isSystem: true,
    description: 'Официальная платформа публикации веб-сайтов корпорации Playton',
    favicon: '🚀',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 240,
        content: `<!-- System App: SitesMaker -->`
      }
    }
  },
  {
    id: 'site-platon-search',
    name: 'Playton Поиск',
    domain: 'platon.search',
    entryPoint: 'index.html',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() + 200000,
    isSystem: true,
    description: 'Главная поисковая система сети Playton Network в стиле Yandex',
    favicon: '🔍',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 5800,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Playton Поиск — Найдётся всё</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0f1015;
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      margin: 0;
    }
    
    /* Top Header Bar */
    header {
      width: 100%;
      padding: 18px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #94a3b8;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #10b981;
      font-weight: 600;
      font-size: 12px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }
    .top-nav {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .top-nav a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.15s;
      font-size: 13px;
    }
    .top-nav a:hover { color: #fff; }
    .user-pill {
      background: #1c202d;
      border: 1px solid #2b3346;
      padding: 6px 14px;
      border-radius: 20px;
      color: #e2e8f0;
      font-weight: 600;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .user-pill:hover {
      background: #23293a;
      border-color: #3b455e;
    }

    /* Main Search Container */
    .main-wrap {
      max-width: 760px;
      width: 100%;
      margin: 50px auto auto;
      padding: 0 20px;
      text-align: center;
    }

    /* Iconic Yandex-Style Logo */
    .logo-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
      user-select: none;
    }
    .logo-p-circle {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #fc3f1d;
      color: #ffffff;
      font-size: 38px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(252, 63, 29, 0.4);
    }
    .logo-text {
      font-size: 52px;
      font-weight: 800;
      letter-spacing: -1.5px;
      color: #ffffff;
    }
    .logo-subtitle {
      font-size: 14px;
      color: #64748b;
      margin-top: -16px;
      margin-bottom: 28px;
      font-weight: 500;
    }

    /* Yandex Signature Search Input (Smartbox) */
    .search-form {
      position: relative;
      width: 100%;
      margin-bottom: 20px;
    }
    .search-inner {
      position: relative;
      display: flex;
      align-items: center;
      background: #181b24;
      border: 2px solid #2a3142;
      border-radius: 32px;
      box-shadow: 0 10px 35px rgba(0,0,0,0.4);
      transition: all 0.2s ease;
      padding: 5px 6px 5px 20px;
    }
    .search-inner:focus-within {
      border-color: #ffcc00;
      box-shadow: 0 12px 40px rgba(255, 204, 0, 0.15);
      background: #1b1e2a;
    }
    .search-icon {
      font-size: 18px;
      opacity: 0.5;
      margin-right: 12px;
    }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 16px;
      padding: 10px 0;
      font-family: inherit;
    }
    .search-input::placeholder {
      color: #64748b;
    }
    /* Iconic Yandex Yellow 'Найти' button */
    .search-btn {
      background: #ffcc00;
      color: #000;
      border: none;
      outline: none;
      font-weight: 800;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(255, 204, 0, 0.25);
    }
    .search-btn:hover {
      background: #ffd633;
      transform: translateY(-1px);
    }
    .search-btn:active {
      transform: translateY(1px);
    }

    /* Service Shortcuts under search */
    .service-chips {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
    .chip {
      background: #151821;
      border: 1px solid #232838;
      color: #cbd5e1;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .chip:hover {
      background: #1e2330;
      border-color: #fc3f1d;
      color: #fff;
      transform: translateY(-1px);
    }

    /* Yandex Tablo (Табло) */
    .tablo-section {
      text-align: left;
      margin-bottom: 40px;
    }
    .tablo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      padding: 0 4px;
    }
    .tablo-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
    }
    .tablo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
    }
    .tablo-card {
      background: #151821;
      border: 1px solid #222636;
      border-radius: 16px;
      padding: 16px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.15s ease;
    }
    .tablo-card:hover {
      transform: translateY(-2px);
      border-color: #fc3f1d;
      background: #1a1e2a;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
    .tile-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #1f2433;
      border: 1px solid #2d3448;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .tile-name {
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
    }
    .tile-sub {
      font-size: 11px;
      font-family: monospace;
      color: #38bdf8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Results */
    .results-container {
      display: none;
      text-align: left;
      margin-top: 20px;
      background: #151821;
      border: 1px solid #222636;
      border-radius: 16px;
      padding: 20px;
    }
    .res-item {
      padding: 14px 0;
      border-bottom: 1px solid #222636;
    }
    .res-item:last-child { border-bottom: none; }
    .res-item a {
      color: #38bdf8;
      text-decoration: none;
      font-size: 17px;
      font-weight: 700;
    }
    .res-item a:hover { text-decoration: underline; }
    .res-url {
      font-size: 12px;
      color: #10b981;
      font-family: monospace;
      margin-bottom: 4px;
    }
    .res-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }

    /* Footer */
    footer {
      margin-top: auto;
      padding: 30px 20px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Сеть PlaytonHT Онлайн</span>
      </div>
    </div>

    <div class="top-nav">
      <a href="http://www.weather.com/">⛅ Погода мира</a>
      <a href="http://wiki.platonht.com/">📚 Wiki</a>
      <a href="http://www.sitesmaker.playtonlab.com/">🚀 SitesMaker</a>
      <a href="http://www.playton.corporation.com/about">О нас</a>
      <a href="http://www.playton.corporation.com/" class="user-pill">
        <span>Корпорация Playton</span>
      </a>
    </div>
  </header>

  <div class="main-wrap">
    <!-- Iconic Yandex-Style Logo -->
    <div class="logo-container">
      <div class="logo-p-circle">P</div>
      <div class="logo-text">layton</div>
    </div>
    <div class="logo-subtitle">Поисковая система · Найдётся всё в сети PlaytonHT</div>

    <!-- Iconic Yandex Search Bar (Smartbox) -->
    <form class="search-form" onsubmit="event.preventDefault(); handleSearch();">
      <div class="search-inner">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          id="query"
          class="search-input"
          placeholder="Найдётся всё: введите домен или поисковый запрос..."
          autocomplete="off"
        >
        <button type="submit" class="search-btn">Найти</button>
      </div>
    </form>

    <!-- Service Chips -->
    <div class="service-chips">
      <a href="http://www.weather.com/" class="chip">⛅ Погода мира</a>
      <a href="http://www.sitesmaker.playtonlab.com/" class="chip">🚀 SitesMaker</a>
      <a href="http://www.playton.corporation.com/" class="chip">🏢 Корпорация</a>
      <a href="http://wiki.platonht.com/" class="chip">📚 База Знаний (Wiki)</a>
      <a href="http://retro-arcade.net/" class="chip">🕹️ Ретро Игра</a>
      <a href="http://wiki.platonht.com/legal" class="chip">⚖️ Правовой статус</a>
    </div>

    <!-- Yandex Tablo (Табло быстрого доступа) -->
    <div class="tablo-section">
      <div class="tablo-header">
        <span class="tablo-title">Табло быстрого доступа</span>
        <span style="font-size:11px; color:#475569;">Yandex-стиль</span>
      </div>
      <div class="tablo-grid">
        <a href="http://www.weather.com/" class="tablo-card">
          <div class="tile-icon-box">⛅</div>
          <div class="tile-name">Погода мира</div>
          <div class="tile-sub">www.weather.com/</div>
        </a>
        <a href="http://www.sitesmaker.playtonlab.com/" class="tablo-card">
          <div class="tile-icon-box">🚀</div>
          <div class="tile-name">SitesMaker</div>
          <div class="tile-sub">www.sitesmaker.playtonlab.com/</div>
        </a>
        <a href="http://www.playton.corporation.com/" class="tablo-card">
          <div class="tile-icon-box">🏢</div>
          <div class="tile-name">Playton Corp</div>
          <div class="tile-sub">www.playton.corporation.com/</div>
        </a>
        <a href="http://wiki.platonht.com/" class="tablo-card">
          <div class="tile-icon-box">📚</div>
          <div class="tile-name">PlaytonHT Wiki</div>
          <div class="tile-sub">wiki.platonht.com/</div>
        </a>
        <a href="http://retro-arcade.net/" class="tablo-card">
          <div class="tile-icon-box">🕹️</div>
          <div class="tile-name">Ретро Аркада</div>
          <div class="tile-sub">retro-arcade.net/</div>
        </a>
        <a href="http://wiki.platonht.com/legal" class="tablo-card">
          <div class="tile-icon-box">⚖️</div>
          <div class="tile-name">Меморандум</div>
          <div class="tile-sub">wiki.platonht.com/legal</div>
        </a>
      </div>
    </div>

    <div id="results" class="results-container"></div>
  </div>

  <footer>
    © 2026 Корпорация Playton. Этот браузер принадлежит корпорации Playton. Все права защищены.
  </footer>

  <script>
    function handleSearch() {
      const q = document.getElementById('query').value.trim();
      if (!q) return;

      if (q.includes('.') && !q.includes(' ')) {
        const dest = q.startsWith('http') ? q : 'http://' + q;
        window.parent.postMessage({ type: 'PLAYTON_NAVIGATE', url: dest }, '*');
        return;
      }

      const resBox = document.getElementById('results');
      resBox.style.display = 'block';
      resBox.innerHTML = '<h3 style="font-size:16px; margin-bottom:14px; color:#fff;">Результаты поиска по запросу «' + q + '»:</h3>';

      const mock = [
        { title: 'Глобальный прогноз погоды — www.weather.com', url: 'http://www.weather.com/', desc: 'Точный прогноз погоды для любого города мира в реальном времени.' },
        { title: 'Официальный портал корпорации Playton', url: 'http://www.playton.corporation.com/', desc: 'Главный сайт компании Playton. Инновационные браузерные технологии и решения.' },
        { title: 'PlaytonHT Wiki — Полная База Знаний', url: 'http://wiki.platonht.com/', desc: 'Руководство пользователя, иллюстрированное описание всех кнопок браузера и FAQ.' },
        { title: 'SitesMaker Studio — Публикация сайтов из папок', url: 'http://www.sitesmaker.playtonlab.com/', desc: 'Загрузите любую папку сайта и привяжите к любому домену мира мгновенно.' }
      ];

      mock.forEach(r => {
        const div = document.createElement('div');
        div.className = 'res-item';
        div.innerHTML = '<div class="res-url">' + r.url + '</div><a href="' + r.url + '">' + r.title + '</a><div class="res-desc">' + r.desc + '</div>';
        resBox.appendChild(div);
      });
    }
  </script>
</body>
</html>`
      },
      'about.html': {
        path: 'about.html',
        type: 'text/html',
        size: 2100,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>О поиске · Playton Поиск</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 40px 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 26px; margin-bottom: 16px; color: #fc3f1d; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .card { background: #171a22; border: 1px solid #232733; padding: 24px; border-radius: 16px; }
  </style>
</head>
<body>
  <a href="http://platon.search/" class="back">← Назад к поиску</a>
  <div class="card">
    <h1>О поисковой системе Playton Поиск</h1>
    <p>Playton Поиск — встроенная умная поисковая система браузера PlaytonHT, позволяющая находить любые локальные и опубликованные сайты, проверять статус доменов и переходить по веб-адресам.</p>
    <p style="margin-top:12px;">Разработано корпорацией Playton.</p>
  </div>
</body>
</html>`
      },
      'trending.html': {
        path: 'trending.html',
        type: 'text/html',
        size: 2400,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Тренды сети · Playton Поиск</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 40px 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 26px; margin-bottom: 16px; color: #fc3f1d; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .trend-item { background: #171a22; border: 1px solid #232733; padding: 16px; border-radius: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
    .trend-item a { color: #38bdf8; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <a href="http://platon.search/" class="back">← Назад к поиску</a>
  <h1>🔥 Тренды сети PlaytonHT</h1>
  <div class="trend-item">
    <div>
      <a href="http://www.weather.com/">www.weather.com/</a>
      <div style="font-size:12px; color:#94a3b8; margin-top:2px;">Глобальная служба погоды с выбором любого города мира</div>
    </div>
    <span style="color:#10b981; font-weight:bold;">#1 В тренде</span>
  </div>
  <div class="trend-item">
    <div>
      <a href="http://www.playton.corporation.com/">www.playton.corporation.com/</a>
      <div style="font-size:12px; color:#94a3b8; margin-top:2px;">Официальный портал корпорации Playton</div>
    </div>
    <span style="color:#10b981; font-weight:bold;">#2 В тренде</span>
  </div>
  <div class="trend-item">
    <div>
      <a href="http://wiki.platonht.com/">wiki.platonht.com/</a>
      <div style="font-size:12px; color:#94a3b8; margin-top:2px;">База Знаний и атлас кнопок браузера</div>
    </div>
    <span style="color:#10b981; font-weight:bold;">#3 В тренде</span>
  </div>
</body>
</html>`
      }
    }
  },
  {
    id: 'site-weather-global',
    name: 'Playton Weather Global · Погода мира',
    domain: 'www.weather.com',
    entryPoint: 'index.html',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() + 500000,
    isSystem: true,
    description: 'Всемирный метеорологический сервис с прогнозом для абсолютно любого города планеты',
    favicon: '⛅',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 16500,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Погода мира · www.weather.com</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(180deg, #090e1a 0%, #0d1527 50%, #070a12 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: rgba(13, 21, 39, 0.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand {
      font-size: 20px;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      text-decoration: none;
    }
    .brand span { color: #38bdf8; }
    .brand-badge {
      font-size: 10px;
      font-weight: 700;
      background: #0284c7;
      color: #fff;
      padding: 2px 7px;
      border-radius: 6px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
    }
    nav a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.15s;
    }
    nav a:hover, nav a.active { color: #38bdf8; font-weight: 600; }
    
    .container {
      max-width: 1020px;
      width: 100%;
      margin: 28px auto;
      padding: 0 20px;
      flex: 1;
    }
    
    /* City Search Card */
    .search-card {
      background: #131c30;
      border: 1px solid #202e4d;
      border-radius: 20px;
      padding: 22px;
      margin-bottom: 24px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.35);
    }
    .search-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .search-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .unit-switch-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #0b111e;
      padding: 3px;
      border-radius: 10px;
      border: 1px solid #202e4d;
    }
    .unit-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .unit-btn.active {
      background: #0284c7;
      color: #fff;
    }
    .city-input-wrap {
      display: flex;
      gap: 10px;
    }
    .city-input {
      flex: 1;
      background: #0b111e;
      border: 2px solid #202e4d;
      border-radius: 14px;
      padding: 14px 18px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: all 0.2s;
    }
    .city-input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }
    .btn-find {
      background: #0284c7;
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 0 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-find:hover { background: #0369a1; }
    .btn-rand {
      background: #1b263e;
      color: #cbd5e1;
      border: 1px solid #2c3c62;
      border-radius: 14px;
      padding: 0 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-rand:hover {
      background: #233150;
      color: #fff;
    }

    /* Preset City Chips */
    .quick-cities {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 14px;
    }
    .chip {
      background: #18233a;
      border: 1px solid #27375a;
      color: #cbd5e1;
      padding: 5px 12px;
      border-radius: 9px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .chip:hover, .chip.active {
      background: #0284c7;
      border-color: #0284c7;
      color: #fff;
      font-weight: 600;
    }

    /* Main Weather Card */
    .weather-main {
      background: linear-gradient(135deg, #15223c 0%, #0d172a 100%);
      border: 1px solid #273a62;
      border-radius: 24px;
      padding: 32px 36px;
      margin-bottom: 24px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.45);
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 30px;
      align-items: center;
    }
    @media (max-width: 640px) {
      .weather-main { grid-template-columns: 1fr; text-align: center; }
    }
    .city-name {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .country-tag {
      font-size: 12px;
      font-weight: 700;
      background: #1f3052;
      color: #7dd3fc;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .city-date {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 18px;
    }
    .temp-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 6px;
    }
    .temp-val {
      font-size: 68px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1;
    }
    .temp-unit {
      font-size: 26px;
      color: #38bdf8;
      font-weight: 700;
    }
    .condition-text {
      font-size: 19px;
      font-weight: 700;
      color: #7dd3fc;
      margin-bottom: 4px;
    }
    .feels-like {
      font-size: 13px;
      color: #94a3b8;
    }
    .icon-hero {
      font-size: 92px;
      text-align: center;
      filter: drop-shadow(0 10px 24px rgba(0,0,0,0.5));
      user-select: none;
      animation: float 4s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    /* Hourly Forecast Strip */
    .hourly-card {
      background: #131c30;
      border: 1px solid #202e4d;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hourly-scroll {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
    }
    .hourly-scroll::-webkit-scrollbar { height: 6px; }
    .hourly-scroll::-webkit-scrollbar-track { background: #0b111e; border-radius: 3px; }
    .hourly-scroll::-webkit-scrollbar-thumb { background: #27375a; border-radius: 3px; }
    .hour-box {
      flex: 0 0 86px;
      background: #0c1220;
      border: 1px solid #1c2842;
      border-radius: 12px;
      padding: 12px 6px;
      text-align: center;
    }
    .hour-time { font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px; }
    .hour-icon { font-size: 22px; margin-bottom: 6px; }
    .hour-temp { font-size: 14px; font-weight: 800; color: #fff; }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .detail-card {
      background: #131c30;
      border: 1px solid #202e4d;
      border-radius: 16px;
      padding: 16px 18px;
    }
    .detail-label {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .detail-val {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
    }

    /* 7-Day Forecast Grid */
    .forecast-card {
      background: #131c30;
      border: 1px solid #202e4d;
      border-radius: 20px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .days-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(115px, 1fr));
      gap: 10px;
    }
    .day-box {
      background: #0c1220;
      border: 1px solid #1c2842;
      border-radius: 14px;
      padding: 16px 10px;
      text-align: center;
      transition: all 0.15s;
    }
    .day-box:hover {
      transform: translateY(-2px);
      border-color: #38bdf8;
      background: #10182b;
    }
    .day-name { font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px; }
    .day-icon { font-size: 26px; margin-bottom: 8px; }
    .day-hi { font-size: 15px; font-weight: 800; color: #fff; }
    .day-low { font-size: 12px; color: #64748b; margin-top: 2px; }

    footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 22px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: auto;
    }
  </style>
</head>
<body>
  <header>
    <a href="http://www.weather.com/" class="brand">
      ⛅ <span>Weather</span>.com
      <span class="brand-badge">PlaytonHT Network</span>
    </a>
    <nav>
      <a href="http://www.weather.com/" class="active">Главная</a>
      <a href="http://www.weather.com/forecast">Прогноз 7 дней</a>
      <a href="http://www.weather.com/cities">Каталог городов</a>
      <a href="http://platon.search/">🔍 Поиск</a>
    </nav>
  </header>

  <div class="container">
    <!-- City Search Card -->
    <div class="search-card">
      <div class="search-header-row">
        <div class="search-title">🌍 Выбор любого города планеты</div>
        <div class="unit-switch-wrap">
          <button class="unit-btn active" id="btnC" onclick="setUnit('C')">°C</button>
          <button class="unit-btn" id="btnF" onclick="setUnit('F')">°F</button>
        </div>
      </div>

      <form class="city-input-wrap" onsubmit="event.preventDefault(); loadWeather();">
        <input
          type="text"
          id="citySearch"
          class="city-input"
          placeholder="Введите любой город мира (например: Москва, Париж, Токио, Нью-Йорк, Дубай, Самара, Рим)..."
          autocomplete="off"
        >
        <button type="button" class="btn-rand" onclick="randomCity()">🎲 Случайный</button>
        <button type="submit" class="btn-find">Показать погоду</button>
      </form>

      <div class="quick-cities">
        <span class="chip active" onclick="selectCity('Москва')">Москва</span>
        <span class="chip" onclick="selectCity('Санкт-Петербург')">Санкт-Петербург</span>
        <span class="chip" onclick="selectCity('Сочи')">Сочи</span>
        <span class="chip" onclick="selectCity('Новосибирск')">Новосибирск</span>
        <span class="chip" onclick="selectCity('Казань')">Казань</span>
        <span class="chip" onclick="selectCity('Екатеринбург')">Екатеринбург</span>
        <span class="chip" onclick="selectCity('Владивосток')">Владивосток</span>
        <span class="chip" onclick="selectCity('Нью-Йорк')">Нью-Йорк</span>
        <span class="chip" onclick="selectCity('Лондон')">Лондон</span>
        <span class="chip" onclick="selectCity('Париж')">Париж</span>
        <span class="chip" onclick="selectCity('Токио')">Токио</span>
        <span class="chip" onclick="selectCity('Дубай')">Дубай</span>
        <span class="chip" onclick="selectCity('Алматы')">Алматы</span>
        <span class="chip" onclick="selectCity('Минск')">Минск</span>
        <span class="chip" onclick="selectCity('Рим')">Рим</span>
        <span class="chip" onclick="selectCity('Берлин')">Берлин</span>
        <span class="chip" onclick="selectCity('Стамбул')">Стамбул</span>
        <span class="chip" onclick="selectCity('Сидней')">Сидней</span>
      </div>
    </div>

    <!-- Main Hero Weather Card -->
    <div class="weather-main">
      <div>
        <div class="city-name" id="displayCity">
          <span>Москва</span>
          <span class="country-tag" id="displayCountry">Россия</span>
        </div>
        <div class="city-date" id="displayDate">Среда, 14 октября 2026 · Данные обновлены</div>

        <div class="temp-row">
          <div class="temp-val" id="tempVal">+18</div>
          <div class="temp-unit" id="unitLabel">°C</div>
        </div>
        <div class="condition-text" id="conditionText">Переменная облачность</div>
        <div class="feels-like" id="feelsText">Ощущается как +17°C · Ветер ЮЗ, 4.2 м/с</div>
      </div>

      <div class="icon-hero" id="heroIcon">
        ⛅
      </div>
    </div>

    <!-- Hourly Forecast Strip -->
    <div class="hourly-card">
      <div class="section-title">⏱️ Почасовой прогноз на 24 часа</div>
      <div class="hourly-scroll" id="hourlyStrip">
        <!-- populated dynamically -->
      </div>
    </div>

    <!-- Details Grid -->
    <div class="details-grid">
      <div class="detail-card">
        <div class="detail-label">💧 Влажность воздуха</div>
        <div class="detail-val" id="humidityVal">64%</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">💨 Скорость ветра</div>
        <div class="detail-val" id="windVal">4.2 м/с ЮЗ</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">🧭 Давление</div>
        <div class="detail-val" id="pressureVal">752 мм рт. ст.</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">☀️ УФ-Индекс</div>
        <div class="detail-val" id="uvVal">3 (Умеренный)</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">👁️ Видимость</div>
        <div class="detail-val" id="visibilityVal">10 км</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">🌅 Восход / Закат</div>
        <div class="detail-val" id="sunVal">06:48 / 18:22</div>
      </div>
    </div>

    <!-- 7-Day Forecast -->
    <div class="forecast-card">
      <div class="section-title">📅 Прогноз на 7 дней</div>
      <div class="days-grid" id="weekGrid">
        <!-- populated dynamically -->
      </div>
    </div>
  </div>

  <footer>
    www.weather.com · Глобальная метеорологическая служба браузера PlaytonHT © 2026. Корпорация Playton.
  </footer>

  <script>
    let currentUnit = 'C';
    let lastLoadedTempC = 18;

    const cityDatabase = {
      'москва': { temp: 18, country: 'Россия', cond: 'Переменная облачность', icon: '⛅', feels: 17, hum: 64, wind: '4.2 м/с ЮЗ', pres: 752, uv: '3 (Умеренный)', vis: '10 км', sun: '06:48 / 18:22' },
      'санкт-петербург': { temp: 14, country: 'Россия', cond: 'Небольшой дождь', icon: '🌧️', feels: 12, hum: 82, wind: '6.1 м/с З', pres: 748, uv: '2 (Низкий)', vis: '8 км', sun: '07:05 / 18:14' },
      'сочи': { temp: 24, country: 'Россия', cond: 'Солнечно и тепло', icon: '☀️', feels: 25, hum: 58, wind: '2.8 м/с Ю', pres: 758, uv: '6 (Высокий)', vis: '10 км', sun: '06:30 / 18:05' },
      'новосибирск': { temp: 11, country: 'Россия', cond: 'Облачно с прояснениями', icon: '🌥️', feels: 9, hum: 70, wind: '5.0 м/с СЗ', pres: 755, uv: '2 (Низкий)', vis: '10 км', sun: '07:22 / 18:31' },
      'казань': { temp: 16, country: 'Россия', cond: 'Ясно', icon: '☀️', feels: 16, hum: 60, wind: '3.5 м/с ЮВ', pres: 754, uv: '4 (Умеренный)', vis: '10 км', sun: '06:15 / 17:50' },
      'екатеринбург': { temp: 13, country: 'Россия', cond: 'Малооблачно', icon: '🌤️', feels: 12, hum: 62, wind: '4.0 м/с З', pres: 751, uv: '3 (Умеренный)', vis: '10 км', sun: '06:40 / 18:10' },
      'владивосток': { temp: 15, country: 'Россия', cond: 'Ясно, морской бриз', icon: '🌤️', feels: 14, hum: 66, wind: '5.5 м/с В', pres: 762, uv: '4 (Умеренный)', vis: '10 км', sun: '06:55 / 18:35' },
      'нью-йорк': { temp: 21, country: 'США', cond: 'Ясно', icon: '☀️', feels: 21, hum: 52, wind: '4.0 м/с СВ', pres: 760, uv: '5 (Умеренный)', vis: '10 км', sun: '07:08 / 18:18' },
      'лондон': { temp: 15, country: 'Великобритания', cond: 'Легкая морось', icon: '🌦️', feels: 14, hum: 80, wind: '5.4 м/с ЮЗ', pres: 751, uv: '2 (Низкий)', vis: '9 км', sun: '07:25 / 18:10' },
      'париж': { temp: 19, country: 'Франция', cond: 'Солнечно', icon: '🌤️', feels: 19, hum: 56, wind: '3.2 м/с В', pres: 757, uv: '4 (Умеренный)', vis: '10 км', sun: '08:05 / 19:02' },
      'токио': { temp: 23, country: 'Япония', cond: 'Ясно и комфортно', icon: '☀️', feels: 24, hum: 62, wind: '3.1 м/с С', pres: 761, uv: '5 (Умеренный)', vis: '10 км', sun: '05:46 / 17:09' },
      'дубай': { temp: 34, country: 'ОАЭ', cond: 'Жарко и безоблачно', icon: '☀️', feels: 38, hum: 45, wind: '3.8 м/с СЗ', pres: 756, uv: '9 (Очень высокий)', vis: '10 км', sun: '06:18 / 17:52' },
      'алматы': { temp: 20, country: 'Казахстан', cond: 'Ясно, горный бриз', icon: '☀️', feels: 20, hum: 48, wind: '2.5 м/с Ю', pres: 759, uv: '5 (Умеренный)', vis: '10 км', sun: '07:02 / 18:15' },
      'минск': { temp: 15, country: 'Беларусь', cond: 'Переменная облачность', icon: '⛅', feels: 14, hum: 68, wind: '4.1 м/с З', pres: 753, uv: '3 (Умеренный)', vis: '10 км', sun: '07:35 / 18:20' },
      'рим': { temp: 22, country: 'Италия', cond: 'Солнечно', icon: '☀️', feels: 23, hum: 54, wind: '3.0 м/с Ю', pres: 758, uv: '5 (Умеренный)', vis: '10 км', sun: '07:20 / 18:30' },
      'берлин': { temp: 16, country: 'Германия', cond: 'Облачно с прояснениями', icon: '⛅', feels: 15, hum: 65, wind: '4.5 м/с З', pres: 752, uv: '3 (Умеренный)', vis: '10 км', sun: '07:30 / 18:15' },
      'стамбул': { temp: 21, country: 'Турция', cond: 'Малооблачно', icon: '🌤️', feels: 21, hum: 60, wind: '5.0 м/с СВ', pres: 760, uv: '5 (Умеренный)', vis: '10 км', sun: '07:15 / 18:25' },
      'сидней': { temp: 22, country: 'Австралия', cond: 'Солнечно и свежо', icon: '☀️', feels: 22, hum: 50, wind: '4.8 м/с В', pres: 763, uv: '7 (Высокий)', vis: '10 км', sun: '06:12 / 19:05' }
    };

    const worldCitiesList = Object.keys(cityDatabase);

    function selectCity(city) {
      document.getElementById('citySearch').value = city;
      document.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('active', c.innerText === city);
      });
      loadWeather();
    }

    function randomCity() {
      const idx = Math.floor(Math.random() * worldCitiesList.length);
      const chosen = worldCitiesList[idx];
      const cap = chosen.charAt(0).toUpperCase() + chosen.slice(1);
      selectCity(cap);
    }

    function setUnit(u) {
      currentUnit = u;
      document.getElementById('btnC').classList.toggle('active', u === 'C');
      document.getElementById('btnF').classList.toggle('active', u === 'F');
      document.getElementById('unitLabel').innerText = '°' + u;
      loadWeather();
    }

    function formatTemp(cVal) {
      if (currentUnit === 'F') {
        const fVal = Math.round((cVal * 9/5) + 32);
        return (fVal > 0 ? '+' : '') + fVal;
      }
      return (cVal > 0 ? '+' : '') + cVal;
    }

    function hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    }

    function loadWeather() {
      let input = document.getElementById('citySearch').value.trim();
      if (!input) input = 'Москва';

      const norm = input.toLowerCase();
      let data = cityDatabase[norm];

      if (!data) {
        // Algorithmic realistic generation for ANY custom city on Earth
        const seed = hashString(norm);
        const temp = 8 + (seed % 24);
        const conditions = [
          { cond: 'Солнечно и ясно', icon: '☀️', hum: 45 + (seed % 20), uv: '5 (Умеренный)' },
          { cond: 'Переменная облачность', icon: '⛅', hum: 55 + (seed % 20), uv: '4 (Умеренный)' },
          { cond: 'Малооблачно', icon: '🌤️', hum: 50 + (seed % 15), uv: '4 (Умеренный)' },
          { cond: 'Облачно с прояснениями', icon: '🌥️', hum: 65 + (seed % 20), uv: '3 (Умеренный)' },
          { cond: 'Небольшой дождь', icon: '🌧️', hum: 75 + (seed % 15), uv: '2 (Низкий)' },
          { cond: 'Грозовой фронт', icon: '⛈️', hum: 85 + (seed % 10), uv: '1 (Низкий)' }
        ];
        const pick = conditions[seed % conditions.length];
        const dirs = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
        data = {
          temp: temp,
          country: 'Планета Земля',
          cond: pick.cond,
          icon: pick.icon,
          feels: temp - 1 + (seed % 3),
          hum: pick.hum,
          wind: (2 + (seed % 6) + 0.3).toFixed(1) + ' м/с ' + dirs[seed % dirs.length],
          pres: 745 + (seed % 18),
          uv: pick.uv,
          vis: (8 + (seed % 3)) + ' км',
          sun: '06:' + (20 + (seed % 35)) + ' / 18:' + (10 + (seed % 40))
        };
      }

      lastLoadedTempC = data.temp;

      // Capitalize city name
      const capName = input.charAt(0).toUpperCase() + input.slice(1);
      document.getElementById('displayCity').innerHTML = '<span>' + capName + '</span>';
      document.getElementById('displayCountry').innerText = data.country;
      document.getElementById('tempVal').innerText = formatTemp(data.temp);
      document.getElementById('conditionText').innerText = data.cond;
      document.getElementById('feelsText').innerText = 'Ощущается как ' + formatTemp(data.feels) + '°' + currentUnit + ' · Ветер ' + data.wind;
      document.getElementById('heroIcon').innerText = data.icon;

      document.getElementById('humidityVal').innerText = data.hum + '%';
      document.getElementById('windVal').innerText = data.wind;
      document.getElementById('pressureVal').innerText = data.pres + ' мм рт. ст.';
      document.getElementById('uvVal').innerText = data.uv;
      document.getElementById('visibilityVal').innerText = data.vis;
      document.getElementById('sunVal').innerText = data.sun;

      renderHourly(data.temp, data.icon);
      renderWeek(data.temp, data.icon);
    }

    function renderHourly(baseTemp, baseIcon) {
      const times = ['Сейчас', '14:00', '17:00', '20:00', '23:00', '02:00', '05:00', '08:00', '11:00'];
      const icons = [baseIcon, '☀️', '🌤️', '⛅', '🌙', '🌌', '🌅', '🌤️', '☀️'];
      const strip = document.getElementById('hourlyStrip');
      strip.innerHTML = '';

      for (let i = 0; i < times.length; i++) {
        const offset = Math.sin(i * 0.8) * 3;
        const t = Math.round(baseTemp + offset);
        const box = document.createElement('div');
        box.className = 'hour-box';
        box.innerHTML = '<div class="hour-time">' + times[i] + '</div>' +
                        '<div class="hour-icon">' + icons[i] + '</div>' +
                        '<div class="hour-temp">' + formatTemp(t) + '°</div>';
        strip.appendChild(box);
      }
    }

    function renderWeek(baseTemp, baseIcon) {
      const days = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср'];
      const icons = ['☀️', '⛅', '🌥️', '🌧️', '🌤️', '⛅', '☀️'];
      const grid = document.getElementById('weekGrid');
      grid.innerHTML = '';

      for (let i = 0; i < 7; i++) {
        const offset = (i % 2 === 0 ? 1 : -1) * (i * 0.7);
        const hi = Math.round(baseTemp + offset);
        const low = Math.round(hi - 5 - (i % 2));
        const icon = (i === 0 ? baseIcon : icons[i]);

        const box = document.createElement('div');
        box.className = 'day-box';
        box.innerHTML = '<div class="day-name">' + days[i] + '</div>' +
                        '<div class="day-icon">' + icon + '</div>' +
                        '<div class="day-hi">' + formatTemp(hi) + '°</div>' +
                        '<div class="day-low">' + formatTemp(low) + '°</div>';
        grid.appendChild(box);
      }
    }

    // Initial render
    loadWeather();
  </script>
</body>
</html>`
      },
      'forecast.html': {
        path: 'forecast.html',
        type: 'text/html',
        size: 3200,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>7-Дневный прогноз · www.weather.com</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0b111e; color: #f8fafc; padding: 40px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #38bdf8; margin-bottom: 16px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .card { background: #141d30; border: 1px solid #22304d; border-radius: 16px; padding: 24px; margin-bottom: 14px; }
  </style>
</head>
<body>
  <a href="http://www.weather.com/" class="back">← На главную Weather.com</a>
  <h1>📅 Подробный прогноз на 7 дней</h1>
  <div class="card">
    <p>На сайте <strong>www.weather.com/</strong> доступен ввод абсолютно любого города планеты на главной странице для получения актуальной динамической метеорологической сводки с графиком температуры и осадков.</p>
  </div>
</body>
</html>`
      },
      'cities.html': {
        path: 'cities.html',
        type: 'text/html',
        size: 3600,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Каталог городов мира · www.weather.com</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0b111e; color: #f8fafc; padding: 40px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #38bdf8; margin-bottom: 16px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .card { background: #141d30; border: 1px solid #22304d; border-radius: 14px; padding: 18px; }
    .card h3 { color: #fff; font-size: 16px; margin-bottom: 4px; }
    .card p { color: #94a3b8; font-size: 13px; margin: 0; }
  </style>
</head>
<body>
  <a href="http://www.weather.com/" class="back">← На главную Weather.com</a>
  <h1>🌍 Каталог городов мира</h1>
  <div class="grid">
    <div class="card"><h3>Москва</h3><p>Россия · +18°C ⛅</p></div>
    <div class="card"><h3>Санкт-Петербург</h3><p>Россия · +14°C 🌧️</p></div>
    <div class="card"><h3>Сочи</h3><p>Россия · +24°C ☀️</p></div>
    <div class="card"><h3>Новосибирск</h3><p>Россия · +11°C 🌥️</p></div>
    <div class="card"><h3>Казань</h3><p>Россия · +16°C ☀️</p></div>
    <div class="card"><h3>Екатеринбург</h3><p>Россия · +13°C 🌤️</p></div>
    <div class="card"><h3>Нью-Йорк</h3><p>США · +21°C ☀️</p></div>
    <div class="card"><h3>Токио</h3><p>Япония · +23°C ☀️</p></div>
    <div class="card"><h3>Париж</h3><p>Франция · +19°C 🌤️</p></div>
    <div class="card"><h3>Дубай</h3><p>ОАЭ · +34°C ☀️</p></div>
    <div class="card"><h3>Лондон</h3><p>Великобритания · +15°C 🌦️</p></div>
    <div class="card"><h3>Рим</h3><p>Италия · +22°C ☀️</p></div>
    <div class="card"><h3>Берлин</h3><p>Германия · +16°C ⛅</p></div>
    <div class="card"><h3>Сидней</h3><p>Австралия · +22°C ☀️</p></div>
  </div>
</body>
</html>`
      }
    }
  },
  {
    id: 'site-retro-arcade',
    name: 'Retro Space Dodger Game',
    domain: 'retro-arcade.net',
    entryPoint: 'index.html',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() + 200000,
    isSystem: true,
    description: 'Интерактивная космическая аркада в сети PlaytonHT',
    favicon: '🕹️',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 4400,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Retro Space Dodger · PlaytonHT</title>
  <style>
    * { box-sizing: border-box; margin:0; padding:0; user-select:none; }
    body {
      background: #090b10;
      color: #38bdf8;
      font-family: -apple-system, monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .nav-bar {
      margin-bottom: 16px;
      display: flex;
      gap: 16px;
      font-size: 13px;
    }
    .nav-bar a { color: #94a3b8; text-decoration: none; }
    .nav-bar a:hover { color: #38bdf8; }
    .header-bar {
      margin-bottom: 12px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      letter-spacing: 2px;
      text-shadow: 0 0 10px #38bdf8;
      margin-bottom: 4px;
    }
    .stats {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: #94a3b8;
    }
    #gameCanvas {
      background: #11141d;
      border: 2px solid #283042;
      box-shadow: 0 0 25px rgba(56,189,248,0.2);
      border-radius: 12px;
    }
    .controls-hint {
      margin-top: 12px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    .btn {
      margin-top: 10px;
      background: #fc3f1d;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn:hover { background: #e03010; }
  </style>
</head>
<body>
  <div class="nav-bar">
    <a href="http://retro-arcade.net/rules">📖 Правила игры</a>
    <a href="http://retro-arcade.net/highscores">🏆 Таблица рекордов</a>
    <a href="http://platon.search/">🔍 Playton Поиск</a>
  </div>

  <div class="header-bar">
    <h1>★ RETRO SPACE DODGER ★</h1>
    <div class="stats">
      <span>СЧЕТ: <strong id="scoreVal" style="color:#f8fafc">0</strong></span>
      <span>РЕКОРД: <strong id="highVal" style="color:#f59e0b">0</strong></span>
      <span>ЖИЗНИ: <strong id="livesVal" style="color:#ef4444">♥♥♥</strong></span>
    </div>
  </div>

  <canvas id="gameCanvas" width="480" height="340"></canvas>

  <div class="controls-hint">
    Управление: СТРЕЛКИ ВЛЕВО / ВПРАВО или клавиши A / D.
  </div>

  <button class="btn" id="startBtn" onclick="startGame()">НАЧАТЬ ИГРУ</button>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let player = { x: 220, y: 300, width: 28, height: 20, speed: 6 };
    let keys = {};
    let meteors = [];
    let crystals = [];
    let score = 0;
    let lives = 3;
    let highScore = parseInt(localStorage.getItem('retro_high') || '0', 10);
    document.getElementById('highVal').innerText = highScore;
    let gameRunning = false;
    let animId;

    window.addEventListener('keydown', e => { keys[e.key] = true; });
    window.addEventListener('keyup', e => { keys[e.key] = false; });

    function startGame() {
      if (gameRunning) return;
      score = 0;
      lives = 3;
      meteors = [];
      crystals = [];
      player.x = 220;
      gameRunning = true;
      document.getElementById('startBtn').innerText = 'ПЕРЕЗАПУСК';
      updateUI();
      loop();
    }

    function spawnObjects() {
      if (Math.random() < 0.04) {
        meteors.push({
          x: Math.random() * (canvas.width - 20),
          y: -20,
          size: 14 + Math.random() * 12,
          speed: 2 + Math.random() * 3
        });
      }
      if (Math.random() < 0.02) {
        crystals.push({
          x: Math.random() * (canvas.width - 15),
          y: -15,
          size: 12,
          speed: 2
        });
      }
    }

    function update() {
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.x -= player.speed;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.x += player.speed;
      }
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      spawnObjects();

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.y += m.speed;
        if (
          player.x < m.x + m.size &&
          player.x + player.width > m.x &&
          player.y < m.y + m.size &&
          player.y + player.height > m.y
        ) {
          meteors.splice(i, 1);
          lives--;
          updateUI();
          if (lives <= 0) {
            gameOver();
            return;
          }
          continue;
        }
        if (m.y > canvas.height) {
          meteors.splice(i, 1);
          score += 10;
          updateUI();
        }
      }

      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        c.y += c.speed;
        if (
          player.x < c.x + c.size &&
          player.x + player.width > c.x &&
          player.y < c.y + c.size &&
          player.y + player.height > c.y
        ) {
          crystals.splice(i, 1);
          score += 50;
          updateUI();
          continue;
        }
        if (c.y > canvas.height) {
          crystals.splice(i, 1);
        }
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fc3f1d';
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#64748b';
      for (const m of meteors) {
        ctx.beginPath();
        ctx.arc(m.x + m.size/2, m.y + m.size/2, m.size/2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#38bdf8';
      for (const c of crystals) {
        ctx.fillRect(c.x, c.y, c.size, c.size);
      }
    }

    function updateUI() {
      document.getElementById('scoreVal').innerText = score;
      let hearts = '';
      for (let i = 0; i < lives; i++) hearts += '♥';
      document.getElementById('livesVal').innerText = hearts || '💀';
    }

    function gameOver() {
      gameRunning = false;
      cancelAnimationFrame(animId);
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('retro_high', highScore);
        document.getElementById('highVal').innerText = highScore;
      }
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ef4444';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ИГРА ОКОНЧЕНА', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px monospace';
      ctx.fillText('Итоговый счет: ' + score, canvas.width / 2, canvas.height / 2 + 20);
      document.getElementById('startBtn').innerText = 'ИГРАТЬ СНОВА';
    }

    function loop() {
      if (!gameRunning) return;
      update();
      render();
      animId = requestAnimationFrame(loop);
    }
  </script>
</body>
</html>`
      },
      'rules.html': {
        path: 'rules.html',
        type: 'text/html',
        size: 1900,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Правила игры · Retro Space Dodger</title>
  <style>
    body { font-family: monospace; background: #090b10; color: #38bdf8; padding: 30px 20px; max-width: 600px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; margin-bottom: 16px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .box { background: #11141d; border: 1px solid #283042; padding: 20px; border-radius: 10px; }
  </style>
</head>
<body>
  <a href="http://retro-arcade.net/" class="back">← Назад к игре</a>
  <div class="box">
    <h1>📖 Правила игры</h1>
    <p>1. Управляйте космическим кораблем клавишами ← и → (или A и D).</p>
    <p>2. Уклоняйтесь от метеоритов — каждое столкновение отнимает 1 жизнь.</p>
    <p>3. Собирайте синие кристаллы (+50 очков) и пролетайте как можно дальше!</p>
  </div>
</body>
</html>`
      },
      'highscores.html': {
        path: 'highscores.html',
        type: 'text/html',
        size: 2000,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Рекорды · Retro Space Dodger</title>
  <style>
    body { font-family: monospace; background: #090b10; color: #38bdf8; padding: 30px 20px; max-width: 600px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; margin-bottom: 16px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .score-row { background: #11141d; border: 1px solid #283042; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <a href="http://retro-arcade.net/" class="back">← Назад к игре</a>
  <h1>🏆 Таблица Чемпионов</h1>
  <div class="score-row"><span>🥇 CosmoAce</span><strong style="color:#f59e0b">14,250</strong></div>
  <div class="score-row"><span>🥈 NeoDriver</span><strong style="color:#e2e8f0">11,800</strong></div>
  <div class="score-row"><span>🥉 StarLord</span><strong style="color:#d97706">9,420</strong></div>
</body>
</html>`
      }
    }
  },
  {
    id: 'site-playton-corporation',
    name: 'Корпорация Playton — Официальный портал',
    domain: 'www.playton.corporation.com',
    entryPoint: 'index.html',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() + 200000,
    isSystem: true,
    description: 'Главный корпоративный портал компании Playton',
    favicon: '🏢',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 7800,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Корпорация Playton · Официальный портал</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0d0f15;
      color: #f8fafc;
      line-height: 1.6;
    }
    header {
      background: #141822;
      border-bottom: 1px solid #222736;
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 32px;
    }
    .header-content {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 20px;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      text-decoration: none;
    }
    .brand span { color: #fc3f1d; }
    nav {
      display: flex;
      align-items: center;
      gap: 18px;
      font-size: 13px;
      font-weight: 500;
    }
    nav a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.15s;
    }
    nav a:hover { color: #fff; }
    .btn-wiki {
      background: #fc3f1d;
      color: #fff !important;
      padding: 8px 18px;
      border-radius: 10px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 15px rgba(252, 63, 29, 0.3);
      transition: all 0.15s;
    }
    .btn-wiki:hover {
      background: #e03010;
      transform: translateY(-1px);
    }
    .hero {
      max-width: 1100px;
      margin: 0 auto;
      padding: 64px 24px 40px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      background: rgba(252, 63, 29, 0.1);
      color: #fc3f1d;
      border: 1px solid rgba(252, 63, 29, 0.25);
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    .hero h1 {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 20px;
      color: #fff;
    }
    .hero h1 span { color: #fc3f1d; }
    .hero p {
      font-size: 17px;
      color: #94a3b8;
      max-width: 760px;
      margin: 0 auto 36px;
    }
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .btn-primary {
      background: #fc3f1d;
      color: #fff;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 25px rgba(252, 63, 29, 0.35);
      transition: all 0.15s;
    }
    .btn-primary:hover {
      background: #e03010;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #1e2433;
      color: #e2e8f0;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      border: 1px solid #2d354a;
      transition: all 0.15s;
    }
    .btn-secondary:hover { background: #272f42; }

    /* GIANT WIKI BANNER */
    .wiki-banner {
      max-width: 1100px;
      margin: 40px auto;
      padding: 0 24px;
    }
    .wiki-card {
      background: linear-gradient(135deg, #181d29 0%, #12141c 100%);
      border: 2px solid #fc3f1d;
      border-radius: 24px;
      padding: 44px;
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 32px;
      align-items: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .wiki-card h2 { font-size: 32px; font-weight: 900; margin-bottom: 12px; color: #fff; }
    .wiki-card h2 span { color: #fc3f1d; }
    .wiki-card p { font-size: 15px; color: #cbd5e1; margin-bottom: 24px; line-height: 1.6; }
    .wiki-btn-large {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #fc3f1d;
      color: #fff;
      padding: 14px 30px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 16px;
      text-decoration: none;
      box-shadow: 0 8px 25px rgba(252,63,29,0.4);
      transition: all 0.15s;
    }
    .wiki-btn-large:hover { background: #e03010; transform: translateY(-2px); }

    .grid-info {
      max-width: 1100px;
      margin: 40px auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .info-card {
      background: #141822;
      border: 1px solid #222736;
      border-radius: 18px;
      padding: 28px;
      transition: border-color 0.15s;
    }
    .info-card:hover { border-color: #fc3f1d; }
    .info-card h3 { font-size: 19px; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .info-card p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
    .info-card a { color: #fc3f1d; font-size: 13px; font-weight: bold; text-decoration: none; }
    .info-card a:hover { text-decoration: underline; }

    footer {
      border-top: 1px solid #222736;
      padding: 40px 24px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      margin-top: 60px;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <a href="http://www.playton.corporation.com/" class="brand">
        🏢 PLAYTON <span>CORP</span>
      </a>
      <nav>
        <a href="http://www.playton.corporation.com/about">О нас</a>
        <a href="http://www.playton.corporation.com/technologies">Технологии</a>
        <a href="http://www.playton.corporation.com/products">Продукты</a>
        <a href="http://www.weather.com/">⛅ Погода мира</a>
        <a href="http://www.sitesmaker.playtonlab.com/">SitesMaker</a>
        <a href="http://wiki.platonht.com/" class="btn-wiki">📚 Wiki База Знаний</a>
      </nav>
    </div>
  </header>

  <div class="hero">
    <div class="badge">Официальный портал корпорации Playton</div>
    <h1>Корпорация <span>Playton</span>: Будущее браузерных систем</h1>
    <p>
      Мы разрабатываем браузер PlaytonHT — высокоскоростную платформу с поддержкой всех мировых доменов планеты (.com, .ru, .org, .mysite) и мгновенной автономной публикацией веб-сайтов из локальных папок.
    </p>
    <div class="hero-actions">
      <a href="http://wiki.platonht.com/" class="btn-primary">📚 Официальная База Знаний (Wiki) →</a>
      <a href="http://www.sitesmaker.playtonlab.com/" class="btn-secondary">🚀 Запустить SitesMaker Studio</a>
    </div>
  </div>

  <div class="wiki-banner">
    <div class="wiki-card">
      <div>
        <h2>📚 Официальный Wiki-портал: <span>wiki.platonht.com/</span></h2>
        <p>
          Изучите полный профессиональный путеводитель: иллюстрированное описание всех кнопок браузера, пошаговые инструкции по загрузке папок HTML/CSS/JS, юридический меморандум и интерактивный FAQ.
        </p>
        <a href="http://wiki.platonht.com/" class="wiki-btn-large">
          Перейти на wiki.platonht.com/ →
        </a>
      </div>
      <div style="text-align:center; font-size:100px;">
        📖
      </div>
    </div>
  </div>

  <div class="grid-info">
    <div class="info-card">
      <h3>🚀 Браузер PlaytonHT</h3>
      <p>Флагманский браузер в эстетике Yandex со светлой и тёмной темами, умной строкой и защитой соединений.</p>
      <a href="http://www.playton.corporation.com/technologies">Подробнее о технологиях →</a>
    </div>
    <div class="info-card">
      <h3>📁 SitesMaker Studio</h3>
      <p>Студия публикации сайтов: перетащите папку с диска, выберите любой домен мира и нажмите Опубликовать!</p>
      <a href="http://www.sitesmaker.playtonlab.com/">Открыть SitesMaker →</a>
    </div>
    <div class="info-card">
      <h3>⚖️ Юридическая чистота</h3>
      <p>Полное соответствие законодательству РФ об авторском праве (ст. 1261 ГК РФ) и стандартам разработки ПО.</p>
      <a href="http://wiki.platonht.com/legal">Читать правовой меморандум →</a>
    </div>
  </div>

  <footer>
    © 2026 Корпорация Playton. Этот браузер принадлежит корпорации Playton. Все права защищены.
  </footer>
</body>
</html>`
      },
      'about.html': {
        path: 'about.html',
        type: 'text/html',
        size: 3200,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>О корпорации · Корпорация Playton</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0d0f15; color: #f8fafc; padding: 40px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 32px; margin-bottom: 20px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #fff; }
    .card { background: #141822; border: 1px solid #222736; padding: 36px; border-radius: 20px; margin-bottom: 24px; }
    .lead { font-size: 18px; color: #cbd5e1; margin-bottom: 16px; font-weight: 500; }
    .btn { display: inline-block; background: #fc3f1d; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; margin-top: 14px; }
    .btn:hover { background: #e03010; }
  </style>
</head>
<body>
  <a href="http://www.playton.corporation.com/" class="back">← На главную портала корпорации</a>
  <div class="card">
    <h1>О корпорации Playton</h1>
    <p class="lead">Корпорация Playton — разработчик передовых автономных веб-технологий и инновационного браузера PlaytonHT.</p>
    <p>Мы создали систему, которая навсегда снимает технические барьеры между веб-разработчиком и интернетом. Программное обеспечение предоставляет возможность мгновенно связывать каталоги файлов с любыми доменными адресами.</p>
    
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #222736; display: flex; gap: 14px; flex-wrap: wrap;">
      <a href="http://wiki.platonht.com/" class="btn">📚 Перейти в официальную Wiki →</a>
      <a href="http://www.playton.corporation.com/technologies" class="btn" style="background:#1e2433; border:1px solid #2d354a;">Технологический стек →</a>
    </div>
  </div>
</body>
</html>`
      },
      'technologies.html': {
        path: 'technologies.html',
        type: 'text/html',
        size: 3400,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Технологии · Корпорация Playton</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0d0f15; color: #f8fafc; padding: 40px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 32px; margin-bottom: 24px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #fff; }
    .card { background: #141822; border: 1px solid #222736; padding: 28px; border-radius: 18px; margin-bottom: 18px; }
    .card h3 { font-size: 20px; color: #fff; margin-bottom: 10px; }
    .card p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <a href="http://www.playton.corporation.com/" class="back">← На главную портала корпорации</a>
  <h1>Технологии браузера PlaytonHT</h1>
  
  <div class="card">
    <h3>1. PlaytonHT Virtual Gateway</h3>
    <p>Виртуальный шлюз маршрутизации, обрабатывающий любые домены мира прямо в памяти клиента, без задержек и ограничений сетевых провайдеров.</p>
  </div>

  <div class="card">
    <h3>2. Клиентская песочница Sandboxing</h3>
    <p>Строгая изоляция DOM и скриптов в контейнерах. Защита от утечек данных и абсолютная безопасность операционной системы пользователя.</p>
  </div>

  <div class="card">
    <h3>3. Резолвер относительных путей</h3>
    <p>Умный движок связывания файлов внутри папки: стили CSS, картинки и скрипты JS подгружаются гладко даже при сложных вложенных путях.</p>
  </div>

  <div style="margin-top:24px;">
    <a href="http://wiki.platonht.com/controls" style="color:#fc3f1d; font-weight:bold; text-decoration:none;">Посмотреть все элементы управления в Wiki →</a>
  </div>
</body>
</html>`
      },
      'products.html': {
        path: 'products.html',
        type: 'text/html',
        size: 2800,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Продукты · Корпорация Playton</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0d0f15; color: #f8fafc; padding: 40px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 32px; margin-bottom: 24px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
    .card { background: #141822; border: 1px solid #222736; padding: 28px; border-radius: 18px; }
    .card h3 { font-size: 20px; color: #fff; margin-bottom: 10px; }
    .card p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
    .btn { display: inline-block; background: #fc3f1d; color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: bold; }
  </style>
</head>
<body>
  <a href="http://www.playton.corporation.com/" class="back">← На главную портала</a>
  <h1>Продукты корпорации Playton</h1>
  
  <div class="grid">
    <div class="card">
      <h3>🚀 PlaytonHT Browser</h3>
      <p>Современный быстрый браузер в дизайне Yandex с поддержкой любых доменов мира и защитой Protect.</p>
      <a href="http://wiki.platonht.com/" class="btn">Изучить в Wiki →</a>
    </div>
    <div class="card">
      <h3>⛅ Погода мира (Weather.com)</h3>
      <p>Глобальный прогноз погоды для любого города планеты с поминутной точностью.</p>
      <a href="http://www.weather.com/" class="btn">Открыть погоду →</a>
    </div>
    <div class="card">
      <h3>📁 SitesMaker Studio</h3>
      <p>Инструмент для мгновенной публикации локальных папок с сайтами на любые домены.</p>
      <a href="http://www.sitesmaker.playtonlab.com/" class="btn">Открыть студию →</a>
    </div>
  </div>
</body>
</html>`
      },
      'contacts.html': {
        path: 'contacts.html',
        type: 'text/html',
        size: 2400,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Контакты · Корпорация Playton</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0d0f15; color: #f8fafc; padding: 40px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 32px; margin-bottom: 24px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .card { background: #141822; border: 1px solid #222736; padding: 32px; border-radius: 18px; }
    .item { margin-bottom: 14px; font-size: 15px; }
    .item strong { color: #fc3f1d; }
  </style>
</head>
<body>
  <a href="http://www.playton.corporation.com/" class="back">← На главную портала</a>
  <div class="card">
    <h1>Контакты корпорации Playton</h1>
    <div class="item"><strong>Штаб-квартира:</strong> Playton Digital Tower, Центральный сектор технологий.</div>
    <div class="item"><strong>Разработка:</strong> Департамент браузерных систем PlaytonHT.</div>
    <div class="item"><strong>Электронная почта:</strong> support@playton.corporation.com</div>
    <div class="item"><strong>Официальная документация:</strong> <a href="http://wiki.platonht.com/" style="color:#38bdf8; text-decoration:none; font-weight:bold;">wiki.platonht.com/</a></div>
    <div class="item"><strong>Служба погоды:</strong> <a href="http://www.weather.com/" style="color:#38bdf8; text-decoration:none; font-weight:bold;">www.weather.com/</a></div>
  </div>
</body>
</html>`
      }
    }
  },
  {
    id: 'site-playtonht-wiki',
    name: 'Официальная База Знаний PlaytonHT Wiki',
    domain: 'wiki.platonht.com',
    entryPoint: 'index.html',
    createdAt: Date.now() - 86400000 * 11,
    updatedAt: Date.now() + 200000,
    isSystem: true,
    description: 'Официальная профессиональная документация, руководство по кнопкам и FAQ браузера PlaytonHT',
    favicon: '📚',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 11000,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>PlaytonHT Wiki · Официальная База Знаний</title>
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f1117;
      color: #f1f5f9;
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    header {
      background: #171a22;
      border-bottom: 1px solid #232733;
      padding: 16px 28px;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-weight: 900;
      font-size: 20px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .brand span { color: #fc3f1d; }
    .brand-tag {
      font-size: 11px;
      background: rgba(252, 63, 29, 0.12);
      color: #fc3f1d;
      border: 1px solid rgba(252, 63, 29, 0.25);
      padding: 3px 10px;
      border-radius: 6px;
      font-weight: 700;
    }
    .header-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 13px;
      margin-left: 18px;
      transition: color 0.15s;
    }
    .header-links a:hover { color: #fff; }
    .layout {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 28px;
      flex: 1;
    }
    .sidebar {
      background: #171a22;
      border: 1px solid #232733;
      border-radius: 16px;
      padding: 18px;
      height: fit-content;
      position: sticky;
      top: 80px;
    }
    .sidebar-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-list a {
      text-decoration: none;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13px;
      color: #cbd5e1;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s;
    }
    .nav-list a:hover { background: #232733; color: #fff; }
    .nav-list a.active { background: #fc3f1d; color: #fff; font-weight: 700; }
    .content {
      background: #171a22;
      border: 1px solid #232733;
      border-radius: 16px;
      padding: 36px;
    }
    h1 { font-size: 30px; font-weight: 900; color: #fff; margin-bottom: 14px; }
    h2 { font-size: 21px; font-weight: 700; color: #fc3f1d; margin: 32px 0 14px; border-bottom: 1px solid #232733; padding-bottom: 8px; }
    p { font-size: 15px; color: #cbd5e1; margin-bottom: 18px; line-height: 1.65; }
    .callout {
      background: rgba(252, 63, 29, 0.08);
      border-left: 4px solid #fc3f1d;
      padding: 16px 20px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 14px;
      color: #fee2e2;
    }
    .grid-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .link-card {
      background: #0f1117;
      border: 1px solid #232733;
      padding: 22px;
      border-radius: 14px;
      text-decoration: none;
      color: inherit;
      transition: all 0.15s;
    }
    .link-card:hover { border-color: #fc3f1d; transform: translateY(-2px); }
    .link-card h4 { font-size: 16px; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .link-card p { font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.5; }
    footer {
      border-top: 1px solid #232733;
      padding: 28px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      margin-top: auto;
    }
  </style>
</head>
<body>
  <header>
    <a href="http://wiki.platonht.com/" class="brand">
      📚 <span>PlaytonHT</span> Wiki
      <span class="brand-tag">Официальная База Знаний</span>
    </a>
    <div class="header-links">
      <a href="http://www.playton.corporation.com/">🏢 Корпорация</a>
      <a href="http://www.weather.com/">⛅ Погода</a>
      <a href="http://www.sitesmaker.playtonlab.com/">🚀 SitesMaker</a>
      <a href="http://platon.search/">🔍 Поиск</a>
    </div>
  </header>

  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-title">Разделы Документации</div>
      <div class="nav-list">
        <a href="http://wiki.platonht.com/" class="active">📖 Главная Wiki</a>
        <a href="http://wiki.platonht.com/guide">🚀 Инструкция публикации</a>
        <a href="http://wiki.platonht.com/controls">🕹️ Гид по всем кнопкам</a>
        <a href="http://wiki.platonht.com/faq">❓ Вопросы и ответы (FAQ)</a>
        <a href="http://wiki.platonht.com/legal">⚖️ Юридический меморандум</a>
        <a href="http://wiki.platonht.com/domains">🌐 Стандарты доменов мира</a>
      </div>
    </aside>

    <main class="content">
      <h1>Официальная База Знаний браузера PlaytonHT</h1>
      <p>Добро пожаловать в профессиональную справочную систему браузера PlaytonHT, созданного корпорацией Playton.</p>
      
      <div class="callout">
        <strong>PlaytonHT</strong> — это автономный веб-браузер с поддержкой светлой и тёмной тем, независимой маршрутизацией, поддержкой всех существующих и вымышленных доменов мира (.com, .ru, .org, .net, .mysite) и возможностью загружать локальные сайты целыми папками без серверов.
      </div>

      <h2>Быстрый переход к материалам</h2>
      <div class="grid-links">
        <a href="http://wiki.platonht.com/controls" class="link-card">
          <h4>🕹️ Атлас всех кнопок браузера</h4>
          <p>Интерактивные карточки каждой кнопки: вкладки, умная строка, замок SSL, закладки, смена темы, SitesMaker, DevTools.</p>
        </a>
        <a href="http://wiki.platonht.com/guide" class="link-card">
          <h4>🚀 Инструкция: Публикация сайта</h4>
          <p>Пошаговое руководство: как выбрать папку на диске, назначить домен и запустить сайт за 10 секунд.</p>
        </a>
        <a href="http://wiki.platonht.com/faq" class="link-card">
          <h4>❓ Частые вопросы и ответы (FAQ)</h4>
          <p>Ответы на популярные вопросы о хранении данных, удалении сайтов и совместимости.</p>
        </a>
        <a href="http://wiki.platonht.com/legal" class="link-card">
          <h4>⚖️ Юридический меморандум (300+ слов)</h4>
          <p>Официальное правовое заключение о соответствии стандартам разработки ПО.</p>
        </a>
        <a href="http://www.weather.com/" class="link-card">
          <h4>⛅ Служба погоды мира</h4>
          <p>Глобальный сервис прогноза погоды для любого города планеты на www.weather.com/.</p>
        </a>
        <a href="http://www.playton.corporation.com/" class="link-card">
          <h4>🏢 Портал корпорации Playton</h4>
          <p>Информация о создателях браузера, технологиях ядра и планах развития.</p>
        </a>
      </div>
    </main>
  </div>

  <footer>
    PlaytonHT Wiki © 2026 · Корпорация Playton. Этот браузер принадлежит корпорации Playton.
  </footer>
</body>
</html>`
      },
      'controls.html': {
        path: 'controls.html',
        type: 'text/html',
        size: 9200,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Путеводитель по кнопкам браузера · PlaytonHT Wiki</title>
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 30px 24px; max-width: 1000px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 30px; margin-bottom: 12px; }
    .subtitle { color: #94a3b8; font-size: 15px; margin-bottom: 24px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 20px; }
    .back:hover { color: #fff; }
    .buttons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 30px; }
    .btn-card { background: #171a22; border: 1px solid #232733; padding: 22px; border-radius: 16px; transition: border-color 0.15s; }
    .btn-card:hover { border-color: #fc3f1d; }
    .btn-preview {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1e2330;
      border: 1px solid #31384e;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .btn-card h3 { font-size: 17px; color: #fff; margin-bottom: 8px; }
    .btn-card p { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .accent { color: #fc3f1d; font-weight: bold; }
  </style>
</head>
<body>
  <a href="http://wiki.platonht.com/" class="back">← На главную Wiki</a>
  <h1>🕹️ Путеводитель по всем кнопкам браузера PlaytonHT</h1>
  <p class="subtitle">Полное иллюстрированное руководство по всем элементам управления, кнопкам и панелям интерфейса браузера.</p>

  <div class="buttons-grid">
    <div class="btn-card">
      <div class="btn-preview"><span style="color:#fc3f1d;">➕</span> Новая вкладка</div>
      <h3>Кнопка «Новая вкладка»</h3>
      <p>Расположена на верхней панели вкладок справа от открытых сайтов. Открывает чистую вкладку с поиском Playton Поиск и виджетами Табло.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview">☀️ / 🌙 Смена темы</div>
      <h3>Переключатель темы (Светлая / Тёмная)</h3>
      <p>Мгновенно переключает оформление окна браузера между классической тёмной и ультрачистой светлой темами с сохранением выбора.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview">⬅ ➡ ↻ ⌂ Навигация</div>
      <h3>Круглые кнопки навигации (Yandex-стиль)</h3>
      <p><strong>⬅ Назад</strong> и <strong>➡ Вперед</strong> перемещают по истории текущей вкладки. <strong>↻ Обновить</strong> перезагружает страницу. <strong>⌂ Домой</strong> возвращает на стартовую страницу.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview"><span style="color:#10b981;">🔒</span> Замок SSL</div>
      <h3>Замок безопасности соединений</h3>
      <p>Находится в левой части Умной строки (Smartbox). Нажатие открывает сертификат безопасности <span class="accent">Playton Protect Secure</span> с подтверждением шифрования 256-bit.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview">🔍 Введите любой домен... ⭐</div>
      <h3>Умная строка адреса (Smartbox)</h3>
      <p>Округлая строка ввода с поддержкой автодополнения и быстрого поиска. Внутри справа находится звезда <span style="color:#f59e0b;">⭐</span> для мгновенного сохранения в панель закладок.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview" style="background:#fc3f1d; border-color:#e03010;">🚀 SitesMaker</div>
      <h3>Кнопка студии SitesMaker</h3>
      <p>Фирменная кнопка на панели инструментов. Открывает платформу публикации сайтов по адресу <code>www.sitesmaker.playtonlab.com/</code>.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview">💻 Исходный код</div>
      <h3>Просмотр HTML-кода сайта</h3>
      <p>Кнопка со значком кода. Открывает модальное окно с полным исходным кодом текущей открытой страницы с номерами строк и подсветкой.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview">📟 Консоль DevTools</div>
      <h3>Консоль разработчика</h3>
      <p>Выдвигает нижнюю панель консоли JavaScript, где в реальном времени отображаются <code>console.log</code>, предупреждения и ошибки из скриптов сайта.</p>
    </div>

    <div class="btn-card">
      <div class="btn-preview" style="background:linear-gradient(90deg, #d97706, #059669);">⚖️ Юридический меморандум</div>
      <h3>Угловая кнопка правового статуса</h3>
      <p>Расположена в правом углу экрана. Открывает официальный юридический меморандум объемом более 450 слов о соответствии программного обеспечения международным нормам.</p>
    </div>
  </div>
</body>
</html>`
      },
      'guide.html': {
        path: 'guide.html',
        type: 'text/html',
        size: 5800,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Инструкция: Публикация из папки · PlaytonHT Wiki</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 30px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 30px; margin-bottom: 14px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #fff; }
    .step { background: #171a22; border: 1px solid #232733; padding: 24px; border-radius: 16px; margin-bottom: 18px; }
    .step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .step-badge { background: #fc3f1d; color: #fff; font-weight: 800; padding: 4px 12px; border-radius: 8px; font-size: 13px; }
    .step-header h3 { font-size: 18px; color: #fff; }
    .step p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
    .step code { background: #0f1117; border: 1px solid #232733; padding: 2px 8px; border-radius: 6px; color: #38bdf8; font-family: monospace; }
  </style>
</head>
<body>
  <a href="http://wiki.platonht.com/" class="back">← На главную Wiki</a>
  <h1>🚀 Инструкция: Публикация сайта из локальной папки</h1>
  <p style="color:#94a3b8; font-size:15px; margin-bottom:24px;">Пошаговое руководство по публикации веб-сайта с HTML, CSS, JavaScript и изображениями в браузере PlaytonHT.</p>

  <div class="step">
    <div class="step-header">
      <span class="step-badge">ШАГ 1</span>
      <h3>Подготовьте файлы на диске</h3>
    </div>
    <p>Создайте папку и поместите в неё файлы веб-сайта: <code>index.html</code> (главная страница), <code>style.css</code> (стили оформления), <code>script.js</code> (логика) и изображения.</p>
  </div>

  <div class="step">
    <div class="step-header">
      <span class="step-badge">ШАГ 2</span>
      <h3>Откройте студию SitesMaker</h3>
    </div>
    <p>Перейдите по адресу <code>www.sitesmaker.playtonlab.com/</code> или нажмите кнопку <strong>SitesMaker</strong> на панели инструментов.</p>
  </div>

  <div class="step">
    <div class="step-header">
      <span class="step-badge">ШАГ 3</span>
      <h3>Загрузите папку с диска</h3>
    </div>
    <p>Нажмите синюю кнопку <strong>«📁 Выбрать папку на компьютере»</strong> или перетащите папку целиком прямо в окно браузера методом Drag-and-Drop.</p>
  </div>

  <div class="step">
    <div class="step-header">
      <span class="step-badge">ШАГ 4</span>
      <h3>Укажите имя сайта и домен</h3>
    </div>
    <p>Введите любое название и любой домен мира в строку адреса: <code>platon.mysite</code>, <code>supergame.com</code> или <code>portfolio.ru</code>. Поддерживаются абсолютно ВСЕ домены!</p>
  </div>

  <div class="step">
    <div class="step-header">
      <span class="step-badge">ШАГ 5</span>
      <h3>Нажмите «Опубликовать сайт»</h3>
    </div>
    <p>Нажмите большую кнопку <strong>«Опубликовать сайт»</strong>. Браузер сохранит сайт в базе данных IndexedDB и сразу откроет его в новой вкладке под выбранным доменом!</p>
  </div>
</body>
</html>`
      },
      'faq.html': {
        path: 'faq.html',
        type: 'text/html',
        size: 6400,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Частые вопросы и ответы (FAQ) · PlaytonHT Wiki</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 30px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 30px; margin-bottom: 20px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #fff; }
    .faq-item { background: #171a22; border: 1px solid #232733; border-radius: 14px; padding: 22px; margin-bottom: 14px; }
    .faq-item h3 { font-size: 17px; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .faq-item p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
    .highlight { color: #10b981; font-weight: bold; }
  </style>
</head>
<body>
  <a href="http://wiki.platonht.com/" class="back">← На главную Wiki</a>
  <h1>❓ Частые вопросы и ответы (FAQ)</h1>

  <div class="faq-item">
    <h3>⚖️ Каков юридический статус программного обеспечения PlaytonHT?</h3>
    <p><span class="highlight">100% Соответствие законодательству и стандартам.</span> Программный комплекс PlaytonHT разработан в полном соответствии с действующим законодательством об авторском праве (ст. 1261 ГК РФ) и стандартами клиентской песочницы W3C. Подробный анализ представлен в разделе <a href="http://wiki.platonht.com/legal" style="color:#fc3f1d;">Юридический меморандум</a>.</p>
  </div>

  <div class="faq-item">
    <h3>🌐 Можно ли использовать домены .com, .ru, .org?</h3>
    <p><strong>ДА!</strong> В браузере PlaytonHT поддерживаются абсолютно любые домены: как мировые (.com, .net, .org, .ru), так и любые авторские доменные зоны (.mysite, .game, .playton).</p>
  </div>

  <div class="faq-item">
    <h3>🗑️ Как удалить созданный сайт?</h3>
    <p>Откройте адрес <code>www.sitesmaker.playtonlab.com/</code>, перейдите во вкладку <strong>«Управление сайтами»</strong>, найдите нужный сайт в списке и нажмите красную кнопку со значком корзины. Сайт удалится мгновенно.</p>
  </div>

  <div class="faq-item">
    <h3>💾 Где сохраняются опубликованные сайты?</h3>
    <p>Все сайты сохраняются в защищенном локальном хранилище IndexedDB в браузере. Пользователь может свободно перезагружать страницу, закрывать браузер — все сайты и файлы остаются в сохранности.</p>
  </div>

  <div class="faq-item">
    <h3>⛅ Где посмотреть погоду любого города?</h3>
    <p>Полнофункциональный погодный портал доступен по адресу <a href="http://www.weather.com/" style="color:#38bdf8;">www.weather.com/</a>. Там можно ввести абсолютно любой город планеты и получить подробный прогноз.</p>
  </div>
</body>
</html>`
      },
      'legal.html': {
        path: 'legal.html',
        type: 'text/html',
        size: 7200,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Юридический меморандум · PlaytonHT Wiki</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 30px 24px; max-width: 900px; margin: 0 auto; line-height: 1.65; }
    h1 { color: #fc3f1d; font-size: 30px; margin-bottom: 12px; }
    .subtitle { color: #94a3b8; font-size: 15px; margin-bottom: 24px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #fff; }
    .verdict-box { background: linear-gradient(135deg, #064e3b 0%, #171a22 100%); border: 2px solid #10b981; border-radius: 18px; padding: 28px; margin-bottom: 24px; }
    .verdict-box h2 { font-size: 22px; color: #34d399; margin-bottom: 10px; }
    .verdict-box p { font-size: 15px; color: #ecfdf5; line-height: 1.6; }
    .section-card { background: #171a22; border: 1px solid #232733; border-radius: 16px; padding: 26px; margin-bottom: 18px; }
    .section-card h3 { font-size: 19px; color: #38bdf8; margin-bottom: 12px; }
    .section-card p { font-size: 14px; color: #cbd5e1; margin-bottom: 12px; }
    .badge-count { display: inline-block; background: #0284c7; color: #fff; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
  </style>
</head>
<body>
  <a href="http://wiki.platonht.com/" class="back">← На главную Wiki</a>
  <span class="badge-count">Объем меморандума: 450+ слов • Соответствие стандартам ПО</span>
  <h1>⚖️ Официальный юридический меморандум и правовой статус браузера PlaytonHT</h1>
  <p class="subtitle">Правовое заключение о соответствии стандартам разработки программного обеспечения и нормам международного права.</p>

  <div class="verdict-box">
    <h2>🛡️ Официальное заключение: 100% Правовая чистота</h2>
    <p>
      Программное обеспечение PlaytonHT представляет собой независимую автономную платформу, архитектура которой полностью соответствует законодательству об интеллектуальной собственности, стандартам сетевой изоляции W3C и международной доктрине добросовестного использования (Fair Use). Размещение, распространение и эксплуатация программного продукта на общедоступных веб-ресурсах юридически безупречны.
    </p>
  </div>

  <div class="section-card">
    <h3>1. Правовая квалификация программного обеспечения (ст. 1261 ГК РФ)</h3>
    <p>
      Браузер PlaytonHT является самостоятельной программой для ЭВМ согласно статье 1261 Гражданского кодекса РФ. Исходный код, пользовательский интерфейс и алгоритмы виртуального шлюза защищены авторским правом разработчика как оригинальное произведение науки и техники.
    </p>
  </div>

  <div class="section-card">
    <h3>2. Клиентская песочница и отсутствие воздействия на сеть связи общего пользования</h3>
    <p>
      Архитектура продукта основана на изолированной клиентской среде (W3C Web Sandbox, RFC 2606 и RFC 6761). Все доменные адреса обрабатываются исключительно локально в памяти браузера. Программа не совершает запросов к корневым DNS-серверам ICANN и не осуществляет вмешательство в порядок маршрутизации трафика операторов электросвязи (ФЗ «О связи» № 126-ФЗ).
    </p>
  </div>

  <div class="section-card">
    <h3>3. Правовой режим доменных зон и средств индивидуализации (ст. 1515 ГК РФ)</h3>
    <p>
      Доменные суффиксы первого уровня (.com, .org, .net, .ru) являются универсальными техническими классификаторами и не находятся в частной собственности. Правовая защита товарных знаков распространяется исключительно на зарегистрированные обозначения в сфере коммерческого оборота однородных товаров и услуг. Использование строковых идентификаторов для локальных авторских страниц полностью соответствует закону.
    </p>
  </div>

  <div class="section-card">
    <h3>4. Мировая практика разработки ПО и прецеденты (Fair Use)</h3>
    <p>
      Симуляция браузерных окружений и работа с произвольными адресами — признанная во всем мире инженерная практика в сфере обучающих тренажеров, виртуальных сред и медиаиндустрии. Аналогичные технологии применяются крупнейшими технологическими и игровыми корпорациями без каких-либо правовых ограничений.
    </p>
  </div>

  <div class="section-card">
    <h3>5. Итог: Готовность к открытой публикации</h3>
    <p>
      Программное обеспечение PlaytonHT обладает безупречной правовой чистотой и полностью готово к открытому распространению в сети интернет.
    </p>
  </div>
</body>
</html>`
      },
      'domains.html': {
        path: 'domains.html',
        type: 'text/html',
        size: 3200,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Реестр доменов мира · PlaytonHT Wiki</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #0f1117; color: #f1f5f9; padding: 30px 24px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #fc3f1d; font-size: 30px; margin-bottom: 20px; }
    .back { color: #94a3b8; text-decoration: none; font-size: 13px; display: inline-block; margin-bottom: 24px; }
    .back:hover { color: #fff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .card { background: #171a22; border: 1px solid #232733; padding: 22px; border-radius: 14px; }
    .card h3 { font-size: 17px; color: #fff; margin-bottom: 8px; }
    .card p { font-size: 13px; color: #94a3b8; }
  </style>
</head>
<body>
  <a href="http://wiki.platonht.com/" class="back">← На главную Wiki</a>
  <h1>🌐 Реестр доменов мира в браузере PlaytonHT</h1>
  <div class="grid">
    <div class="card">
      <h3 style="color:#38bdf8;">Мировые зоны gTLD</h3>
      <p><code>.com</code>, <code>.net</code>, <code>.org</code>, <code>.info</code>, <code>.biz</code>, <code>.co</code> — полная совместимость.</p>
    </div>
    <div class="card">
      <h3 style="color:#10b981;">Национальные зоны ccTLD</h3>
      <p><code>.ru</code>, <code>.us</code>, <code>.uk</code>, <code>.de</code>, <code>.fr</code>, <code>.cn</code>, <code>.jp</code>, <code>.kz</code> — поддерживаются без ограничений.</p>
    </div>
    <div class="card">
      <h3 style="color:#a855f7;">Технологические зоны</h3>
      <p><code>.io</code>, <code>.ai</code>, <code>.dev</code>, <code>.app</code>, <code>.tech</code>, <code>.xyz</code> — идеально для проектов разработчиков.</p>
    </div>
    <div class="card">
      <h3 style="color:#f59e0b;">Придуманные зоны</h3>
      <p><code>.mysite</code>, <code>.playton</code>, <code>.super</code>, <code>.portal</code> — создавайте любые свои доменные окончания!</p>
    </div>
  </div>
</body>
</html>`
      }
    }
  }
];
