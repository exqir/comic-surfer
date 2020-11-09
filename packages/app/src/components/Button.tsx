import React, { forwardRef } from 'react'
import clsx from 'clsx'
import css from 'styled-jsx/css'

import { token } from 'lib/tokens'

const { className, styles: staticStyles } = css.resolve`
  .button {
    /* base */
    display: inline-block;
    appearance: none;
    cursor: pointer;

    /* color */
    color: var(--button-color);
    background: var(--button-bg);

    /* spacing */
    margin: 0;
    padding: ${token('spaceS')} ${token('spaceL')};

    /* typography */
    font-size: ${token('fontMedium')};
    line-height: ${token('lineMedium')};
    text-decoration: none;
    text-align: center;

    /* border */
    border: none;
    border-radius: ${token('borderRadius')};
  }
  .button:hover:not(.disabled),
  .button:active:not(.disabled),
  .button:focus:not(.disabled) {
    box-shadow: inset 0px 0px 0 1px var(--color-primary);
  }
  .button:hover:not(.disabled) .text,
  .button:active:not(.disabled) .text,
  .button:focus:not(.disabled) .text {
    background-image: var(--button-text-gradient);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .button.full-width {
    width: 100%;
  }
  .button.disabled {
    --button-bg: #ccc;
    --button-color: rgb(117, 117, 117);
  }
`

const A = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  (props, ref) => <a ref={ref as React.Ref<HTMLAnchorElement>} {...props} />,
)

const _Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <button ref={ref as React.Ref<HTMLButtonElement>} {...props} />
  ),
)

export type ButtonProps = {
  /**
   * Visual style of the Button. One of `primary` and `secondary`.
   * @default "primary"
   */
  variant?: 'primary' | 'secondary'
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

export const Button = forwardRef<
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
    const Tag = isLink ? A : _Button

    let linkAttributes = {}
    if (isLink && isDisabled) {
      linkAttributes = {
        ...linkAttributes,
        tabIndex: -1,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault()
        },
        onKeyDown: (e: React.MouseEvent) => {
          e.preventDefault()
        },
        disabled: undefined,
        'aria-disabled': 'true',
      }
    }

    return (
      <Tag
        ref={ref}
        {...htmlAttributes}
        type={type}
        onClick={onClick}
        href={href}
        disabled={isDisabled}
        {...linkAttributes}
        className={clsx(
          'button',
          className,
          isFullWidth && 'full-width',
          isDisabled && 'disabled',
        )}
      >
        <span className={clsx('text', className)}>{children}</span>
        <style jsx>
          {`
            .button {
              --button-color: #fff;
              --button-bg: linear-gradient(
                60deg,
                #f0952d,
                ${token('colorPrimary')}
              );
              --button-text-gradient: linear-gradient(
                90deg,
                #f0952d,
                ${token('colorPrimary')}
              );
            }
            .button:hover,
            .button:active,
            .button:focus {
              --button-color: var(--color-primary);
              --button-bg: transparent;
            }
          `}
        </style>
        {staticStyles}
      </Tag>
    )
  },
)
