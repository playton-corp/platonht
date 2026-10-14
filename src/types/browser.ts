export interface SiteFile {
  path: string; // e.g. "index.html", "css/style.css", "assets/logo.png"
  content: string; // text content or base64 data URI for binary/images
  type: string; // mime type
  size: number; // size in bytes
}

export interface PublishedSite {
  id: string;
  name: string;
  domain: string; // e.g. "platon.mysite", "www.sitesmaker.playtonlab.com"
  entryPoint: string; // e.g. "index.html"
  createdAt: number;
  updatedAt: number;
  files: Record<string, SiteFile>;
  isSystem?: boolean;
  description?: string;
  favicon?: string;
  themeColor?: string;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  text: string;
  timestamp: string;
}
