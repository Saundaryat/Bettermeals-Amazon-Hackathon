import * as z from 'zod';

export const registrationSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),

  whatsappNumber: z.string()
    .min(12, 'Please enter a valid WhatsApp number')
    .max(12, 'Please enter a valid WhatsApp number')
    .regex(/^91[0-9]{10}$/, 'Please enter a valid Indian WhatsApp number (+91XXXXXXXXXX)'),

  location: z.string().optional(),

  place_id: z.string().optional(),

  city: z.string()
    .min(1, 'Please select your city'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  confirmPassword: z.string(),

  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must agree to the Terms of Service'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const registrationSchemaSimple = z.object({
  email: z.string()
    .email('Please enter a valid email address'),

  whatsappNumber: z.string()
    .min(12, 'Please enter a valid WhatsApp number')
    .max(12, 'Please enter a valid WhatsApp number')
    .regex(/^91[0-9]{10}$/, 'Please enter a valid Indian WhatsApp number (+91XXXXXXXXXX)'),

  // City and Location are optional/not present in simplified flow
  city: z.string().optional(),
  location: z.string().optional(),
  place_id: z.string().optional(),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  confirmPassword: z.string(),

  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must agree to the Terms of Service'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegistrationFormData = z.infer<typeof registrationSchema> | z.infer<typeof registrationSchemaSimple>;
