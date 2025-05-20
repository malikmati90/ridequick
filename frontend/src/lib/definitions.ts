

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type User = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  // emailVerified: Date;
};