/**
 * Persistent Image Storage Service for Winbridge Annual Presentation
 * Uses IndexedDB for unlimited capacity persistence across reloads & navigation,
 * with synchronous memory caching and automatic image optimization.
 */

import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'WinbridgePresentationDB';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_photos';

// In-memory cache for synchronous instant rendering
const memoryCache: Record<string, string> = {};
let isDbInitialized = false;
const listeners = new Set<(photos: Record<string, string>) => void>();

function notifyListeners() {
  const snapshot = { ...memoryCache };
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (err) {
      console.error('Error notifying image listener', err);
    }
  });

  // Also dispatch window custom event for decoupled components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('winbridge_photos_changed', { detail: snapshot })
    );
  }
}

/**
 * Open or upgrade IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Initialize storage & preload all saved images into memory cache
 */
export async function initImageStorage(): Promise<Record<string, string>> {
  if (isDbInitialized) return { ...memoryCache };

  try {
    // 1. Also check localStorage backup
    if (typeof localStorage !== 'undefined') {
      const legacyPhotos = localStorage.getItem('winbridge_custom_photos');
      if (legacyPhotos) {
        try {
          const parsed = JSON.parse(legacyPhotos);
          Object.assign(memoryCache, parsed);
        } catch {
          // ignore parsing error
        }
      }
    }

    // 2. Load from IndexedDB
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getAllReq = store.getAll();

    return new Promise((resolve) => {
      getAllReq.onsuccess = () => {
        const items = getAllReq.result as { id: string; dataUrl: string }[];
        if (items && Array.isArray(items)) {
          items.forEach((item) => {
            if (item.id && item.dataUrl) {
              memoryCache[item.id] = item.dataUrl;
            }
          });
        }
        isDbInitialized = true;
        notifyListeners();
        resolve({ ...memoryCache });
      };

      getAllReq.onerror = () => {
        isDbInitialized = true;
        resolve({ ...memoryCache });
      };
    });
  } catch (err) {
    console.warn('Failed to init IndexedDB, using memory/localStorage fallback', err);
    isDbInitialized = true;
    return { ...memoryCache };
  }
}

// Auto-run init on module load in browser
if (typeof window !== 'undefined') {
  initImageStorage().catch(console.error);
}

/**
 * Save an image to IndexedDB and memory cache
 */
export async function saveStoredImage(key: string, dataUrl: string): Promise<void> {
  memoryCache[key] = dataUrl;
  notifyListeners();

  // Save to IndexedDB
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ id: key, dataUrl, updatedAt: Date.now() });

    // Also persist a lightweight backup to localStorage if size permits
    try {
      if (typeof localStorage !== 'undefined') {
        const keysToSave = Object.keys(memoryCache);
        // Only keep reasonably sized subset in localStorage as safety net
        const smallBackup: Record<string, string> = {};
        for (const k of keysToSave) {
          if (memoryCache[k].length < 500000) {
            smallBackup[k] = memoryCache[k];
          }
        }
        localStorage.setItem('winbridge_custom_photos', JSON.stringify(smallBackup));
      }
    } catch {
      // Ignore localStorage quota errors since IndexedDB handles full storage
    }
  } catch (err) {
    console.error('Error saving image to IndexedDB:', err);
  }
}

/**
 * Get image synchronously from memory cache (with fallback to storage)
 */
export function getStoredImageSync(key: string): string | null {
  return memoryCache[key] || null;
}

/**
 * Remove an image from storage
 */
export async function removeStoredImage(key: string): Promise<void> {
  delete memoryCache[key];
  notifyListeners();

  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);

    if (typeof localStorage !== 'undefined') {
      const smallBackup = { ...memoryCache };
      localStorage.setItem('winbridge_custom_photos', JSON.stringify(smallBackup));
    }
  } catch (err) {
    console.error('Error removing image from IndexedDB:', err);
  }
}

/**
 * Clear all stored custom images
 */
export async function clearAllStoredImages(): Promise<void> {
  Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
  notifyListeners();

  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('winbridge_custom_photos');
    }
  } catch (err) {
    console.error('Error clearing images from IndexedDB:', err);
  }
}

/**
 * Optimize and compress an uploaded image file into a crisp high-res Data URL
 */
export function processAndOptimizeImage(
  file: File,
  maxDimension = 1400,
  quality = 0.92
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (readerEvent) => {
      const rawDataUrl = readerEvent.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('Empty file content'));
        return;
      }

      // For SVG or GIF images, preserve directly without canvas re-rasterization
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl); // Fallback to raw if decoding fails
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Output high-quality image
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(outputType, quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * React Hook: Returns all currently stored custom images and stays live updated
 */
export function useCustomPhotos(): Record<string, string> {
  const [photos, setPhotos] = useState<Record<string, string>>(() => ({ ...memoryCache }));

  useEffect(() => {
    // Initial fetch to ensure IndexedDB has loaded
    initImageStorage().then((loaded) => {
      setPhotos({ ...loaded });
    });

    const handleUpdate = (updated: Record<string, string>) => {
      setPhotos({ ...updated });
    };

    listeners.add(handleUpdate);

    const handleWindowEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Record<string, string>>;
      if (customEvent.detail) {
        setPhotos({ ...customEvent.detail });
      }
    };

    window.addEventListener('winbridge_photos_changed', handleWindowEvent);

    return () => {
      listeners.delete(handleUpdate);
      window.removeEventListener('winbridge_photos_changed', handleWindowEvent);
    };
  }, []);

  return photos;
}

/**
 * React Hook: Single photo binding with save and remove actions
 */
export function usePresenterPhoto(presenterId: string) {
  const photos = useCustomPhotos();
  const photoUrl = photos[presenterId] || null;

  const savePhoto = useCallback(
    async (fileOrDataUrl: File | string) => {
      let finalDataUrl: string;
      if (typeof fileOrDataUrl === 'string') {
        finalDataUrl = fileOrDataUrl;
      } else {
        finalDataUrl = await processAndOptimizeImage(fileOrDataUrl);
      }
      await saveStoredImage(presenterId, finalDataUrl);
      return finalDataUrl;
    },
    [presenterId]
  );

  const removePhoto = useCallback(async () => {
    await removeStoredImage(presenterId);
  }, [presenterId]);

  return {
    photoUrl,
    hasCustomPhoto: !!photoUrl,
    savePhoto,
    removePhoto,
  };
}
