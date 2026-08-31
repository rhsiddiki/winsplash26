/**
 * Real-Time Cloud & Local Image Storage Service for Winbridge Annual Presentation
 * Synchronizes custom photos across all PCs and devices in real-time using Firebase Firestore,
 * with IndexedDB caching for offline resilience and instant zero-latency memory rendering.
 */

import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

const DB_NAME = 'WinbridgePresentationDB';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_photos';
const FIRESTORE_COLLECTION = 'custom_photos';

// In-memory cache for synchronous instant rendering
const memoryCache: Record<string, string> = {};
let isDbInitialized = false;
let isFirestoreListening = false;
const listeners = new Set<(photos: Record<string, string>) => void>();
const syncStatusListeners = new Set<(status: 'synced' | 'syncing' | 'offline' | 'error') => void>();
let currentSyncStatus: 'synced' | 'syncing' | 'offline' | 'error' = 'syncing';

function setSyncStatus(status: 'synced' | 'syncing' | 'offline' | 'error') {
  currentSyncStatus = status;
  syncStatusListeners.forEach((listener) => {
    try {
      listener(status);
    } catch (err) {
      console.error('Error notifying sync status listener', err);
    }
  });
}

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
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
 * Save to local IndexedDB
 */
async function saveToIndexedDB(key: string, dataUrl: string) {
  try {
    const localDb = await openDB();
    const transaction = localDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ id: key, dataUrl, updatedAt: Date.now() });
  } catch (err) {
    console.warn('Failed to save photo to IndexedDB:', err);
  }
}

/**
 * Delete from local IndexedDB
 */
async function deleteFromIndexedDB(key: string) {
  try {
    const localDb = await openDB();
    const transaction = localDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);
  } catch (err) {
    console.warn('Failed to delete photo from IndexedDB:', err);
  }
}

/**
 * Setup Real-time Firestore Cloud Listener
 */
function setupFirestoreListener() {
  if (isFirestoreListening || !db) return;
  isFirestoreListening = true;
  setSyncStatus('syncing');

  try {
    const photosCol = collection(db, FIRESTORE_COLLECTION);
    onSnapshot(
      photosCol,
      (snapshot) => {
        let hasChanges = false;
        const currentDocIds = new Set<string>();

        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as { id?: string; dataUrl?: string };
          const photoId = docSnapshot.id;
          currentDocIds.add(photoId);

          if (data && data.dataUrl) {
            if (memoryCache[photoId] !== data.dataUrl) {
              memoryCache[photoId] = data.dataUrl;
              saveToIndexedDB(photoId, data.dataUrl);
              hasChanges = true;
            }
          }
        });

        // Detect if any document was removed in Firestore
        // (Only remove if we had remote keys that are no longer in Firestore)
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed') {
            const removedId = change.doc.id;
            if (memoryCache[removedId]) {
              delete memoryCache[removedId];
              deleteFromIndexedDB(removedId);
              hasChanges = true;
            }
          }
        });

        setSyncStatus('synced');
        if (hasChanges) {
          notifyListeners();
        }
      },
      (error) => {
        console.error('Firestore real-time sync error:', error);
        setSyncStatus('error');
      }
    );
  } catch (err) {
    console.error('Failed to setup Firestore listener:', err);
    setSyncStatus('offline');
  }
}

/**
 * Initialize storage: Preloads local storage first, then connects to cloud Firestore
 */
export async function initImageStorage(): Promise<Record<string, string>> {
  if (!isDbInitialized) {
    try {
      // 1. Load from IndexedDB for instant UI paint
      const localDb = await openDB();
      const transaction = localDb.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllReq = store.getAll();

      await new Promise<void>((resolve) => {
        getAllReq.onsuccess = () => {
          const items = getAllReq.result as { id: string; dataUrl: string }[];
          if (items && Array.isArray(items)) {
            items.forEach((item) => {
              if (item.id && item.dataUrl && !memoryCache[item.id]) {
                memoryCache[item.id] = item.dataUrl;
              }
            });
          }
          resolve();
        };
        getAllReq.onerror = () => resolve();
      });
    } catch (err) {
      console.warn('IndexedDB initial load skipped or not available', err);
    }

    isDbInitialized = true;
    notifyListeners();
  }

  // 2. Attach Firestore real-time sync
  if (typeof window !== 'undefined' && db) {
    setupFirestoreListener();
  }

  return { ...memoryCache };
}

// Auto-run init on module load in browser
if (typeof window !== 'undefined') {
  initImageStorage().catch(console.error);
}

/**
 * Save an image to memory, IndexedDB, AND Cloud Firestore
 */
export async function saveStoredImage(key: string, dataUrl: string): Promise<void> {
  // Update memory & local cache immediately for zero latency
  memoryCache[key] = dataUrl;
  notifyListeners();
  setSyncStatus('syncing');

  // Save to local IndexedDB
  await saveToIndexedDB(key, dataUrl);

  // Sync to Cloud Firestore
  if (db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, key);
      await setDoc(docRef, {
        id: key,
        dataUrl,
        updatedAt: Date.now(),
      });
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error saving image to Cloud Firestore:', err);
      setSyncStatus('error');
    }
  }
}

/**
 * Get image synchronously from memory cache
 */
export function getStoredImageSync(key: string): string | null {
  return memoryCache[key] || null;
}

/**
 * Remove an image from storage and Cloud Firestore
 */
export async function removeStoredImage(key: string): Promise<void> {
  delete memoryCache[key];
  notifyListeners();
  setSyncStatus('syncing');

  await deleteFromIndexedDB(key);

  if (db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, key);
      await deleteDoc(docRef);
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error removing image from Cloud Firestore:', err);
      setSyncStatus('error');
    }
  }
}

/**
 * Optimize and compress an uploaded image file into a crisp high-res Data URL safe for cloud sync (<800KB)
 */
export function processAndOptimizeImage(
  file: File,
  maxDimension = 1200,
  quality = 0.88
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

      // For SVG or GIF images under 800KB, preserve directly
      if ((file.type === 'image/svg+xml' || file.type === 'image/gif') && rawDataUrl.length < 800000) {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
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

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Output high-quality JPEG for optimal cloud payload size
          let optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);

          // If still large (>800KB), perform additional compression pass
          if (optimizedDataUrl.length > 800000) {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          }

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
 * React Hook: Returns all currently stored custom images and stays live updated with Cloud Firestore
 */
export function useCustomPhotos(): Record<string, string> {
  const [photos, setPhotos] = useState<Record<string, string>>(() => ({ ...memoryCache }));

  useEffect(() => {
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
 * React Hook: Cloud Sync Status indicator ('synced' | 'syncing' | 'offline' | 'error')
 */
export function useCloudSyncStatus() {
  const [status, setStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>(currentSyncStatus);

  useEffect(() => {
    const handleStatusChange = (newStatus: 'synced' | 'syncing' | 'offline' | 'error') => {
      setStatus(newStatus);
    };
    syncStatusListeners.add(handleStatusChange);
    return () => {
      syncStatusListeners.delete(handleStatusChange);
    };
  }, []);

  return status;
}

/**
 * React Hook: Single photo binding with save and remove actions (Real-Time Cloud Synced)
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
