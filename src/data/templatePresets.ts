import { SiteFile } from '../types/browser';

export interface SiteTemplate {
  id: string;
  name: string;
  suggestedDomain: string;
  description: string;
  icon: string;
  files: Record<string, SiteFile>;
}

export const TEMPLATE_PRESETS: SiteTemplate[] = [
  {
    id: 'portfolio',
    name: 'Личный сайт Платона (Portfolio)',
    suggestedDomain: 'platon.mysite',
    description: 'Стильная страница разработчика с биографией, проектами и интерактивной связью',
    icon: '👤',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 1980,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Платон · Персональный сайт</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <div class="avatar">👨‍💻</div>
    <h1>Привет, я Платон!</h1>
    <div class="tag">Веб-разработчик & Создатель миров</div>
    <p>Добро пожаловать на мой собственный сайт в зоне <code>.mysite</code>! Я создаю проекты, пишу код на JS и исследую локальный веб.</p>
    
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-num">12+</div>
        <div class="stat-label">Проектов</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">100%</div>
        <div class="stat-label">Localhost</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">⚡</div>
        <div class="stat-label">Скорость</div>
      </div>
    </div>

    <div class="links">
      <a href="about.html" class="btn btn-primary">Обо мне →</a>
      <button class="btn btn-secondary" onclick="greet()">Поздороваться</button>
    </div>
  </div>
  <script src="main.js"></script>
</body>
</html>`
      },
      'about.html': {
        path: 'about.html',
        type: 'text/html',
        size: 1200,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>О Платоне · Моя история</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <h2>Обо мне</h2>
    <p style="margin-top: 14px;">Я увлекаюсь программированием, созданием собственных веб-страниц и экспериментирую с вымышленными доменами.</p>
    <p style="margin-top: 10px;">Этот сайт загружен целиком из локальной папки и хранится прямо в IndexedDB моего браузера.</p>
    <div style="margin-top: 24px;">
      <a href="index.html" class="btn btn-primary">← На главную</a>
    </div>
  </div>
</body>
</html>`
      },
      'style.css': {
        path: 'style.css',
        type: 'text/css',
        size: 950,
        content: `body {
  margin: 0;
  padding: 40px 20px;
  background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}
.card {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 36px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.avatar {
  font-size: 64px;
  margin-bottom: 12px;
}
h1 { font-size: 28px; margin: 0 0 6px; }
.tag { color: #38bdf8; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
.stats-row {
  display: flex;
  justify-content: space-around;
  margin: 24px 0;
  background: rgba(15, 23, 42, 0.6);
  padding: 16px;
  border-radius: 12px;
}
.stat-num { font-size: 20px; font-weight: bold; color: #38bdf8; }
.stat-label { font-size: 11px; color: #64748b; margin-top: 2px; }
.links { display: flex; gap: 12px; justify-content: center; }
.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: all 0.2s;
}
.btn-primary { background: #38bdf8; color: #0f172a; }
.btn-primary:hover { background: #7dd3fc; }
.btn-secondary { background: #334155; color: #fff; }
.btn-secondary:hover { background: #475569; }`
      },
      'main.js': {
        path: 'main.js',
        type: 'application/javascript',
        size: 240,
        content: `function greet() {
  alert('Привет из JavaScript на сайте platon.mysite! Все скрипты работают в реальном времени.');
  console.log('Пользователь нажал кнопку приветствия на platon.mysite');
}`
      }
    }
  },
  {
    id: 'cyber-game',
    name: 'Кликер Энергии (Clicker Game)',
    suggestedDomain: 'energy.clicker.com',
    description: 'Интерактивная игра-кликер с сохранением прогресса и анимациями',
    icon: '⚡',
    files: {
      'index.html': {
        path: 'index.html',
        type: 'text/html',
        size: 2100,
        content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Квантовый Кликер</title>
  <style>
    body {
      background: #0b0f19;
      color: #fff;
      font-family: sans-serif;
      text-align: center;
      padding: 40px 20px;
      margin: 0;
    }
    .energy-btn {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, #38bdf8 0%, #0284c7 100%);
      border: 4px solid #7dd3fc;
      font-size: 54px;
      cursor: pointer;
      box-shadow: 0 0 30px rgba(56,189,248,0.5);
      transition: transform 0.1s, box-shadow 0.1s;
      outline: none;
      margin: 24px auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .energy-btn:active {
      transform: scale(0.92);
      box-shadow: 0 0 50px rgba(56,189,248,0.8);
    }
    .score { font-size: 36px; font-weight: 800; color: #38bdf8; margin: 10px 0; }
    .shop { max-width: 400px; margin: 30px auto; display: flex; flex-direction: column; gap: 10px; }
    .shop-item {
      background: #1e293b;
      padding: 12px 18px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #334155;
    }
    .buy-btn {
      background: #10b981;
      border: none;
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    .buy-btn:disabled { background: #475569; cursor: not-allowed; }
  </style>
</head>
<body>
  <h1>⚡ КВАНТОВЫЙ КЛИКЕР</h1>
  <p style="color: #94a3b8;">Генерируй энергию для локального браузера</p>
  
  <div class="score" id="score">0</div>
  <button class="energy-btn" id="clicker">⚡</button>
  <div id="cps" style="color: #10b981; font-size: 14px;">Авто-сбор: 0 / сек</div>

  <div class="shop">
    <div class="shop-item">
      <span>🔋 Батарейка (+1 клик)</span>
      <button class="buy-btn" id="buy1" onclick="buyUpgrade(1, 15)">Купить (15)</button>
    </div>
    <div class="shop-item">
      <span>🤖 Авто-генератор (+2/сек)</span>
      <button class="buy-btn" id="buy2" onclick="buyUpgrade(2, 50)">Купить (50)</button>
    </div>
  </div>

  <script>
    let energy = 0;
    let clickPower = 1;
    let autoPower = 0;

    const scoreEl = document.getElementById('score');
    const cpsEl = document.getElementById('cps');
    const clicker = document.getElementById('clicker');

    clicker.onclick = () => {
      energy += clickPower;
      updateUI();
    };

    function buyUpgrade(type, cost) {
      if (energy >= cost) {
        energy -= cost;
        if (type === 1) clickPower += 1;
        if (type === 2) autoPower += 2;
        updateUI();
      }
    }

    function updateUI() {
      scoreEl.innerText = energy;
      cpsEl.innerText = 'Авто-сбор: ' + autoPower + ' / сек';
      document.getElementById('buy1').disabled = energy < 15;
      document.getElementById('buy2').disabled = energy < 50;
    }

    setInterval(() => {
      if (autoPower > 0) {
        energy += autoPower;
        updateUI();
      }
    }, 1000);
  </script>
</body>
</html>`
      }
    }
  }
];
