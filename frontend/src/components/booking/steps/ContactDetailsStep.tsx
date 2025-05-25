'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema } from "@/lib/zodSchemas"
import { z } from "zod"
import { useBookingStore } from "@/lib/store"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem, FormDescription } from "@/components/ui/form"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface ContactDetailsStepProps {
  onBack: () => void
  onComplete: () => void
}

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactDetailsStep({ onBack, onComplete }: ContactDetailsStepProps) {
  const { name, phone, email, notes, setBookingDetails } = useBookingStore()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name,
      phone,
      email,
      notes,
    },
  })

  function onSubmit(values: ContactFormValues) {
    setBookingDetails(values)
    onComplete()
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Your Contact Info</h2>
        <p className="text-gray-600 mt-2">We&apos;ll use this to contact you about your booking</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="John Doe"
                    className="bg-gray-50 border-gray-200 focus:bg-white rounded-md text-base w-full"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="+34 600 000 000"
                    className="bg-gray-50 border-gray-200 focus:bg-white rounded-md text-base w-full"
                    inputMode="tel"
                    />
                </FormControl>
                <FormDescription>
                    We may contact you here if the driver needs clarification or help locating you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                  {...field}
                  placeholder="you@example.com"
                  className="bg-gray-50 border-gray-200 focus:bg-white rounded-md text-base w-full"
                  type="email"
                  />
                </FormControl>
                <FormDescription>
                    A copy of your booking confirmation and receipt will be sent to this email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea
                  {...field}
                  placeholder="e.g. Meet me at the hotel entrance" rows={5}
                  className="bg-gray-50 border-gray-200 focus:bg-white rounded-md text-base w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button variant="outline" type="button" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
