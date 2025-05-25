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


export const placeSchema = z.object({
  formattedAddress: z.string().min(1, "Invalid address"),
  name: z.string().min(1, "Invalid place name"),
  lat: z.number(),
  lng: z.number(),
  types: z.array(z.string()).optional(),
}).strict()
  
export const formSchema = z.object({
  pickupLocation: placeSchema,
  destination: placeSchema,

  date: z.date({
    required_error: "Please select a date.",
  }),

  time: z.date({
    required_error: "Please select a time.",
  }),

  passengers: z.coerce.number().min(1, {
    message: "Please select number of passengers.",
  }),
})
  
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(9, "Phone must be at least 9 digits")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  notes: z.string().max(500).optional(),
})