import { z } from "zod";

export const todoValidation = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(2000),
    completed: z.boolean().default(false),
});
