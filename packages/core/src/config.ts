import { cpus } from "node:os";

/*
 * 1) Define the types
 */

type CorsConfig = {
	origin: string | string[];
	allowMethods?: string[];
	allowHeaders?: string[];
	maxAge?: number;
	credentials?: boolean;
	exposeHeaders?: string[];
};

type ServerConfig = {
	port: number;
	cors: CorsConfig;
};

type WorkerConfig = {
	poolSize: number;
	taskTimeout: number;
	maxQueueSize: number;
};

/**
 * CORS configuration values and defaults.
 */
const corsDefaultHeaders = ["Content-Type", "Authorization", "X-Requested-With"];
const corsAllowedHeaders = [
	...new Set([...corsDefaultHeaders, ...(process.env.KL_CORS_ALLOWED_HEADERS?.split(",") || [])]),
];
const corsAllowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
const corsAllowedOrigins = process.env.KL_CORS_ALLOWED_ORIGINS ? process.env.KL_CORS_ALLOWED_ORIGINS.split(",") : "*";
const corsCredentials = false;
const corsExposeHeaders: string[] = [];
const corsMaxAge = parseInt(process.env.KL_CORS_MAX_AGE || "86400");

/**
 * Worker pool configuration values and defaults.
 */
const workerPoolSize = parseInt(process.env.KL_WORKER_POOL_SIZE || String(cpus().length)) || 1;
const workerTaskTimeout = parseInt(process.env.KL_WORKER_TASK_TIMEOUT || "5000"); // Default to 5 seconds
const workerMaxQueueSize = process.env.KL_WORKER_MAX_QUEUE_SIZE
	? parseInt(process.env.KL_WORKER_MAX_QUEUE_SIZE)
	: Infinity;

/*
 * 3) Export the configuration objects.
 */
/**
 * Export pre-assembled configuration values for the HTTP server.
 * Values are a mix of environment variables and defaults.
 */
export const serverConfig: ServerConfig = {
	port: process.env.KL_SERVER_PORT ? parseInt(process.env.KL_SERVER_PORT) : 8888,
	cors: {
		origin: corsAllowedOrigins,
		allowMethods: corsAllowedMethods,
		allowHeaders: corsAllowedHeaders,
		exposeHeaders: corsExposeHeaders,
		credentials: corsCredentials,
		maxAge: corsMaxAge,
	},
};

/**
 * Export pre-assembled configuration values for the worker pool.
 * Values are a mix of environment variables and defaults.
 */
export const workerConfig: WorkerConfig = {
	poolSize: workerPoolSize,
	taskTimeout: workerTaskTimeout,
	maxQueueSize: workerMaxQueueSize,
};
