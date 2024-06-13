"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const node_cache_1 = __importDefault(require("node-cache"));
const app = (0, express_1.default)();
const port = 3000;
const cache = new node_cache_1.default({ stdTTL: 600 });
let isLoadingData = false;
let waitingClients = [];
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    updateCache();
    setInterval(updateCache, 5000);
});
async function updateCache() {
    if (!isLoadingData) {
        isLoadingData = true;
        try {
            const response = await axios_1.default.get('https://rest-test-eight.vercel.app/api/test');
            const urls = response.data.items.map(item => item.fileUrl);
            const structuredData = organizeUrls(urls);
            cache.set("structuredData", structuredData);
            console.log("Cache updated successfully!");
            notifyWaitingClients(structuredData);
        }
        catch (error) {
            console.error('Failed to update cache:', error);
        }
        finally {
            isLoadingData = false;
        }
    }
}
app.get('/api/files', async (req, res) => {
    const structuredData = cache.get("structuredData");
    if (structuredData) {
        res.json({ "34.8.32.234": structuredData });
    }
    else {
        waitingClients.push(res);
        if (!isLoadingData) {
            updateCache();
        }
    }
});
function notifyWaitingClients(data) {
    waitingClients.forEach(client => client.json({ "34.8.32.234": data }));
    waitingClients = [];
}
function organizeUrls(urls) {
    const root = {};
    urls.forEach(url => {
        const parts = url.replace('http://34.8.32.234:4183/', '').split('/');
        let current = root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = i === parts.length - 1 ? [] : {};
            }
            if (i !== parts.length - 1) {
                current = current[part];
            }
            else {
                current[part].push(part);
            }
        }
    });
    return root;
}
