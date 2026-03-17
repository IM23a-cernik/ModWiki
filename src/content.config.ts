import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
    name: z.string(),
    mod: z.string().optional(),
    icon: z.string().optional(),
});

const items = defineCollection({
    loader: glob({ pattern: "*/items/*.md", base: "./src/content" }),
    schema: baseSchema.extend({
        durability: z.number().optional(),
        tier: z.string().optional(),
    }),
});

const blocks = defineCollection({
    loader: glob({ pattern: "*/blocks/*.md", base: "./src/content" }),
    schema: baseSchema,
});

const misc = defineCollection({
    loader: glob({ pattern: "*/misc/*.md", base: "./src/content" }),
    schema: baseSchema,
});

const achievements = defineCollection({
    loader: glob({ pattern: "*/achievements/*.md", base: "./src/content" }),
    schema: baseSchema,
});

const mods = defineCollection({
    loader: glob({ pattern: "*/mod.md", base: "./src/content" }),
    schema: z.object({
        name: z.string(),
        summary: z.string().optional(),
        icon: z.string().optional(),
        themeColor: z.string().optional(),
        modrinth: z.string().url().optional(),
        curseforge: z.string().url().optional(),
    }),
});

export const collections = { achievements, blocks, items, misc, mods };
