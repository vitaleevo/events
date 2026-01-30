import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveAsset = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        storageId: v.id("_storage"),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        const fileUrl = (await ctx.storage.getUrl(args.storageId))!;
        await ctx.db.insert("assets", {
            title: args.title,
            description: args.description,
            storageId: args.storageId,
            fileUrl: fileUrl,
            type: args.type,
            timestamp: Date.now(),
        });
    },
});

export const listAssets = query({
    handler: async (ctx) => {
        return await ctx.db.query("assets").order("desc").collect();
    },
});

export const deleteAsset = mutation({
    args: { id: v.id("assets") },
    handler: async (ctx, args) => {
        const asset = await ctx.db.get(args.id);
        if (asset) {
            await ctx.storage.delete(asset.storageId);
            await ctx.db.delete(args.id);
        }
    },
});
