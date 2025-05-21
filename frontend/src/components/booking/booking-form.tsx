"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, addDays } from "date-fns"
import { CalendarIcon, MapPinIcon, Users, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formSchema } from "@/lib/zodSchemas"
import { Controller } from "react-hook-form"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ThemeProvider } from "@mui/material/styles"
import { timePickerTheme } from "@/lib/mui-timepicker-theme"

import { AddressAutocomplete } from "./AddressAutoComplete"
import { estimateFare } from "@/lib/booking/estimateFare"
import { combineDateAndTime, detectIsAirport, detectIsHoliday } from "@/lib/booking/helpers"



export default function BookingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passengers, setPassengers] = useState(2)

  const defaultTime = () => {
    const now = new Date()
    now.setHours(14, 0, 0, 0)
    return now
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: { 
        formattedAddress: "",
        name: "",
        lat: 0,
        lng: 0,
        types: [], 
      },
      destination: { 
        formattedAddress: "",
        name: "",
        lat: 0,
        lng: 0,
        types: [], 
      },
      passengers: passengers.toString(),
      date: addDays(new Date(), 1), // default to tomorrow
      time: defaultTime(),
    },
  })

  const handlePassengerChange = (delta: number) => {
    setPassengers((prev) => {
      const newCount = Math.min(Math.max(prev + delta, 1), 50)
      form.setValue("passengers", newCount.toString())
      return newCount
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const fareEstimates = await estimateFare({
        pickupLocation: values.pickupLocation.formattedAddress,
        destination: values.destination.formattedAddress,
        passengers: parseInt(values.passengers),
        scheduledTime: combineDateAndTime(values.date, values.time),
        isAirport: detectIsAirport(values.pickupLocation.name, values.destination.name),
        isHoliday: detectIsHoliday(values.date),
      })
      // just for now testing
      alert(
        fareEstimates
          .map(
            (estimate) =>
              `${estimate.category}: €${estimate.estimated_fare.toFixed(2)}`
          )
          .join("\n")
      )
      
    
    } catch (error) {
      console.error("Fare estimation failed:", error)
      alert("Failed to estimate fare. Please try again.")
    
    } finally {
      setIsSubmitting(false)
      console.log("Submitted values:", values)
      //router.push("/booking") // simulate redirect
    }
  }


  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4 text-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Pickup */}
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    {...field}
                    placeholder="Address, airport, hotel, ..."
                    className="pl-10 py-5 md:py-6 bg-gray-50 border-gray-200 focus:bg-white rounded-md text-base w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dropoff */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    {...field}
                    placeholder="Address, airport, hotel, ..."
                    className="pl-10 py-5 md:py-6 bg-gray-50 border-gray-200 focus:bg-white rounded-md text-base w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Pickup date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 py-5 md:py-6 text-left font-normal bg-gray-50 border-gray-200 hover:bg-gray-100",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "EEE, dd MMM, yyyy") : <span>Select date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormItem>
              <FormLabel>Pickup Time</FormLabel>
                <ThemeProvider theme={timePickerTheme}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                          ampm={false}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              variant: "outlined",
                              InputProps: {
                                sx: {
                                  height: 47, // Add height
                                },
                              },
                            },
                          }}
                        />
                        )}
                    />
                    </LocalizationProvider>
                  </ThemeProvider>
                <FormMessage />
            </FormItem>

          </div>

          {/* Passengers */}
          <FormItem>
            <FormLabel>Passengers</FormLabel>
            <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-2">
              {/* Left: Icon and value */}
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-base">{passengers}</span>
              </div>

              {/* Right: + and - buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => handlePassengerChange(-1)}
                  className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700"
                >
                  −
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePassengerChange(1)}
                  className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700"
                >
                  +
                </Button>
              </div>
            </div>
          </FormItem>


          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-6 text-lg"
            disabled={isSubmitting}
          >
            <Search className="mr-2 h-5 w-5" />
            {isSubmitting ? "Processing..." : "Find a Ride"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
