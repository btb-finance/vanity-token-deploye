const { Worker } = require('worker_threads');
const os = require('os');

/**
 * Configuration for vanity address generation
 * @param {string} prefix - The prefix to search for (e.g., 'BB')
 * @param {string} suffix - The suffix to search for (e.g., 'BB')
 * @param {boolean} caseSensitive - Whether the search should be case sensitive
 * @returns {object} - Configuration object
 */
function getConfig(prefix = 'BB', suffix = 'BB', caseSensitive = false) {
    return {
        prefix: caseSensitive ? prefix : prefix.toLowerCase(),
        suffix: caseSensitive ? suffix : suffix.toLowerCase(),
        caseSensitive
    };
}

function runWorker(workerId, config) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(`
            const { parentPort } = require('worker_threads');
            const { ethers } = require('ethers');

            async function searchForAddress(config) {
                let attempts = 0;
                
                while (true) {
                    const wallet = ethers.Wallet.createRandom();
                    const nonce = 0; // First transaction nonce
                    const address = ethers.utils.getContractAddress({
                        from: wallet.address,
                        nonce: nonce
                    });
                    
                    attempts++;
                    
                    const checksumAddress = ethers.utils.getAddress(address);
                    const compareAddress = config.caseSensitive ? checksumAddress : checksumAddress.toLowerCase();
                    
                    // Check if address matches our pattern
                    if (compareAddress.slice(2, 2 + config.prefix.length) === config.prefix && 
                        compareAddress.slice(-config.suffix.length) === config.suffix) {
                        
                        parentPort.postMessage({
                            found: true,
                            wallet: {
                                address: wallet.address,
                                privateKey: wallet.privateKey
                            },
                            contractAddress: checksumAddress,
                            attempts: attempts
                        });
                        break;
                    }
                    
                    if (attempts % 1000 === 0) {
                        parentPort.postMessage({
                            found: false,
                            attempts: 1000
                        });
                    }
                }
            }

            parentPort.on('message', (config) => {
                searchForAddress(config).catch(error => {
                    console.error('Worker thread error:', error);
                    process.exit(1);
                });
            });
        `, { eval: true });
        
        worker.on('message', (message) => {
            if (message.found) {
                console.log('\nFound matching address!');
                console.log('Contract Address:', message.contractAddress);
                console.log('Deployer Address:', message.wallet.address);
                console.log('Private Key:', message.wallet.privateKey);
                worker.terminate();
                resolve(message);
            } else {
                process.send && process.send(message);
            }
        });
        
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker ${workerId} stopped with exit code ${code}`));
            }
        });

        // Send configuration to worker
        worker.postMessage(config);
        
        return worker;
    });
}

async function main() {
    // Get search configuration
    const config = getConfig(process.argv[2], process.argv[3], process.argv[4] === 'true');
    
    const numCPUs = os.cpus().length;
    console.log(`Starting ${numCPUs} worker threads...`);
    console.log(`Searching for address: ${config.prefix}...${config.suffix}`);
    
    const startTime = Date.now();
    let totalAttempts = 0;
    const workers = [];
    
    for (let i = 0; i < numCPUs; i++) {
        const worker = runWorker(i, config);
        workers.push(worker);
        
        worker.then(message => {
            if (message && message.found) {
                console.log(`\nTime taken: ${(Date.now() - startTime) / 1000} seconds`);
                console.log(`Total attempts: ${totalAttempts + message.attempts}`);
                
                // Save to vanity-addresses.json
                const fs = require('fs');
                const path = require('path');
                const vanityFile = path.join(__dirname, '..', 'vanity-addresses.json');
                
                try {
                    const data = require(vanityFile);
                    const timestamp = new Date().toISOString();
                    
                    data[`vanity_${config.prefix}_${config.suffix}`] = {
                        pattern: `${config.prefix}****${config.suffix}`,
                        privateKey: message.wallet.privateKey,
                        address: message.contractAddress,
                        description: `Vanity contract address (starts with ${config.prefix} and ends with ${config.suffix})`,
                        createdAt: timestamp.split('T')[0],
                        generator: 'scripts/findVanityAddressParallel.js'
                    };
                    
                    fs.writeFileSync(vanityFile, JSON.stringify(data, null, 2));
                    console.log('\nAddress information saved to vanity-addresses.json');
                } catch (error) {
                    console.error('Error saving to vanity-addresses.json:', error);
                }
                
                process.exit(0);
            }
        }).catch(error => {
            console.error('Error in worker:', error);
            process.exit(1);
        });
    }
    
    process.on('message', (message) => {
        if (!message.found) {
            totalAttempts += message.attempts;
            if (totalAttempts % 10000 === 0) {
                const timeElapsed = (Date.now() - startTime) / 1000;
                const rate = totalAttempts / timeElapsed;
                console.log(`Total attempts: ${totalAttempts} (${rate.toFixed(2)} attempts/sec)`);
            }
        }
    });
    
    try {
        await Promise.race(workers);
    } catch (error) {
        console.error('Error in worker:', error);
        process.exit(1);
    }
}

// Check if prefix and suffix are provided
if (process.argv.length < 4) {
    console.log('Usage: node findVanityAddressParallel.js <prefix> <suffix> [caseSensitive]');
    console.log('Example: node findVanityAddressParallel.js BB BB false');
    process.exit(1);
}

main().catch(error => {
    console.error('Main thread error:', error);
    process.exit(1);
});
