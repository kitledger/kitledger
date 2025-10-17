// unified-worker.ts
import { isMainThread } from 'node:worker_threads';
import { fileURLToPath } from 'node:url'; // 1. Import this
import { FixedThreadPool, ThreadWorker } from "poolifier";
import { workerConfig } from "../../config.js"; // Adjust path as needed
import { hashPassword } from "../../domain/auth/utils.js"; // Adjust path as needed

// --- Worker Logic ---
export enum availableWorkerTasks {
    HASH_PASSWORD = "HASH_PASSWORD",
}

const tasks = {
    [availableWorkerTasks.HASH_PASSWORD]: async (data: string | undefined) => {
        if (data) {
            return await hashPassword(data);
        }
    },
};

export default new ThreadWorker(tasks, { maxInactiveTime: 60000 });

// --- Main Thread Logic ---

// 2. Convert the URL to a standard file path string
const __filename = fileURLToPath(import.meta.url);

console.log('File path for worker:', __filename);

export const workerPool = isMainThread
  ? new FixedThreadPool(
      workerConfig.poolSize,
      __filename // 3. Pass the string path here
    )
  : null;