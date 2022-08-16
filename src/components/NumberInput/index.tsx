import React, { useRef, useEffect } from 'react'
import { Input } from 'husky-uikit'

const NumberInput = (props) => {
  // FIX for scroll-wheel changing input of number type
  // is better to use input of type Number
  // to avoid having to sanitize input
  // sudden breaks/bugs
  const numberInputRef = useRef([])
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const references = numberInputRef.current
    references.forEach((reference) => reference?.addEventListener('wheel', handleWheel))

    return () => {
      references.forEach((reference) => reference?.removeEventListener('wheel', handleWheel))
    }
  }, [])
  return (
    <Input
      pattern={`^[0-9]*[.,]?[0-9]{0,${18}}$`}
      inputMode="decimal"
      {...props}
      ref={(input) => numberInputRef.current.push(input)}
    />
  )
}

export default NumberInput
