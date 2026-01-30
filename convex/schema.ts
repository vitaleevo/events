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

    content: defineTable({
        key: v.string(), // e.g., 'hero', 'curriculum'
        data: v.any(),   // Store structured JSON content
        lastUpdated: v.number(),
    }).index("by_key", ["key"]),

    assets: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        storageId: v.id("_storage"),
        fileUrl: v.string(),
        type: v.string(), // 'Flyer', 'Document', etc
        timestamp: v.number(),
    }),
});
