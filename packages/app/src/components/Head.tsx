import React from 'react'
import NextHead from 'next/head'

import { redirectScript, redirectKey } from 'lib/redirect'

const defaultDescription = ''
const defaultOGURL = ''
const defaultOGImage = ''

type HeadProps = {
  title?: string
  description?: string
  url?: string
  ogImage?: string
}

export const Head: React.FunctionComponent<HeadProps> = (props) => (
  <NextHead>
    <script
      dangerouslySetInnerHTML={{ __html: redirectScript }}
      key={redirectKey}
    />
    <meta charSet="UTF-8" />
    <title>
      {props.title ? `${props.title} - Comic-Surfer` : 'Comic-Surfer'}
    </title>
    <meta
      name="description"
      content={props.description || defaultDescription}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
    <link rel="apple-touch-icon" href="/static/touch-icon.png" />
    <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
    <link rel="icon" href="/static/favicon.ico" />
    <meta property="og:url" content={props.url || defaultOGURL} />
    <meta property="og:title" content={props.title || ''} />
    <meta
      property="og:description"
      content={props.description || defaultDescription}
    />
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </NextHead>
)
