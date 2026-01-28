import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple password verification on the server side
// Ideally, this password should be set in Convex Environment Variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_masterclass_2026";

export const verifyAdmin = query({
    args: { password: v.string() },
    handler: async (ctx: any, args: any) => {
        return args.password === ADMIN_PASSWORD;
    },
});
