import {
  createResponsiveProps,
  ResponsiveProp as RP,
} from '@exqir/responsive-props'

const breakpoints = {
  mobile: 320,
  tablet: 720,
  desktop: 1024,
}

type Breakpoints = typeof breakpoints

export type ResponsiveProp<T> = RP<T, Breakpoints>

const rp = createResponsiveProps({
  mobile: 320,
  tablet: 720,
  desktop: 1024,
})

export const responsiveProps = rp.responsiveProps
export const mq = rp.mq
