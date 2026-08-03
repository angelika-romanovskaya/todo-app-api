export class LocalStorageService {
	static get<T>(key: string, defaultValue: T): T {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);
			return defaultValue;
		}
	}

	static set<T>(key: string, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting localStorage key "${key}":`, error);
		}
	}

	static remove<T>(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error setting localStorage key "${key}":`, error);
		}
	}
}
