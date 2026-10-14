import React, { useState, useRef } from 'react';
import { PublishedSite, SiteFile } from '../../types/browser';
import { saveSite, deleteSite, formatBytes, calculateSitesStorageSize, resetToDefaultSites } from '../../services/storage';
import { TEMPLATE_PRESETS, SiteTemplate } from '../../data/templatePresets';
import { normalizePath } from '../../utils/siteRenderer';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import {
  Upload,
  FolderUp,
  FileCode,
  Globe,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Folder,
  Eye,
  Database,
  ArrowRight,
  RefreshCw,
  Download,
  Info,
  Layers
} from 'lucide-react';

interface SitesMakerProps {
  sites: PublishedSite[];
  onNavigateToDomain: (domain: string) => void;
  onRefreshSites: () => Promise<void>;
  isDark?: boolean;
}

export const SitesMakerPortal: React.FC<SitesMakerProps> = ({
  sites,
  onNavigateToDomain,
  onRefreshSites,
  isDark = true
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'manage' | 'domains'>('publish');
  
  // Publish state
  const [siteName, setSiteName] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [description, setDescription] = useState('');
  const [faviconEmoji, setFaviconEmoji] = useState('🌐');
  const [entryPoint, setEntryPoint] = useState('index.html');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, SiteFile>>({});
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState<PublishedSite | null>(null);

  // Inspector modal
  const [inspectingSite, setInspectingSite] = useState<PublishedSite | null>(null);
  const [selectedFileInModal, setSelectedFileInModal] = useState<SiteFile | null>(null);

  // Delete confirmation modal
  const [siteToDelete, setSiteToDelete] = useState<PublishedSite | null>(null);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Normalize user domain
  const cleanDomain = domainInput.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const isDomainTaken = sites.some(s => s.domain.toLowerCase() === cleanDomain);

  // Helper to process and normalize a bundle of files
  const processDiscoveredFiles = (rawFiles: Record<string, SiteFile>) => {
    const keys = Object.keys(rawFiles);
    if (keys.length === 0) return;

    // Check if all files share a common root folder prefix, e.g. "my-project/index.html"
    let commonPrefix = '';
    const firstSlash = keys[0].indexOf('/');
    if (firstSlash !== -1) {
      const candidate = keys[0].substring(0, firstSlash + 1);
      const allShare = keys.every(k => k.startsWith(candidate));
      if (allShare) {
        commonPrefix = candidate;
      }
    }

    const normalizedMap: Record<string, SiteFile> = {};
    let detectedEntry = '';

    for (const [rawKey, file] of Object.entries(rawFiles)) {
      let finalPath = rawKey;
      if (commonPrefix && finalPath.startsWith(commonPrefix)) {
        finalPath = finalPath.slice(commonPrefix.length);
      }
      finalPath = normalizePath(finalPath);
      if (!finalPath) continue;

      normalizedMap[finalPath] = {
        ...file,
        path: finalPath
      };

      // Detect entry point
      const lower = finalPath.toLowerCase();
      if (lower === 'index.html' || lower === 'index.htm') {
        detectedEntry = finalPath;
      } else if (!detectedEntry && (lower.endsWith('/index.html') || lower.endsWith('/index.htm'))) {
        detectedEntry = finalPath;
      } else if (!detectedEntry && lower.endsWith('.html')) {
        detectedEntry = finalPath;
      }
    }

    // If still no entry detected, pick first file
    if (!detectedEntry && Object.keys(normalizedMap).length > 0) {
      detectedEntry = Object.keys(normalizedMap)[0];
    }

    setUploadedFiles(normalizedMap);
    setEntryPoint(detectedEntry);
    setUploadStatus(`Загружено файлов: ${Object.keys(normalizedMap).length} (главный файл: ${detectedEntry})`);
  };

  // Handle folder upload from HTML5 directory picker
  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploadStatus('Чтение файлов из папки...');
    const rawFiles: Record<string, SiteFile> = {};

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relPath = file.webkitRelativePath || file.name;

      const isText = file.type.startsWith('text/') ||
                     file.name.endsWith('.html') ||
                     file.name.endsWith('.htm') ||
                     file.name.endsWith('.css') ||
                     file.name.endsWith('.js') ||
                     file.name.endsWith('.json') ||
                     file.name.endsWith('.svg') ||
                     file.name.endsWith('.md') ||
                     file.name.endsWith('.txt');

      if (isText) {
        const text = await file.text();
        rawFiles[relPath] = {
          path: relPath,
          content: text,
          type: file.type || 'text/plain',
          size: file.size
        };
      } else {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        rawFiles[relPath] = {
          path: relPath,
          content: dataUrl,
          type: file.type || 'application/octet-stream',
          size: file.size
        };
      }
    }

    processDiscoveredFiles(rawFiles);

    // Auto-fill site name and domain if empty
    if (!siteName) {
      const firstPath = fileList[0].webkitRelativePath;
      if (firstPath && firstPath.includes('/')) {
        const folderName = firstPath.split('/')[0];
        setSiteName(folderName.replace(/[-_]/g, ' '));
        if (!domainInput) {
          setDomainInput(`${folderName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
        }
      }
    }
  };

  // Handle Drag & Drop folder recursively
  const handleDropFolder = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    setUploadStatus('Сканирование папки...');
    const rawFiles: Record<string, SiteFile> = {};

    const traverseEntry = async (entry: FileSystemEntry, currentPath = ''): Promise<void> => {
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        await new Promise<void>((resolve) => {
          fileEntry.file(async (file) => {
            const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
            const isText = file.type.startsWith('text/') ||
                           file.name.endsWith('.html') ||
                           file.name.endsWith('.htm') ||
                           file.name.endsWith('.css') ||
                           file.name.endsWith('.js') ||
                           file.name.endsWith('.json') ||
                           file.name.endsWith('.svg');

            if (isText) {
              const text = await file.text();
              rawFiles[relPath] = {
                path: relPath,
                content: text,
                type: file.type || 'text/plain',
                size: file.size
              };
            } else {
              const dataUrl = await new Promise<string>((res) => {
                const reader = new FileReader();
                reader.onload = () => res(reader.result as string);
                reader.readAsDataURL(file);
              });
              rawFiles[relPath] = {
                path: relPath,
                content: dataUrl,
                type: file.type || 'application/octet-stream',
                size: file.size
              };
            }
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const reader = dirEntry.createReader();
        const entries = await new Promise<FileSystemEntry[]>((resolve) => {
          reader.readEntries((results) => resolve(results));
        });
        for (const child of entries) {
          const nextPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
          await traverseEntry(child, nextPath);
        }
      }
    };

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await traverseEntry(entry);
          }
        }
      }

      processDiscoveredFiles(rawFiles);
      if (!siteName) setSiteName('Мой веб-проект');
      if (!domainInput) setDomainInput('platon.com');
    } catch (err) {
      console.error(err);
      setUploadStatus('Ошибка чтения: ' + String(err));
    }
  };

  // Handle Zip file upload
  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('Распаковка ZIP-архива...');
    try {
      const zip = await JSZip.loadAsync(file);
      const rawFiles: Record<string, SiteFile> = {};
      const fileEntries = Object.keys(zip.files).filter(path => !zip.files[path].dir);

      for (const rawPath of fileEntries) {
        const isText = rawPath.endsWith('.html') ||
                       rawPath.endsWith('.htm') ||
                       rawPath.endsWith('.css') ||
                       rawPath.endsWith('.js') ||
                       rawPath.endsWith('.json') ||
                       rawPath.endsWith('.svg');

        if (isText) {
          const text = await zip.files[rawPath].async('string');
          rawFiles[rawPath] = {
            path: rawPath,
            content: text,
            type: 'text/plain',
            size: text.length
          };
        } else {
          const base64 = await zip.files[rawPath].async('base64');
          rawFiles[rawPath] = {
            path: rawPath,
            content: `data:application/octet-stream;base64,${base64}`,
            type: 'application/octet-stream',
            size: base64.length
          };
        }
      }

      processDiscoveredFiles(rawFiles);
      if (!siteName) setSiteName(file.name.replace(/\.zip$/i, ''));
      if (!domainInput) setDomainInput(`${file.name.replace(/\.zip$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
    } catch (err) {
      console.error(err);
      setUploadStatus('Ошибка чтения ZIP: ' + String(err));
    }
  };

  // Apply template preset
  const applyTemplate = (tpl: SiteTemplate) => {
    processDiscoveredFiles(tpl.files);
    setSiteName(tpl.name);
    setDomainInput(tpl.suggestedDomain);
    setDescription(tpl.description);
    setFaviconEmoji(tpl.icon);
    setUploadStatus(`Применен шаблон: «${tpl.name}»`);
  };

  // Publish site to PlaytonHT database
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanDomain) {
      alert('Пожалуйста, укажите домен для сайта (например: platon.com или platon.mysite)!');
      return;
    }
    if (Object.keys(uploadedFiles).length === 0) {
      alert('Пожалуйста, выберите папку с сайтом или готовый шаблон!');
      return;
    }

    setIsPublishing(true);

    try {
      // Ensure entryPoint exists in uploadedFiles
      let finalEntry = normalizePath(entryPoint);
      if (!uploadedFiles[finalEntry]) {
        // Fallback to index.html or first file
        const keys = Object.keys(uploadedFiles);
        const indexKey = keys.find(k => k.toLowerCase() === 'index.html' || k.toLowerCase().endsWith('/index.html'));
        finalEntry = indexKey || keys[0] || 'index.html';
      }

      const newSite: PublishedSite = {
        id: `site-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: siteName.trim() || cleanDomain,
        domain: cleanDomain,
        entryPoint: finalEntry,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        files: uploadedFiles,
        description: description.trim() || 'Официальный сайт в сети PlaytonHT',
        favicon: faviconEmoji,
        isSystem: false
      };

      await saveSite(newSite);
      await onRefreshSites();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setPublishedSuccess(newSite);
      setIsPublishing(false);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении сайта: ' + String(err));
      setIsPublishing(false);
    }
  };

  // Delete site
  const handleDeleteSite = async (site: PublishedSite) => {
    try {
      await deleteSite(site.id);
      await onRefreshSites();
      setSiteToDelete(null);
      if (inspectingSite?.id === site.id) {
        setInspectingSite(null);
      }
    } catch (err) {
      alert('Не удалось удалить сайт: ' + String(err));
    }
  };

  const totalStorageBytes = calculateSitesStorageSize(sites);

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Corporate Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-sky-500/20">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">SitesMaker Studio</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-semibold">
                  Корпорация Playton
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Этот браузер принадлежит корпорации Playton · Публикация веб-папок на любые домены мира
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'publish'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Опубликовать сайт
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Управление сайтами ({sites.length})
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'domains'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Все домены мира
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        {/* Success Banner */}
        {publishedSuccess && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-emerald-300">
                  Сайт успешно опубликован в браузере PlaytonHT!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Домен <span className="font-mono text-emerald-400 font-bold">{publishedSuccess.domain}</span> готов к работе. Главный файл: <code className="text-sky-300 font-mono">{publishedSuccess.entryPoint}</code> ({formatBytes(calculateSitesStorageSize([publishedSuccess]))}).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigateToDomain(publishedSuccess.domain)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Открыть сайт сейчас</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPublishedSuccess(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: PUBLISH */}
        {activeTab === 'publish' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Upload and Presets */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Drag and drop folder */}
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDropFolder}
                className="border-2 border-dashed border-slate-700 hover:border-sky-500/70 bg-slate-900/60 rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FolderUp className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Загрузить папку с сайтом
                </h3>
                <p className="text-xs text-slate-400 max-w-md mb-4">
                  Перетащите сюда папку с файлами сайта (HTML, CSS, JS, картинки) или выберите папку на компьютере.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <input
                    type="file"
                    ref={folderInputRef}
                    onChange={handleFolderUpload}
                    // @ts-expect-error webkitdirectory standard
                    webkitdirectory=""
                    directory=""
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-sky-600/20 cursor-pointer"
                  >
                    <Folder className="w-4 h-4" />
                    Выбрать папку на диске
                  </button>

                  <input
                    type="file"
                    ref={zipInputRef}
                    onChange={handleZipUpload}
                    accept=".zip"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => zipInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Загрузить ZIP-архив
                  </button>
                </div>

                {uploadStatus && (
                  <div className="mt-4 text-xs font-mono px-3.5 py-1.5 rounded-lg bg-slate-800 text-sky-300 border border-slate-700 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    {uploadStatus}
                  </div>
                )}
              </div>

              {/* Ready-made Presets */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Или выберите готовый демо-сайт
                  </div>
                  <span className="text-[11px] text-slate-500">Моментальная загрузка</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATE_PRESETS.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl)}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-900 transition-all cursor-pointer flex items-start gap-3 group"
                    >
                      <span className="text-2xl p-2 rounded-lg bg-slate-800/70 group-hover:scale-110 transition-transform">
                        {tpl.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                          {tpl.name}
                        </div>
                        <div className="text-[11px] font-mono text-sky-400 mt-0.5 truncate">
                          {tpl.suggestedDomain}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {tpl.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Files in the current bundle */}
              {Object.keys(uploadedFiles).length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-sky-400" />
                      <h4 className="text-xs font-bold text-slate-200">
                        Файлы в пакете ({Object.keys(uploadedFiles).length} шт. · {formatBytes(calculateSitesStorageSize([{ files: uploadedFiles } as PublishedSite]))})
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFiles({});
                        setUploadStatus(null);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Очистить
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {Object.values(uploadedFiles).map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-slate-400 font-mono">
                            {file.path.endsWith('.html') || file.path.endsWith('.htm') ? '📄' : file.path.endsWith('.css') ? '🎨' : file.path.endsWith('.js') ? '⚡' : '📁'}
                          </span>
                          <span className={`font-mono truncate ${file.path === entryPoint ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                            {file.path}
                          </span>
                          {file.path === entryPoint && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Главный (Entry)
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 text-[11px] font-mono shrink-0 ml-2">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Publish Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handlePublish}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 sticky top-24 shadow-xl"
              >
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-400" />
                    Публикация в сети PlaytonHT
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Поддерживаются абсолютно ВСЕ домены в мире (включая любые придуманные).
                  </p>
                </div>

                {/* Domain Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Домен сайта (любой мировой или придуманный):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="например: platon.com, platon.mysite, super.ru"
                      required
                      className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono outline-none transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {cleanDomain && (
                        isDomainTaken ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Перезапишет сайт
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Домен свободен
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['.com', '.ru', '.mysite', '.net', '.org', '.io', '.xyz', '.game'].map((ext) => (
                      <button
                        type="button"
                        key={ext}
                        onClick={() => {
                          const base = domainInput.split('.')[0] || 'mysite';
                          setDomainInput(`${base}${ext}`);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
                      >
                        {ext}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Site Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Название сайта:
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Например: Портфолио Платона"
                    required
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                {/* Favicon & Entry Point Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Иконка (эмодзи):
                    </label>
                    <input
                      type="text"
                      value={faviconEmoji}
                      onChange={(e) => setFaviconEmoji(e.target.value)}
                      maxLength={4}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2 text-center text-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Главный файл (Entry Point):
                    </label>
                    <select
                      value={entryPoint}
                      onChange={(e) => setEntryPoint(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                    >
                      {Object.keys(uploadedFiles).length > 0 ? (
                        Object.keys(uploadedFiles).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))
                      ) : (
                        <option value="index.html">index.html</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Краткое описание (необязательно):
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Описание сайта..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none resize-none"
                  />
                </div>

                {/* Publish Button */}
                <button
                  type="submit"
                  disabled={isPublishing || Object.keys(uploadedFiles).length === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Публикация...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Опубликовать сайт в браузере PlaytonHT
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE & DELETE SITES */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  Управление опубликованными сайтами
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Всего сайтов в сети PlaytonHT: <strong className="text-sky-300">{sites.length}</strong> · Общий размер данных: <strong className="text-sky-300">{formatBytes(totalStorageBytes)}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={async () => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sites, null, 2));
                    const a = document.createElement('a');
                    a.href = dataStr;
                    a.download = `playton-sites-${Date.now()}.json`;
                    a.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Экспорт базы сайтов
                </button>

                <button
                  onClick={async () => {
                    if (confirm('Сбросить сайты к заводским настройкам по умолчанию?')) {
                      await resetToDefaultSites();
                      await onRefreshSites();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Восстановить базовые сайты
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site) => {
                const siteSize = calculateSitesStorageSize([site]);
                const filesCount = Object.keys(site.files).length;
                return (
                  <div
                    key={site.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xl shrink-0">{site.favicon || '🌐'}</span>
                          <span className="text-xs font-mono font-bold text-sky-400 group-hover:text-sky-300 truncate">
                            {site.domain}
                          </span>
                        </div>
                        {site.isSystem ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold shrink-0">
                            Playton System
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shrink-0">
                            Активен
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1 truncate">
                        {site.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 h-8">
                        {site.description || 'Веб-ресурс сети PlaytonHT'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-4 pt-3 border-t border-slate-800/80">
                        <span>📁 {filesCount} {filesCount === 1 ? 'файл' : 'файлов'}</span>
                        <span>·</span>
                        <span>💾 {formatBytes(siteSize)}</span>
                        <span>·</span>
                        <span className="truncate">Старт: {site.entryPoint}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => onNavigateToDomain(site.domain)}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Перейти</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setInspectingSite(site);
                          const firstFile = Object.values(site.files)[0];
                          setSelectedFileInModal(firstFile || null);
                        }}
                        title="Просмотреть структуру файлов"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      {!site.isSystem ? (
                        <button
                          onClick={() => setSiteToDelete(site)}
                          title="Удалить сайт из браузера PlaytonHT"
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          title="Системный сайт корпорации защищен от удаления"
                          className="p-2 rounded-xl bg-slate-800/40 text-slate-600 cursor-not-allowed text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ALL WORLD DOMAINS SUPPORT */}
        {activeTab === 'domains' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl">
                  🌐
                </div>
                <div>
                  <h2 className="text-lg font-bold text-sky-200">
                    Поддержка всех доменов мира в браузере PlaytonHT
                  </h2>
                  <p className="text-xs text-slate-400">
                    Браузер корпорации Playton не имеет ограничений по доменным зонам
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-900/30 border border-sky-500/30 text-sky-200 text-sm font-medium mb-6">
                🌍 <strong>Абсолютная свобода доменов:</strong> Поддерживается публикация сайта на совершенно любой существующий мировой домен (.com, .ru, .org, .net, .io, .ai) или в любую собственную доменную зону (.mysite, .playton, .game, .app).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Классические международные зоны
                  </div>
                  <p className="text-slate-400 mb-3">
                    Любые мировые домены верхнего уровня для глобальных проектов:
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {['.com', '.net', '.org', '.info', '.biz', '.pro', '.co', '.mobi'].map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">{d}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Национальные географические зоны
                  </div>
                  <p className="text-slate-400 mb-3">
                    Поддержка национальных доменов всех стран планеты:
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {['.ru', '.us', '.uk', '.de', '.fr', '.cn', '.jp', '.by', '.kz', '.eu'].map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">{d}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Технологические и AI зоны
                  </div>
                  <p className="text-slate-400 mb-3">
                    Современные зоны для стартапов, кода и сервисов:
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {['.io', '.ai', '.dev', '.app', '.tech', '.cloud', '.xyz', '.digital'].map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">{d}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Придуманные и персональные зоны
                  </div>
                  <p className="text-slate-400 mb-3">
                    Создавайте любые свои персональные зоны без согласований:
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {['.mysite', '.playton', '.custom', '.portal', '.game', '.universe'].map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {siteToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Удалить сайт из PlaytonHT?
              </h3>
            </div>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              Подтверждение удаления сайта <strong className="text-white font-mono">{siteToDelete.domain}</strong> («{siteToDelete.name}»):
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Все {Object.keys(siteToDelete.files).length} файлов будут удалены, а домен освободится для новых публикаций.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSiteToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteSite(siteToDelete)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Да, удалить сайт
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Inspector Modal */}
      {inspectingSite && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {inspectingSite.domain} / Каталог файлов
                </h3>
              </div>
              <button
                onClick={() => setInspectingSite(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                ✕ Закрыть
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
              <div className="border-r border-slate-800 p-3 overflow-y-auto max-h-[60vh] bg-slate-950/40">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Файлы сайта
                </div>
                <div className="space-y-1">
                  {Object.values(inspectingSite.files).map((f) => (
                    <button
                      key={f.path}
                      onClick={() => setSelectedFileInModal(f)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate flex items-center justify-between cursor-pointer ${
                        selectedFileInModal?.path === f.path
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{f.path}</span>
                      <span className="text-[10px] opacity-70 ml-1">{formatBytes(f.size)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2 p-4 overflow-y-auto max-h-[60vh] bg-slate-950 font-mono text-xs">
                {selectedFileInModal ? (
                  <div>
                    <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px]">
                      <span>{selectedFileInModal.path} ({selectedFileInModal.type})</span>
                      <span>{formatBytes(selectedFileInModal.size)}</span>
                    </div>
                    {selectedFileInModal.content.startsWith('data:image') ? (
                      <div className="p-4 flex items-center justify-center">
                        <img src={selectedFileInModal.content} alt={selectedFileInModal.path} className="max-w-full max-h-64 rounded object-contain border border-slate-800" />
                      </div>
                    ) : (
                      <pre className="text-slate-200 whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                        {selectedFileInModal.content}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500 text-center py-12">
                    Выберите файл для просмотра
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Сеть: PlaytonHT Global Network</span>
              <button
                onClick={() => {
                  setInspectingSite(null);
                  onNavigateToDomain(inspectingSite.domain);
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Открыть в браузере</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
