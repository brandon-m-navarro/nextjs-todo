// Generate a random ID
export function generateId(prefix:string, length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + '-' + result;
}

// Format a timestamp to a readable date string
export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Validate if a string is a valid hex color
export function isValidHexColor(hex: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!isValidHexColor(hex)) return null;

    let cleanedHex = hex.replace('#', '');
    if (cleanedHex.length === 3) {
        cleanedHex = cleanedHex.split('').map(c => c + c).join('');
    }

    const bigint = parseInt(cleanedHex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

// Convert RGB to hex color
export function rgbToHex(r: number, g: number, b: number): string {
    return (
        '#' +
        [r, g, b]
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    );
}

// Generate a random hex color
export function generateRandomHexColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return rgbToHex(r, g, b);
}

// Clamp a number between min and max
export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

// Debounce function to limit how often a function can fire
export function debounce<Func extends (...args: any[]) => void>(func: Func, wait: number): (...args: Parameters<Func>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<Func>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Throttle function to ensure a function is called at most once in a specified time
export function throttle<Func extends (...args: any[]) => void>(func: Func, limit: number): (...args: Parameters<Func>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<Func>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Deep clone an object or array
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// Compare two objects or arrays for deep equality
export function deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
