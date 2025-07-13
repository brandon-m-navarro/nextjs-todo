/**
 * Local Storage Utility Functions
 * Provides functions to get, set, clear, and update data in local storage.
 * It also checks for the availability of local storage.
 */

export const LS_VERSION = '1.0.0'; // Version of the local storage schema
const LS_KEY = 'appData';          // Key under which data is stored in local storage

// Get local storage data for the application
export function getLocalStorageData(): any {
  const data = localStorage.getItem(LS_KEY);
  return data ? JSON.parse(data) : null;
}

// Set local storage data for the application
export function setLocalStorageData(data: any): void {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Clear local storage data for the application
export function clearLocalStorageData(): void {
  localStorage.removeItem(LS_KEY);
}

// Update local storage data using a callback function
export function updateLocalStorageData(updater: (data: any) => any): void {
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
  } catch (e) {
    return false;
  }
}

// Check if local storage is available in the current environment
export function isLocalStorageAvailable(): boolean {
  return typeof localStorage !== 'undefined' && hasLocalStorage();
}

// export function removeLocalStorageData(key: string): void {
//   const currentData = getLocalStorageData();
//   if (currentData && key in currentData) {
//     delete currentData[key];
//     setLocalStorageData(currentData);
//   }
// }
// export function getLocalStorageItem(key: string): any {
//   const data = getLocalStorageData();
//   return data ? data[key] : null;
// }
// export function setLocalStorageItem(key: string, value: any): void {
//   updateLocalStorageData((data) => {
//     if (!data) data = {};
//     data[key] = value;
//     return data;
//   });
// }
// export function removeLocalStorageItem(key: string): void {
//   updateLocalStorageData((data) => {
//     if (data && key in data) {
//       delete data[key];
//     }
//     return data;
//   });
// }

// export function getLocalStorageKeys(): string[] {
//   const data = getLocalStorageData();
//   return data ? Object.keys(data) : [];
// }
// export function getLocalStorageValues(): any[] {
//   const data = getLocalStorageData();
//   return data ? Object.values(data) : [];
// }
// export function getLocalStorageEntries(): [string, any][] {
//   const data = getLocalStorageData();
//   return data ? Object.entries(data) : [];
// }

// export function localStorageIsEmpty(): boolean {
//   const data = getLocalStorageData();
//   return !data || Object.keys(data).length === 0;
// }
// export function localStorageLength(): number {
//   const data = getLocalStorageData();
//   return data ? Object.keys(data).length : 0;
// }
