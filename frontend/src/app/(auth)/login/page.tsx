import LoginForm from "@/components/auth/login-form"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
