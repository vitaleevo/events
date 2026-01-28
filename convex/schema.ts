import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    registrants: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        status: v.string(),
        timestamp: v.number(),
    }).index("by_email", ["email"]),
});
