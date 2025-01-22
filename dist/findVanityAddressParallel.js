"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const os = __importStar(require("os"));
const path = __importStar(require("path"));
async function runWorker(workerId) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path.join(__dirname, 'vanityWorker.js'));
        worker.on('message', (message) => {
            if (message.found) {
                worker.terminate();
                resolve();
            }
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker ${workerId} stopped with exit code ${code}`));
            }
        });
    });
}
async function main() {
    const numCPUs = os.cpus().length;
    console.log(`Starting ${numCPUs} worker threads...`);
    const startTime = Date.now();
    let totalAttempts = 0;
    // Create a worker for each CPU core
    const workers = [];
    const workerPromises = [];
    for (let i = 0; i < numCPUs; i++) {
        const worker = new worker_threads_1.Worker(path.join(__dirname, 'vanityWorker.js'));
        workers.push(worker);
        worker.on('message', (message) => {
            totalAttempts += message.attempts;
            if (totalAttempts % 10000 === 0) {
                const timeElapsed = (Date.now() - startTime) / 1000;
                const rate = totalAttempts / timeElapsed;
                console.log(`Total attempts: ${totalAttempts} (${rate.toFixed(2)} attempts/sec)`);
            }
            if (message.found) {
                console.log('\nFound matching address!');
                console.log('Contract Address:', message.address);
                console.log('Deployer Address:', message.wallet?.address);
                console.log('Private Key:', message.wallet?.privateKey);
                console.log(`\nTime taken: ${(Date.now() - startTime) / 1000} seconds`);
                console.log(`Total attempts: ${totalAttempts}`);
                // Terminate all workers
                workers.forEach(w => w.terminate());
                process.exit(0);
            }
        });
        workerPromises.push(runWorker(i));
    }
    try {
        await Promise.race(workerPromises);
    }
    catch (error) {
        console.error('Error in worker:', error);
        workers.forEach(w => w.terminate());
        process.exit(1);
    }
}
main().catch(error => {
    console.error('Main thread error:', error);
    process.exit(1);
});
