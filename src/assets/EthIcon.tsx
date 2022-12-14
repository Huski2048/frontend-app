import React from 'react'
import { Svg, SvgProps } from 'husky-uikit'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 96 96" {...props}>
      <circle cx="48" cy="48" r="48" fill="#F5F3F3" />
      <path fill="#2F3030" d="M48 64.9742V81.6924L68.5762 52.7999L48 64.9742Z" />
      <path fill="#08060B" d="M48 39.1768V60.696L68.5762 48.5218L48 39.1768Z" />
      <path fill="#2F3030" d="M48 14.3999V39.1771L68.5762 48.5221L48 14.3999Z" />
      <path fill="#828384" d="M48 64.9742V81.6924L27.4238 52.7999L48 64.9742Z" />
      <path fill="#343535" d="M48 39.1768V60.696L27.4238 48.5218L48 39.1768Z" />
      <path fill="#828384" d="M48 14.3999V39.1771L27.4238 48.5221L48 14.3999Z" />
    </Svg>
  )
}

export default Icon
