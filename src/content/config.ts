import { defineCollection, z } from 'astro:content';

const resourcesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    slug: z.string().optional(),
    featured: z.boolean().default(false),
    downloadUrl: z.string().optional(),
    ogImage: z.string().optional()
  })
});

export const collections = {
  resources: resourcesCollection
};
