import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { token } from 'lib/tokens'

type WavesProp = {
  className?: string
}

const Wave1 = styled(({ className }) => (
  <path
    className={className}
    fillOpacity="1"
    d="M0,224L18.5,234.7C36.9,245,74,267,111,256C147.7,245,185,203,222,170.7C258.5,139,295,117,332,90.7C369.2,64,406,32,443,32C480,32,517,64,554,96C590.8,128,628,160,665,170.7C701.5,181,738,171,775,154.7C812.3,139,849,117,886,122.7C923.1,128,960,160,997,176C1033.8,192,1071,192,1108,192C1144.6,192,1182,192,1218,208C1255.4,224,1292,256,1329,245.3C1366.2,235,1403,181,1422,154.7L1440,128L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
  ></path>
))`
  fill: url(#wave-gradient) ${token('colorPrimary')};
`

const Wave2 = styled(({ className }) => (
  <path
    className={className}
    fill-opacity="1"
    d="M0,160L48,181.3C96,203,192,245,288,240C384,235,480,181,576,160C672,139,768,149,864,165.3C960,181,1056,203,1152,224C1248,245,1344,267,1392,277.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
  ></path>
))`
  fill: url(#wave-gradient) #f0952d;
  transform: translateY(60px);
`

export const Waves: React.FC<WavesProp> = styled<React.FC<WavesProp>>(
  ({ className }) => {
    return (
      <div className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <Wave1 />
          <Wave2 />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0%"
              y1="86%"
              x2="50%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#f0952d" />
              <stop offset="100%" stopColor={token('colorPrimary')} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  },
)(
  () => css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  `,
)

export const TopWave: React.FC<WavesProp> = styled<React.FC<WavesProp>>(
  ({ className }) => {
    return (
      <div className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 600">
          <rect height="50px"></rect>
          <path
            fillOpacity="1"
            d="M0 180L60 240C120 300 240 420 360 429.938C480 440.625 600 339.375 720 290.062C840 240 960 240 1080 300C1200 360 1320 480 1380 540L1440 600V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V180Z"
          />
        </svg>
      </div>
    )
  },
)(
  () => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    fill: url(#wave-gradient) ${token('colorPrimary')};
  `,
)
