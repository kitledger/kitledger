import { cpus } from "node:os";

/*
 * 1) Define the types
 */
type WorkerConfig = {
	poolSize: number;
	taskTimeout: number;
	maxQueueSize: number;
};

/**
 * Worker pool configuration values and defaults.
 */
const workerPoolSize = parseInt(process.env.KL_WORKER_POOL_SIZE || String(cpus().length)) || 1;
const workerTaskTimeout = parseInt(process.env.KL_WORKER_TASK_TIMEOUT || "5000"); // Default to 5 seconds
const workerMaxQueueSize = process.env.KL_WORKER_MAX_QUEUE_SIZE
	? parseInt(process.env.KL_WORKER_MAX_QUEUE_SIZE)
	: Infinity;

/**
 * Export pre-assembled configuration values for the worker pool.
 * Values are a mix of environment variables and defaults.
 */
export const workerConfig: WorkerConfig = {
	poolSize: workerPoolSize,
	taskTimeout: workerTaskTimeout,
	maxQueueSize: workerMaxQueueSize,
};
