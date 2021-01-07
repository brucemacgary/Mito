export enum SETTINGS {
	BLACKLIST = 'BLACKLIST',
	DJ = 'DJ',
}

export interface Settings {
	BLACKLIST: string[];
	DJ: string;
}
