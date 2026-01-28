import { query } from "./_generated/server";
import { v } from "convex/values";

// Admin password - Change this to a secure password in production!
// Note: For production, consider using Convex Auth or environment variables
// set via `npx convex env set ADMIN_PASSWORD your_secure_password`
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_masterclass_2026";

export const verifyAdmin = query({
    args: { password: v.string() },
    handler: async (_ctx, args) => {
        return args.password === ADMIN_PASSWORD;
    },
});
