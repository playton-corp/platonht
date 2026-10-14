import { PublishedSite, SiteFile } from '../types/browser';

/**
 * Normalizes a virtual file path (converts backslashes, removes leading slashes and ./ prefixes)
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '').trim();
}

/**
 * Resolves a virtual path within a site bundle with multi-layer fallback
 * so published sites never unexpectedly trigger 404.
 */
export function resolveFilePath(site: PublishedSite, requestPath: string): SiteFile | null {
  if (!site || !site.files || Object.keys(site.files).length === 0) {
    return null;
  }

  const clean = normalizePath(requestPath);
  const isRootRequest = !clean || clean === '' || clean === 'index.html' || clean === '/';

  // 1. If requesting the root or index.html, prioritize the designated entry point
  if (isRootRequest && site.entryPoint) {
    const entryClean = normalizePath(site.entryPoint);
    if (site.files[entryClean]) return site.files[entryClean];
    if (site.files[site.entryPoint]) return site.files[site.entryPoint];

    // Try finding file that ends with entryClean
    for (const [key, file] of Object.entries(site.files)) {
      if (normalizePath(key).toLowerCase().endsWith(entryClean.toLowerCase())) {
        return file;
      }
    }
  }

  // 2. Direct exact match
  if (site.files[clean]) return site.files[clean];

  // 3. Normalized path exact match
  for (const [key, file] of Object.entries(site.files)) {
    if (normalizePath(key) === clean) {
      return file;
    }
  }

  // 4. Case-insensitive exact match
  const lowerClean = clean.toLowerCase();
  for (const [key, file] of Object.entries(site.files)) {
    if (normalizePath(key).toLowerCase() === lowerClean) {
      return file;
    }
  }

  // 5. Match by filename (ignoring folder prefix, e.g. "my-folder/index.html" matches "index.html")
  for (const [key, file] of Object.entries(site.files)) {
    const norm = normalizePath(key).toLowerCase();
    if (norm.endsWith('/' + lowerClean) || norm === lowerClean) {
      return file;
    }
  }

  // 6. If root was requested (or index.html not found), find ANY HTML file
  if (isRootRequest) {
    // Look for any index.html
    for (const [key, file] of Object.entries(site.files)) {
      if (normalizePath(key).toLowerCase().includes('index.htm')) {
        return file;
      }
    }
    // Look for any .html or .htm file
    for (const [key, file] of Object.entries(site.files)) {
      if (normalizePath(key).toLowerCase().endsWith('.html') || normalizePath(key).toLowerCase().endsWith('.htm')) {
        return file;
      }
    }
    // Final fallback: return the very first file available
    const allFiles = Object.values(site.files);
    if (allFiles.length > 0) {
      return allFiles[0];
    }
  }

  // 7. Try adding .html extension (e.g. /about -> /about.html)
  const withHtml = `${clean}.html`.toLowerCase();
  for (const [key, file] of Object.entries(site.files)) {
    const norm = normalizePath(key).toLowerCase();
    if (norm === withHtml || norm.endsWith('/' + withHtml)) {
      return file;
    }
  }

  return null;
}

/**
 * Transforms an HTML document by inlining/resolving relative assets from the site's files
 * and injecting a bridge for navigation and console logs.
 */
