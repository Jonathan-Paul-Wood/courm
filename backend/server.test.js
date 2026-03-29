const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

test('server starts successfully', async () => {
    await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, ['server.js'], {
            cwd: __dirname,
            env: {
                ...process.env,
                PORT: '0'
            },
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let settled = false;
        const timeout = setTimeout(() => {
            if (!settled) {
                settled = true;
                child.kill();
                reject(new Error('Timed out waiting for server startup'));
            }
        }, 10000);

        const finish = (error) => {
            if (settled) {
                return;
            }

            settled = true;
            clearTimeout(timeout);
            child.kill();

            if (error) {
                reject(error);
                return;
            }

            resolve();
        };

        child.stdout.on('data', (chunk) => {
            if (chunk.toString().includes('Server is running at http://localhost:0/')) {
                finish();
            }
        });

        child.stderr.on('data', (chunk) => {
            finish(new Error(chunk.toString()));
        });

        child.on('exit', (code) => {
            if (!settled && code !== 0 && code !== null) {
                finish(new Error(`Server exited with code ${code}`));
            }
        });
    });

    assert.ok(true);
});
