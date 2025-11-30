import { Hono } from 'hono';
import { type KitledgerConfig } from '@kitledger/core';
import { StaticUIConfig } from '@kitledger/core/ui';

export type ServerOptions = {
	systemConfig: KitledgerConfig;
	path: string;
	staticPaths?: string[];
	staticUIs?: StaticUIConfig[];
}

export type ServerConfig = ServerOptions;

export function defineServerConfig(options: ServerOptions): ServerConfig {
	return options;
}

export function createBaseServer(config: ServerConfig) {
	const baseServer = new Hono();

	baseServer.get(`${config.path}/transactions/models`, (c) => {
		return c.json(config.systemConfig.transactionModels);
	});

	baseServer.get(`${config.path}/entities/models`, (c) => {
		return c.json(config.systemConfig.entityModels);
	});

	return baseServer;
}
