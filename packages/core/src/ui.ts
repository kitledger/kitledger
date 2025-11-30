export type StaticUIOptions = {
	path: string;
	htmlContent: string;
	assetsPath: string;
}

export type StaticUIConfig = StaticUIOptions;

export function defineStaticUI(options: StaticUIOptions): StaticUIConfig {
	return options;
}