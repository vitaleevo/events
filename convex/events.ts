import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        date: v.string(),
        time: v.string(),
        location: v.string(),
        maxRegistrants: v.number(),
        isOpen: v.boolean(),
        slug: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("events", args);
    },
});

export const listEvents = query({
    handler: async (ctx) => {
        return await ctx.db.query("events").collect();
    },
});

export const getEventBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        if (!args.slug) return null;

        try {
            // Preferred method: use the index for speed and efficiency
            return await ctx.db
                .query("events")
                .withIndex("by_slug", (q) => q.eq("slug", args.slug))
                .first();
        } catch (error) {
            // Fallback: use filter if the index isn't ready or missing in production
            console.error("getEventBySlug fallback to filter:", error);
            return await ctx.db
                .query("events")
                .filter((q) => q.eq(q.field("slug"), args.slug))
                .first();
        }
    },
});

export const getActiveEvent = query({
    handler: async (ctx) => {
        try {
            // Try using the open index
            return await ctx.db
                .query("events")
                .withIndex("by_open", (q) => q.eq("isOpen", true))
                .first();
        } catch (error) {
            // Fallback to filter
            console.error("getActiveEvent fallback to filter:", error);
            return await ctx.db
                .query("events")
                .filter((q) => q.eq(q.field("isOpen"), true))
                .first();
        }
    },
});

export const getEventById = query({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const updateEvent = mutation({
    args: {
        id: v.id("events"),
        updates: v.object({
            title: v.optional(v.string()),
            description: v.optional(v.string()),
            date: v.optional(v.string()),
            time: v.optional(v.string()),
            location: v.optional(v.string()),
            maxRegistrants: v.optional(v.number()),
            isOpen: v.optional(v.boolean()),
            status: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});

export const deleteEvent = mutation({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
