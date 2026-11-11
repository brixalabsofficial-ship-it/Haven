import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface HavenDB extends DBSchema {
  images: {
    key: string;
    value: {
      id: string;
      dataUrl: string;
      name: string;
      mimeType: string;
      size: number;
      createdAt: number;
    };
  };
}

const DB_NAME = 'haven_image_store';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<HavenDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<HavenDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export const imageStorage = {
  async saveImage(id: string, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const db = await getDB();
          await db.put('images', {
            id,
            dataUrl,
            name: file.name,
            mimeType: file.type,
            size: file.size,
            createdAt: Date.now(),
          });
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  async getImage(id: string): Promise<string | null> {
    try {
      const db = await getDB();
      const record = await db.get('images', id);
      return record ? record.dataUrl : null;
    } catch {
      return null;
    }
  },

  async deleteImage(id: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('images', id);
    } catch (err) {
      console.error('Error deleting image from IDB:', err);
    }
  },

  async clearAllImages(): Promise<void> {
    try {
      const db = await getDB();
      await db.clear('images');
    } catch (err) {
      console.error('Error clearing images from IDB:', err);
    }
  },
};
