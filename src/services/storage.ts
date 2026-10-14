import { PublishedSite, Bookmark } from '../types/browser';
import { DEFAULT_SITES, DEFAULT_BOOKMARKS } from '../data/defaultSites';

const DB_NAME = 'PlaytonBrowserDB';
const DB_VERSION = 1;
const STORE_SITES = 'sites';
const STORE_BOOKMARKS = 'bookmarks';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SITES)) {
        const siteStore = db.createObjectStore(STORE_SITES, { keyPath: 'id' });
        siteStore.createIndex('domain', 'domain', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function initStorage(): Promise<void> {
  try {
    const db = await openDB();
    const sites = await getAllSites();
    if (sites.length === 0) {
      // Seed default mock sites
      for (const site of DEFAULT_SITES) {
        await saveSite(site);
      }
    }
    const bookmarks = await getAllBookmarks();
    if (bookmarks.length === 0) {
      for (const bm of DEFAULT_BOOKMARKS) {
        await saveBookmark(bm);
      }
    }

    // Automatically remove deprecated sites
    await deleteSite('site-playton-news');
    await deleteBookmark('bm-news');
    await deleteSite('site-cyber-market');
    await deleteBookmark('bm-shop');

    // Ensure essential corporate, wiki and default sites are registered
    for (const defSite of DEFAULT_SITES) {
      const existing = sites.find(s => s.id === defSite.id);
      if (!existing || existing.updatedAt < defSite.updatedAt || defSite.isSystem) {
        await saveSite(defSite);
      }
    }

    // Ensure bookmarks are updated
    for (const bm of DEFAULT_BOOKMARKS) {
      if (!bookmarks.some(b => b.url === bm.url)) {
        await saveBookmark(bm);
      }
    }

    db.close();
  } catch (err) {
    console.error('Failed to initialize IndexedDB storage:', err);
  }
}

export async function getAllSites(): Promise<PublishedSite[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SITES, 'readonly');
      const store = tx.objectStore(STORE_SITES);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve(req.result || []);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn('Fallback reading sites from memory/defaults:', err);
    return DEFAULT_SITES;
  }
}

export async function getSiteByDomain(domain: string): Promise<PublishedSite | null> {
  // Normalize domain
  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const sites = await getAllSites();
  return sites.find(s => s.domain.toLowerCase().trim() === cleanDomain) || null;
}

export async function saveSite(site: PublishedSite): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SITES, 'readwrite');
    const store = tx.objectStore(STORE_SITES);
    const req = store.put(site);
    req.onsuccess = () => {
      db.close();
      resolve();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function deleteSite(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SITES, 'readwrite');
    const store = tx.objectStore(STORE_SITES);
    const req = store.delete(id);
    req.onsuccess = () => {
      db.close();
      resolve();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function resetToDefaultSites(): Promise<PublishedSite[]> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_SITES, 'readwrite');
    const store = tx.objectStore(STORE_SITES);
    const clearReq = store.clear();
    clearReq.onsuccess = () => resolve();
    clearReq.onerror = () => reject(clearReq.error);
  });
  
  for (const s of DEFAULT_SITES) {
    await saveSite(s);
  }
  db.close();
  return DEFAULT_SITES;
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKMARKS);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve(req.result || []);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return DEFAULT_BOOKMARKS;
  }
}

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKMARKS);
    const req = store.put(bookmark);
    req.onsuccess = () => {
      db.close();
      resolve();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKMARKS);
    const req = store.delete(id);
    req.onsuccess = () => {
      db.close();
      resolve();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export function calculateSitesStorageSize(sites: PublishedSite[]): number {
  let bytes = 0;
  for (const site of sites) {
    for (const file of Object.values(site.files)) {
      bytes += file.size || file.content.length || 0;
    }
  }
  return bytes;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
