'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '../input'

type Props = {
  value: string
  onChange: (value: string) => void
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
  const [localValue, setLocalValue] = useState(value)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sync with external value (e.g. RHF reset)
  useEffect(() => {
    setLocalValue(value)
  }, [value])


  useEffect(() => {
    if (!window.google || !inputRef.current) return

    // Add session token to avoid extra costs!
    const token = new google.maps.places.AutocompleteSessionToken()
    setSessionToken(token)

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: countryCode }, // restrict to only show results for Spain
      fields: ['formatted_address', 'geometry', 'place_id', 'name'], // restrict fields to optimize additional costs
    })

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      const address = place?.formatted_address ?? inputRef.current?.value
      if (address) {
        onChange(address)
        setSessionToken(new google.maps.places.AutocompleteSessionToken()) // reset the token after being used
      }
    })

    setLocalValue(value) // Sync with RHF on reset

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [countryCode])

  return (
    <Input
      ref={inputRef}
      type="text"
      value={localValue}
      onChange={(e) => {
        const newVal = e.target.value
        setLocalValue(newVal)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          onChange(newVal)
        }, 300)
      }}
      placeholder={placeholder}
      className={className}
    />

  )
}
