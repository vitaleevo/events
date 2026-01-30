import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    registrants: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        eventId: v.optional(v.id("events")),
        status: v.string(),
        timestamp: v.number(),
    }).index("by_email", ["email"]).index("by_event", ["eventId"]),

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
        previewUrl: v.optional(v.string()), // Thumbnail or preview
        eventId: v.optional(v.id("events")), // Associate with event
        type: v.string(), // 'Flyer', 'Module', 'Galllery'
        timestamp: v.number(),
    }).index("by_event", ["eventId"]),

    events: defineTable({
        title: v.string(),
        description: v.string(),
        date: v.string(),
        time: v.string(),
        location: v.string(),
        maxRegistrants: v.number(),
        isOpen: v.boolean(),
        slug: v.string(), // e.g. 'masterclass-2026'
        status: v.string(), // 'upcoming', 'ongoing', 'completed'
    }).index("by_slug", ["slug"]).index("by_open", ["isOpen"]),
});
