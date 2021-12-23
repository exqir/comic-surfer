import React, { forwardRef } from 'react'

import { styled } from 'stitches.config'

export type ButtonProps = {
  /**
   * Visual style of the Button. One of `primary` and `secondary`.
   * @default "primary"
   */
  variant?: 'primary'
  /**
   * Size of the Button. One of `small`, `medium` and `large`.
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Type attribute of the Button: One of `button`, `submit` and `reset`.
   * **IMPORTANT**: Will be ignored when an `href` was set.
   * @default "button"
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Disables the Button.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Use full width of the Container Element.
   * @default false
   */
  isFullWidth?: boolean
  /**
   * Replaces content with Spinner.
   * @default false
   */
  isWaiting?: boolean
  /**
   * Function that is called when interacting with the Button.
   * @default undefined
   */
  onClick?: (...args: any[]) => void
  /**
   * The URL to navigate to when the button is clicked.
   * If defined component will be rendered as an `<a>` Tag.
   * @default undefined
   */
  href?: string
  /**
   * The Buttons Content.
   * @default undefined
   */
  children?: React.ReactNode
  [prop: string]: any
}

export const Button: React.ForwardRefExoticComponent<ButtonProps> = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = 'primary',
      size = 'medium',
      type = 'button',
      isDisabled,
      isFullWidth,
      isWaiting,
      onClick,
      href,
      children,
      ...htmlAttributes
    }: ButtonProps,
    ref,
  ) => {
    const isLink = href !== undefined

    let disabledAttributes = {}
    if (isDisabled) {
      disabledAttributes = {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault()
        },
        onKeyDown: (e: React.MouseEvent) => {
          // Overwrite with a noop function and not preventDefault
          // to keep keyboard navigation working.
        },
        'aria-disabled': 'true',
      }
    }

    return (
      <StyledButton
        {...htmlAttributes}
        as={isLink ? 'a' : undefined}
        type={!isLink ? type : undefined}
        // @ts-expect-error Ref tyoe is only Button and is not including Anchor
        ref={ref}
        onClick={onClick}
        href={href}
        {...disabledAttributes}
        variant={variant}
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
      >
        <span className={'text'}>{children}</span>
      </StyledButton>
    )
  },
)

const StyledButton = styled('button', {
  /* base */
  display: 'inline-block',
  appearance: 'none',
  cursor: 'pointer',
  /* color */
  color: '$$color',
  background: '$$background',
  /* spacing */
  margin: 0,
  padding: '$s $l',
  /* typography */
  fontSize: '$m',
  lineHeight: '$m',
  textDecoration: 'none',
  textAlign: 'center',
  /* border */
  border: 'none',
  borderRadius: '$m',
  '&:hover:not([aria-disabled=true]), &:active:not([aria-disabled=true]), &:focus:not([aria-disabled=true])': {
    boxShadow: 'inset 0px 0px 0 1px $$shadowColor',
  },
  '&:hover:not([aria-disabled=true]) .text, &:active:not([aria-disabled=true]) .text, &:focus:not([aria-disabled=true]) .text': {
    backgroundImage: '$$textGradient',
    backgroundClip: 'text',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  variants: {
    variant: {
      primary: {
        $$color: '#fff',
        $$background: 'linear-gradient(60deg,#f0952d,$colors$primary)',
        $$textGradient: 'linear-gradient(90deg,#f0952d,$colors$primary)',
        $$shadowColor: '$colors$primary',
        '&:hover:not([aria-disabled=true]), &:active:not([aria-disabled=true]), &:focus:not([aria-disabled=true])': {
          $$color: '$colors$primary',
          $$background: 'transparent',
        },
      },
    },
    isFullWidth: {
      true: { width: '100%' },
    },
    isDisabled: {
      true: {
        cursor: 'default',
      },
    },
  },

  compoundVariants: [
    {
      variant: 'primary',
      isDisabled: true,
      css: {
        $$background: '#ccc',
        $$color: 'rgb(117, 117, 117)',
      },
    },
    {
      variant: 'primary',
      isDisabled: true,
      css: {
        $$background: '#ccc',
        $$color: 'rgb(117, 117, 117)',
      },
    },
  ],
})

Button.displayName = 'Button'
