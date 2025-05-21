'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { PlaceResult } from '../../../types/maps'
import { getPlaceIcon } from '@/lib/booking/helpers'
import  { LucideIcon, MapPinIcon } from "lucide-react"
import { Icon } from '@radix-ui/react-select'


type Props = {
  value: PlaceResult
  onChange: (value: PlaceResult) => void
  placeholder?: string
  className?: string
  countryCode?: string 
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  countryCode = 'es',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null)
  const [localValue, setLocalValue] = useState(value.formattedAddress)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const namePart = value.name ? value.name + " – " : ""
    setLocalValue(namePart + value.formattedAddress)
  }, [value.name, value.formattedAddress])
  

  useEffect(() => {
    if (!window.google || !inputRef.current) return

    // Add session token to avoid extra costs!
    const token = new google.maps.places.AutocompleteSessionToken()
    setSessionToken(token)

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: countryCode }, // restrict to only show results for Spain
      fields: ['formatted_address', 'geometry', 'name', 'types'], // restrict fields to optimize additional costs
    })

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()

      if (!place || !place.geometry || !place.geometry.location) return

      const formattedAddress = place?.formatted_address ?? ""
      const name = place.name ?? ""
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const types = place.types ?? []
      
      const structured: PlaceResult = {
        formattedAddress,
        name,
        lat,
        lng,
        types,
      }

      console.log("Selected place:", structured) //  Log full place data
      onChange(structured)
      setSessionToken(new google.maps.places.AutocompleteSessionToken()) // reset the token after being used
    })

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [countryCode])

  const IconComponent = getPlaceIcon(value.types ?? [], value.name ?? "")

  return (
    <div className="relative">
      {/* Icon inside input on the left */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
      {typeof IconComponent === "string" ? (
        <span>{IconComponent}</span>
      ) : IconComponent ? (
        <IconComponent className="w-4 h-4" />
      ) : (
        <MapPinIcon className="w-4 h-4" />
      )}
    </span>

      
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => {
          const newVal = e.target.value
          setLocalValue(newVal)

          // if (debounceRef.current) clearTimeout(debounceRef.current)
          // debounceRef.current = setTimeout(() => {
          //   onChange(newVal)
          // }, 300)
        }}
        placeholder={placeholder}
        className={className}
      />
    </div>

  )
}
