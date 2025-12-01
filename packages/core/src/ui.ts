export type StaticUIOptions = {
	assetsPath: string;
	basePath: string;
	htmlContent: string;
	serverPath: string;
}

export type StaticUIConfig = StaticUIOptions;

export function defineStaticUI(options: StaticUIOptions): StaticUIConfig {
	return options;
}