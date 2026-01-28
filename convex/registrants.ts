import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRegistrant = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
    },
    handler: async (ctx: any, args: any) => {
        // Check for 100 registrants limit
        const registrants = await ctx.db.query("registrants").collect();
        if (registrants.length >= 100) {
            throw new Error("LIMIT_REACHED");
        }

        const id = await ctx.db.insert("registrants", {
            name: args.name,
            email: args.email,
            phone: args.phone,
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
