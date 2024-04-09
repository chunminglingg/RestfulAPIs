import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email().nonempty("Email is required"),
    password: z.string().min(6).nonempty("Password is required"),
});
