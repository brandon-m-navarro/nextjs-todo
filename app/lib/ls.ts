/**
 * Local Storage Utility Functions
 * Provides functions to get, set, clear, and update data in local storage.
 * It also checks for the availability of local storage.
 */

export const LS_VERSION = '1.0.0'; // Version of the local storage schema
const LS_KEY = 'appData';          // Key under which data is stored in local storage

// Define the structure of your stored data
export interface AppData {
  // Add your specific data structure here
  // Example:
  // user?: { id: string; name: string };
  // tasks?: Array<{ id: string; title: string }>;
  // projects?: Array<{ id: string; name: string }>;
  // Add any other properties you store
  [key: string]: unknown; // Flexible structure if you don't know exact shape
}

// Get local storage data for the application
export function getLocalStorageData(): AppData | null {
  const data = localStorage.getItem(LS_KEY);
  return data ? JSON.parse(data) as AppData : null;
}

// Set local storage data for the application
export function setLocalStorageData(data: AppData): void {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Clear local storage data for the application
export function clearLocalStorageData(): void {
  localStorage.removeItem(LS_KEY);
}

// Update local storage data using a callback function
export function updateLocalStorageData(updater: (data: AppData | null) => AppData): void {
  const currentData = getLocalStorageData();
  const updatedData = updater(currentData);
  setLocalStorageData(updatedData);
}

// Clear all local storage data
export function clearLocalStorage(): void {
  localStorage.clear();
}

// Check if local storage is available and functional
export function hasLocalStorage(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Check if local storage is available in the current environment
export function isLocalStorageAvailable(): boolean {
  return typeof localStorage !== 'undefined' && hasLocalStorage();
}