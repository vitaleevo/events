import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listCurriculum = query({
    handler: async (ctx) => {
        // Fetch all and sort in memory to avoid "index not ready" errors during dev
        const modules = await ctx.db.query("curriculum").collect();
        return modules.sort((a, b) => a.order - b.order);
    },
});

export const createModule = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        icon: v.string(),
        order: v.number(),
        eventId: v.optional(v.id("events")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("curriculum", args);
    },
});

export const updateModule = mutation({
    args: {
        id: v.id("curriculum"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        return await ctx.db.patch(id, updates);
    },
});

export const deleteModule = mutation({
    args: { id: v.id("curriculum") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});
