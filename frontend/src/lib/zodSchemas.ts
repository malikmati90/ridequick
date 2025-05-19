import { z } from "zod";

const MIN_LENGTH = 8;
const MAX_LENGTH = 40;

export const SignUpSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  
  fullName: z.string()
    .min(3, { message: "Full name must be at least 3 characters long." })
    .max(MAX_LENGTH, { message: `Full name cannot exceed ${MAX_LENGTH} characters.` }),
  
  password: z.string()
    .min(MIN_LENGTH, { message: `Password must be at least ${MIN_LENGTH} characters long.` })
    .max(MAX_LENGTH, { message: `Password cannot exceed ${MAX_LENGTH} characters.` })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[\W_]/, { message: "Password must contain at least one special character." }),
  
  phoneNumber: z.coerce
    .string()
    .max(15, { message: "Phone number is too long." })
    .regex(/^\d+$/, { message: "Phone number should contain only digits." }),
  });


export const formSchema = z.object({
  pickupLocation: z.string().min(MIN_LENGTH, {
    message: "Please select a correct location",
  }),
  destination: z.string().min(MIN_LENGTH, {
    message: "Please select a correct location",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.date({
    required_error: "Please select a time.",
  }),
  passengers: z.string().min(1, {
    message: "Please select number of passengers.",
  }),
})