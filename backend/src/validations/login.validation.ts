import { z } from 'zod'

const loginValidation = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(100),
})

export default loginValidation
