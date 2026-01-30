/**
 * Type definition for static UI configuration options.
 * 
 * @returns An object containing the static UI configuration options.
 */
export type StaticUIOptions = {
	assetsPath: string;
	basePath: string;
	htmlContent: string;
	serverPath: string;
};

/**
 * Type definition for static UI configuration.
 * 
 * @returns An object containing the static UI configuration.
 */
export type StaticUIConfig = StaticUIOptions;

/**
 * Factory function to define static UI configuration.
 * 
 * @param options 
 * @returns 
 */
export function defineStaticUI(options: StaticUIOptions): StaticUIConfig {
	return options;
}
