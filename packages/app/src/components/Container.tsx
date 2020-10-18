import React from 'react'

import { token } from 'lib/tokens'

export const Container: React.FC<{}> = ({ children }) => {
  return (
    <div className="container">
      {children}
      <style jsx>
        {`
          .container {
            margin: 0 auto;
            max-width: ${token('maxWidth')};
            padding: ${token('spaceL')};
          }
        `}
      </style>
    </div>
  )
}
