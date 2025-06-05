"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SignUpSchema } from "./zodSchemas"
import { AuthError } from 'next-auth';
import { signIn } from '../auth';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type State = {
    errors?: {
        email?: string[];
        fullName?: string[];
        password?: string[];
        phoneNumber?: string[];
    };
    message?: string | null;
    isLoading?: boolean;
    serverError?:string;
};

export async function registerUser(prevState: State, formData: FormData) {
    const validatedFields = SignUpSchema.safeParse({
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        password: formData.get('password'),
        phoneNumber: formData.get('phoneNumber'),
    });

    // If form validation fails, return errors early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
            isLoading: false,  // Stop loading as validation failed
            serverError: '',   // No server error, since validation failed
        };
    }

    // Start loading state
    let isLoading = true;
    let serverError = '';

    try {
        const response = await fetch(baseUrl + '/users/signup', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedFields.data),
        });

        if (!response.ok) {
            const errorData: { detail?: string } = await response.json();
            serverError = errorData.detail || 'Failed to create user.';
            isLoading = false;  // Stop loading on error
        } else {
            // Successful response, stop loading, revalidate cache, and redirect
            revalidatePath('/login');
            redirect('/login');

            return {
                errors: {},
                message: 'User successfully created! Redirecting to login...',
                isLoading: false,  // Stop loading
                serverError: '',   // No error
            };
        }
    } catch (error) {
        serverError = 'Unexpected Error. Please try again later.';
        isLoading = false;  // Stop loading on error
    }

    return {
        errors: {},
        message: serverError || 'Something went wrong.',
        isLoading,          // Provide the correct loading state
        serverError,
    };
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } 
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}