import React from 'react'
import { Svg, SvgProps } from 'husky-uikit'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 96 96" {...props}>
      <circle cx="48" cy="48" r="48" fill="#F0B90B" />
      <path
        fill="#FFFDFA"
        fillRule="evenodd"
        d="M27.5718 35.8081L48.0199 15.36L56.1732 23.5132L35.725 43.9613L27.5718 35.8081ZM27.5867 60.2428L60.2647 27.5649L68.4179 35.7181L35.74 68.3961L27.5867 60.2428ZM72.4862 39.8095L39.8082 72.4874L47.9614 80.6407L80.6394 47.9627L72.4862 39.8095ZM15.3601 48.0172L23.5133 39.864L31.6666 48.0172L23.5133 56.1705L15.3601 48.0172Z"
        clipRule="evenodd"
      />
    </Svg>
  )
}

export default Icon
