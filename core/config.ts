import { AlgorithmTypes } from "hono/utils/jwt/jwa";

/*
 * 1) Define the types
 */

type AuthConfig = {
	secret: string;
	pastSecrets: string[];
	jwtAlgorithm: AlgorithmTypes;
};

type CorsConfig = {
	origin: string | string[];
	allowMethods?: string[];
	allowHeaders?: string[];
	maxAge?: number;
	credentials?: boolean;
	exposeHeaders?: string[];
};

type DbConfig = {
	url: string;
	ssl: boolean;
	max: number;
};

type ServerConfig = {
	port: number;
	cors: CorsConfig;
};

type SessionConfig = {
	ttl: number;
};

type WorkerConfig = {
	poolSize: number;
	taskTimeout: number;
	maxQueueSize: number;
};

/*
 * 2) Define the logic for complex values.
 */

/**
 * Authentication secrets configuration values and defaults.
 */
const jwtAlgorithm = "HS256" as AlgorithmTypes;

const authSecret = process.env.KL_AUTH_SECRET;
if (!authSecret) {
	throw new Error("KL_AUTH_SECRET environment variable is not set.");
}
const pastSecretsString = process.env.KL_AUTH_PAST_SECRETS;
const pastSecrets = pastSecretsString ? pastSecretsString.split(",") : [];

/**
 * CORS configuration values and defaults.
 */
const corsDefaultHeaders = ["Content-Type", "Authorization", "X-Requested-With"];
const corsAllowedHeaders = [
	...new Set([...corsDefaultHeaders, ...(process.env.KL_CORS_ALLOWED_HEADERS?.split(",") || [])]),
];
const corsAllowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
const corsAllowedOrigins = process.env.KL_CORS_ALLOWED_ORIGINS
	? String(process.env.KL_CORS_ALLOWED_ORIGINS).split(",")
	: "*";
const corsCredentials = false;
const corsExposeHeaders: string[] = [];
const corsMaxAge = parseInt(process.env.KL_CORS_MAX_AGE || "86400");

/**
 * Session configuration values and defaults.
 * This is used to manage session lifetimes and time-to-live (TTL).
 */
const sessionTtl = parseInt(process.env.KL_SESSION_TTL || "3600"); // 1 hour default

/**
 * Worker pool configuration values and defaults.
 */
const workerPoolSize = parseInt(process.env.KL_WORKER_POOL_SIZE || String(navigator.hardwareConcurrency)) || 1;
const workerTaskTimeout = parseInt(process.env.KL_WORKER_TASK_TIMEOUT || "5000"); // Default to 5 seconds
const workerMaxQueueSize = process.env.KL_WORKER_MAX_QUEUE_SIZE
	? parseInt(String(process.env.KL_WORKER_MAX_QUEUE_SIZE))
	: Infinity;

/*
 * 3) Export the configuration objects.
 */

/**
 * Export pre-assembled configuration values for authentication.
 * Values are a mix of environment variables and defaults.
 */
export const authConfig: AuthConfig = {
	secret: authSecret,
	pastSecrets: pastSecrets,
	jwtAlgorithm: jwtAlgorithm,
};

/**
 * Export pre-assembled configuration values for the database.
 * Values are a mix of environment variables and defaults.
 */
export const dbConfig: DbConfig = {
	url: process.env.KL_POSTGRES_URL || "postgres://localhost:5432/kitledger",
	ssl: process.env.KL_POSTGRES_SSL === "true",
	max: parseInt(process.env.KL_POSTGRES_MAX_CONNECTIONS || "10"),
};

/**
 * Export pre-assembled configuration values for the HTTP server.
 * Values are a mix of environment variables and defaults.
 */
export const serverConfig: ServerConfig = {
	port: process.env.KL_SERVER_PORT ? parseInt(String(process.env.KL_SERVER_PORT)) : 8888,
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
 * Export pre-assembled configuration values for session management.
 * Values are a mix of environment variables and defaults.
 */
export const sessionConfig: SessionConfig = {
	ttl: sessionTtl,
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
