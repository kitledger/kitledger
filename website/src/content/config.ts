import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		order: z.number().default(0),
		category: z.string().optional(),
	}),
});

const blog = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		author: z.string().default('Kitledger Team'),
		tags: z.array(z.string()).default([]),
		cover: image().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = {
	docs,
	blog,
};