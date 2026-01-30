import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getContent = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("content")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();
    },
});

export const updateContent = mutation({
    args: {
        key: v.string(),
        data: v.any()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("content")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                data: args.data,
                lastUpdated: Date.now(),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("content", {
                key: args.key,
                data: args.data,
                lastUpdated: Date.now(),
            });
        }
    },
});
