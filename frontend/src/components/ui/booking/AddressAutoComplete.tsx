'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (!window.google || !inputRef.current) return

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: countryCode },
    })

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      const address = place?.formatted_address ?? inputRef.current?.value
      if (address) onChange(address)
    })

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [countryCode])

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}
