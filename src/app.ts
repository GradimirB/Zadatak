import express, { Request, Response } from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const app = express();
const port = 3000;

const cache = new NodeCache({ stdTTL: 600 });
let isLoadingData = false;
let waitingClients: Response[] = []; 

interface DirectoryStructure {
    [key: string]: DirectoryStructure | string[];
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    updateCache();  
    setInterval(updateCache,5000)
});

 

async function updateCache() {
    if (!isLoadingData) {
        isLoadingData = true;
        try {
            const response = await axios.get<{ items: { fileUrl: string }[] }>('https://rest-test-eight.vercel.app/api/test');
            const urls = response.data.items.map(item => item.fileUrl);
            const structuredData = organizeUrls(urls);
            cache.set("structuredData", structuredData);
            console.log("Cache updated successfully!");
            notifyWaitingClients(structuredData);  
        } catch (error) {
            console.error('Failed to update cache:', error);
        } finally {
            isLoadingData = false;
        }
    }
}

app.get('/api/files', async (req: Request, res: Response) => {
    const structuredData = cache.get<DirectoryStructure>("structuredData");
    if (structuredData) {
        res.json({ "34.8.32.234": structuredData });
    } else {
        waitingClients.push(res);  
        if (!isLoadingData) {
            updateCache();  
        }
    }
});

function notifyWaitingClients(data: DirectoryStructure) {
    waitingClients.forEach(client => client.json({ "34.8.32.234": data }));
    waitingClients = [];  
}

function organizeUrls(urls: string[]): DirectoryStructure {
    const root: DirectoryStructure = {};

    urls.forEach(url => {
        const parts = url.replace('http://34.8.32.234:4183/', '').split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = i === parts.length - 1 ? [] : {};
            }
            if (i !== parts.length - 1) {
                current = current[part] as DirectoryStructure;
            } else {
                (current[part] as string[]).push(part);
            }
        }
    });

    return root;
}