export function renderSiteHtml(
  site: PublishedSite,
  currentPath: string = ''
): string {
  const file = resolveFilePath(site, currentPath);
  if (!file) {
    return generateNotFoundHtml(site.domain, currentPath);
  }

  let html = file.content;
  const files = site.files;

  // Helper to find file content by relative or absolute-in-site path
  const findAsset = (refPath: string): SiteFile | null => {
    const normRef = normalizePath(refPath).toLowerCase();
    if (!normRef) return null;

    // 1. Direct match
    for (const [k, v] of Object.entries(files)) {
      if (normalizePath(k).toLowerCase() === normRef) return v;
    }

    // 2. Relative to current file's folder
    const curNorm = normalizePath(file.path);
    if (curNorm.includes('/')) {
      const folder = curNorm.substring(0, curNorm.lastIndexOf('/') + 1);
      const combined = (folder + normRef).toLowerCase();
      for (const [k, v] of Object.entries(files)) {
        if (normalizePath(k).toLowerCase() === combined) return v;
      }
    }

    // 3. Match by filename
    for (const [k, v] of Object.entries(files)) {
      const kNorm = normalizePath(k).toLowerCase();
      if (kNorm.endsWith('/' + normRef) || kNorm === normRef) return v;
    }

    return null;
  };

  // 1. Inline or replace stylesheets: <link rel="stylesheet" href="...">
  html = html.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi, (match) => {
    const hrefMatch = match.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return match;
    const href = hrefMatch[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('data:')) {
      return match;
    }
    const asset = findAsset(href);
    if (asset) {
      return `<style>/* inlined ${asset.path} */\n${asset.content}\n</style>`;
    }
    return match;
  });

  // 2. Inline or replace local scripts: <script src="...">
  html = html.replace(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (match, src) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:')) {
      return match;
    }
    const asset = findAsset(src);
    if (asset) {
      return `<script>/* inlined ${asset.path} */\n${asset.content}\n</script>`;
    }
    return match;
  });

  // 3. Replace image sources: <img src="...">
  html = html.replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return match;
    }
    const asset = findAsset(src);
    if (asset && asset.content.startsWith('data:')) {
      return `<img ${before}src="${asset.content}"${after}>`;
    }
    return match;
  });

  // 4. Inject PlaytonHT Browser Bridge script
  const bridgeScript = `
    <script>
      (function() {
        // Intercept console
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        function sendConsole(type, args) {
          try {
            const text = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            window.parent.postMessage({ type: 'PLAYTON_CONSOLE', level: type, text: text }, '*');
          } catch(e) {}
        }

        console.log = function(...args) { originalLog.apply(console, args); sendConsole('log', args); };
        console.warn = function(...args) { originalWarn.apply(console, args); sendConsole('warn', args); };
        console.error = function(...args) { originalError.apply(console, args); sendConsole('error', args); };

        // Intercept link clicks
        document.addEventListener('click', function(e) {
          const target = e.target.closest('a');
          if (!target || !target.getAttribute('href')) return;
          const href = target.getAttribute('href').trim();

          if (href.startsWith('#') || href.startsWith('javascript:')) return;

          e.preventDefault();
          let destinationUrl = href;

          // If relative link, resolve against current domain
          if (!href.startsWith('http://') && !href.startsWith('https://')) {
            const domain = "${site.domain}";
            const path = href.startsWith('/') ? href.slice(1) : href;
            destinationUrl = 'http://' + domain + '/' + path;
          }

          window.parent.postMessage({
            type: 'PLAYTON_NAVIGATE',
            url: destinationUrl
          }, '*');
        }, true);

        // Notify parent that document loaded
        window.addEventListener('DOMContentLoaded', function() {
          window.parent.postMessage({
            type: 'PLAYTON_PAGE_LOADED',
            title: document.title || "${site.name}"
          }, '*');
        });
      })();
    </script>
  `;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${bridgeScript}</head>`);
  } else if (html.includes('<body')) {
    html = html.replace('<body', `${bridgeScript}<body`);
  } else {
    html = `${bridgeScript}${html}`;
  }

  return html;
}

export function generateNotFoundHtml(domain: string, path: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>404 - Файл не найден · PlaytonHT</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #020617;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
      padding: 24px;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(56, 189, 248, 0.1);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.2);
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    .code { font-size: 80px; font-weight: 900; color: #ef4444; margin-bottom: 8px; line-height: 1; }
    h1 { font-size: 22px; margin-bottom: 12px; }
    p { color: #94a3b8; font-size: 14px; max-width: 480px; line-height: 1.5; margin-bottom: 24px; }
    .path-badge {
      background: #0f172a;
      border: 1px solid #1e293b;
      padding: 6px 12px;
      border-radius: 8px;
      font-family: monospace;
      color: #38bdf8;
      display: inline-block;
      margin-top: 6px;
    }
    .btn {
      background: #0284c7;
      color: #fff;
      padding: 10px 22px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn:hover { background: #0369a1; }
  </style>
</head>
<body>
  <div class="badge">PlaytonHT Browser</div>
  <div class="code">404</div>
  <h1>Файл не найден</h1>
  <p>В каталоге сайта <strong>${domain}</strong> запрашиваемый файл не обнаружен: <br><span class="path-badge">${path || 'index.html'}</span></p>
  <a href="http://${domain}" class="btn">Открыть главную страницу сайта</a>
</body>
</html>`;
}
