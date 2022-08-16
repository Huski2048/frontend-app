import React from 'react'
import { Svg, SvgProps } from 'husky-uikit'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 13V13C1 6.372 6.372 1 13 1V1C19.628 1 25 6.372 25 13V13C25 19.628 19.628 25 13 25V25C6.372 25 1 19.628 1 13Z"
        stroke="#9D9D9D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0002 18.3333V7.66663"
        stroke="#9D9D9D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 14.3334L13 18.3334L9 14.3334"
        stroke="#9D9D9D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Icon
