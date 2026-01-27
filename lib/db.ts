import fs from 'fs';
import path from 'path';
import { Subscription } from './types';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'subscribers.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH);
}

// Ensure db file exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

export const db = {
    getAll: (): Subscription[] => {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    },

    add: (subscriber: Omit<Subscription, 'id' | 'timestamp' | 'status'>) => {
        const current = db.getAll();
        const newSub: Subscription = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            status: 'Pending',
            ...subscriber
        };
        current.push(newSub);
        fs.writeFileSync(DB_FILE, JSON.stringify(current, null, 2));
        return newSub;
    },

    delete: (id: string) => {
        const current = db.getAll();
        const updated = current.filter(s => s.id !== id);
        fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2));
    },

    updateStatus: (id: string, status: string) => {
        const current = db.getAll();
        const index = current.findIndex(s => s.id === id);
        if (index !== -1) {
            current[index].status = status;
            fs.writeFileSync(DB_FILE, JSON.stringify(current, null, 2));
            return current[index];
        }
        return null;
    }
};
