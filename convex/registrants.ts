import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRegistrant = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        eventId: v.optional(v.id("events")),
    },
    handler: async (ctx: any, args: any) => {
        // If eventId is provided, check that event's limit
        if (args.eventId) {
            const event = await ctx.db.get(args.eventId);
            if (!event) throw new Error("EVENT_NOT_FOUND");
            if (!event.isOpen) throw new Error("EVENT_CLOSED");

            const count = (await ctx.db.query("registrants")
                .filter((q: any) => q.eq(q.field("eventId"), args.eventId))
                .collect()).length;

            if (count >= event.maxRegistrants) {
                throw new Error("LIMIT_REACHED");
            }
        } else {
            // Legacy global limit check
            const registrants = await ctx.db.query("registrants").collect();
            if (registrants.length >= 100) {
                throw new Error("LIMIT_REACHED");
            }
        }

        const id = await ctx.db.insert("registrants", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            eventId: args.eventId,
            status: "Pending",
            timestamp: Date.now(),
        });
        return id;
    },
});

export const listRegistrants = query({
    args: {},
    handler: async (ctx: any) => {
        return await ctx.db.query("registrants").order("desc").collect();
    },
});

export const getRegistrantCount = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const registrants = await ctx.db
            .query("registrants")
            .filter((q: any) => q.eq(q.field("eventId"), args.eventId))
            .collect();
        return registrants.length;
    },
});

export const updateRegistrantStatus = mutation({
    args: {
        id: v.id("registrants"),
        status: v.string(),
    },
    handler: async (ctx: any, args: any) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const deleteRegistrant = mutation({
    args: {
        id: v.id("registrants"),
    },
    handler: async (ctx: any, args: any) => {
        await ctx.db.delete(args.id);
    },
});
