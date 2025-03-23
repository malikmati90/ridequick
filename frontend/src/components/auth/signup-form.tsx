"use client";

import { useActionState } from "react";
import { registerUser, State } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';


export default function SignUpForm() {
  const initialState: State = { message: "", errors: {}, isLoading: false, serverError: "" };
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={formAction} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up to start using the platform
                </p>
              </div>

              {/* Full Name */}
              <div className="grid gap-3">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  name="fullName"
                  aria-describedby="fullName-error"
                />
                <div id="fullName-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.fullName &&
                    state.errors.fullName.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  name="email" // Remember to include the 'name' attribute for each field
                  aria-describedby="email-error"
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.email &&
                    state.errors.email.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  aria-describedby="password-error"
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.password &&
                    state.errors.password.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Phone Number */}
              <div className="grid gap-3">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  aria-describedby="phoneNumber-error"
                />
                <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.phoneNumber &&
                    state.errors.phoneNumber.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={state.isLoading}>
                {state.isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

              {state.serverError && <p className="text-red-500 text-center text-sm">{state.serverError}</p>}

              {/* Already have an account */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block" style={{ height: '650px' }}>
            <Image
              src="/tibidabo.jpg"
              width={500} // Aspect ratio width
              height={100} // Aspect ratio height
              className="hidden md:block object-cover w-full h-full"
              alt="Tibidabo Barcelona"
            />
          </div>
        </CardContent>
      </Card>

      {/******************************************************************************/}
      {/* Complete this later, add links to terms and conditions and privacy policy. */}
      {/******************************************************************************/}

      <div className="text-muted-foreground text-center text-xs">
        By signing up, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
