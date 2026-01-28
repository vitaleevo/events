import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Subscription } from './types';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const db = {
    getAll: async (): Promise<Subscription[]> => {
        try {
            const registrants = await client.query(api.registrants.listRegistrants);
            return registrants.map((r: any) => ({
                id: r._id,
                name: r.name,
                email: r.email,
                phone: r.phone || '',
                status: r.status,
                timestamp: r.timestamp
            }));
        } catch (error) {
            console.error('Failed to fetch from Convex:', error);
            return [];
        }
    },

    add: async (subscriber: Omit<Subscription, 'id' | 'timestamp' | 'status'>) => {
        try {
            const id = await client.mutation(api.registrants.createRegistrant, {
                name: subscriber.name,
                email: subscriber.email,
                phone: subscriber.phone || undefined
            });
            return {
                id,
                name: subscriber.name,
                email: subscriber.email,
                phone: subscriber.phone || '',
                status: 'Pending',
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Failed to add to Convex:', error);
            throw error;
        }
    },

    delete: async (id: any) => {
        try {
            await client.mutation(api.registrants.deleteRegistrant, { id });
        } catch (error) {
            console.error('Failed to delete from Convex:', error);
        }
    },

    updateStatus: async (id: any, status: string) => {
        try {
            await client.mutation(api.registrants.updateRegistrantStatus, { id, status });
            return true;
        } catch (error) {
            console.error('Failed to update status in Convex:', error);
            return null;
        }
    }
};
