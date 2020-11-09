import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import clsx from 'clsx'

import { token } from 'lib/tokens'

type ComicCardProps = {
  _id: string
  title: string
  issueNo: string | null
  coverImgUrl: string | null
}

// export const Card: React.FC<CardProps> = ({
//   _id,
//   title,
//   issueNo,
//   coverImgUrl,
// }) => {
//   return (
//     <article
//       className="card"
//       style={
//         coverImgUrl ? { backgroundImage: `url(${coverImgUrl})` } : undefined
//       }
//     >
//       <div className="content">
//         <h3 className="title">{title}</h3>
//         <span className="issue">{issueNo}</span>
//       </div>
//       <style jsx>
//         {`
//           .card {
//             position: relative;
//             width: 160px;
//             height: 245px;
//             color: #434343;
//             border-radius: ${token('borderRadius')};
//             overflow: hidden;
//             box-shadow: ${token('shadowSmall')};
//             border: none;
//             border-bottom: 1px solid #eaeaea;
//             border-top: 1px solid #eaeaea;
//             transition: transform 0.3s ease;
//             background-size: cover;
//             background-position: top center;
//             background-repeat: no-repeat;
//           }
//           .card:hover {
//             transform: scale(1.03);
//           }
//           .title {
//             margin: 0;
//             font-size: 18px;
//           }
//           .content {
//             z-index: 1;
//             position: absolute;
//             bottom: 12px;
//             left: 12px;
//             right: 12px;
//             padding: 18px;
//             text-align: center;
//             background: rgba(255, 255, 255, 0.65);
//             backdrop-filter: blur(5px);
//             border-radius: ${token('borderRadius')};
//             color: ${token('colorText')};
//           }
//           .issue {
//             z-index: 2;
//             position: absolute;
//             top: -12px;
//             right: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             width: 24px;
//             height: 24px;
//             border-radius: 50%;
//             background: ${token('colorPrimary')};
//             color: ${token('background')};
//             box-shadow: ${token('shadowSmall')};
//             font-size: 14px;
//           }
//         `}
//       </style>
//     </article>
//   )
// }

export const Card1: React.FC<ComicCardProps> = ({
  _id,
  title,
  issueNo,
  coverImgUrl,
}) => {
  return (
    <article
      className="card"
      style={
        coverImgUrl ? { backgroundImage: `url(${coverImgUrl})` } : undefined
      }
    >
      <span className="sr-only">
        {title} #{issueNo}
      </span>
      <style jsx>
        {`
          .card {
            position: relative;
            width: 160px;
            height: 245px;
            color: #434343;
            border-radius: ${token('borderRadius')};
            overflow: hidden;
            box-shadow: ${token('shadowSmall')};
            border: none;
            border-bottom: 1px solid #eaeaea;
            border-top: 1px solid #eaeaea;
            transition: transform 0.3s ease;
            background-size: cover;
            background-position: top center;
            background-repeat: no-repeat;
          }
          .card:hover {
            transform: scale(1.03);
          }
        `}
      </style>
    </article>
  )
}

export const Card2: React.FC<ComicCardProps> = ({
  _id,
  title,
  issueNo,
  coverImgUrl,
}) => {
  return (
    <article className="container">
      <img
        className="cover"
        src={coverImgUrl ?? undefined}
        height={184}
        width={120}
      />
      <div className="card">
        <div className="content">
          <h3 className="title">{title}</h3>
          <span className="issue">{issueNo}</span>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            position: relative;
            width: 100%;
            height: calc(2 * ${token('spaceL')} + 184px);
          }
          .card {
            position: relative;
            width: 100%;
            height: 160px;
            color: #434343;
            border-radius: ${token('borderRadius')};
            overflow: hidden;
            box-shadow: ${token('shadowSmall')};
            border: none;
            border-bottom: 1px solid #eaeaea;
            border-top: 1px solid #eaeaea;
            transition: transform 0.3s ease;
          }
          .card:hover {
            transform: scale(1.03);
          }
          .cover {
            border-radius: ${token('borderRadius')};
            overflow: hidden;
            position: absolute;
            top: ${token('spaceL')};
            left: ${token('spaceL')};
            z-index: 1;
            border: 1px solid #cbd5e0;
          }
          .title {
            margin: 0;
            font-size: 18px;
          }
          .content {
            z-index: 1;
            position: absolute;
            top: ${token('spaceL')};
            left: calc(${token('spaceL')} + 120px);
            padding: ${token('spaceL')};
            color: ${token('colorText')};
          }
        `}
      </style>
    </article>
  )
}

export const Card3: React.FC<ComicCardProps> = ({
  _id,
  title,
  issueNo,
  coverImgUrl,
}) => {
  return (
    <article className="card">
      <img
        className="cover"
        src={coverImgUrl ?? undefined}
        height={120}
        width={80}
      />
      <div className="content">
        <h3 className="title">{title}</h3>
        <span className="issue">{issueNo}</span>
      </div>
      <style jsx>
        {`
          .card {
            position: relative;
            width: 100%;
            height: 120px;
            color: #434343;
            border-radius: ${token('borderRadius')};
            overflow: hidden;
            box-shadow: ${token('shadowSmall')};
            border: none;
            border-bottom: 1px solid #eaeaea;
            border-top: 1px solid #eaeaea;
            transition: transform 0.3s ease;
            display: flex;
          }
          .card:hover {
            transform: scale(1.03);
          }
          .cover {
            border-right: 1px solid #cbd5e0;
          }
          .title {
            margin: 0;
            font-size: 18px;
          }
          .content {
            padding: ${token('spaceL')};
            color: ${token('colorText')};
          }
        `}
      </style>
    </article>
  )
}

export const Card4: React.FC<ComicCardProps> = ({
  _id,
  title,
  issueNo,
  coverImgUrl,
}) => {
  return (
    <article
      className="card"
      style={
        coverImgUrl ? { backgroundImage: `url(${coverImgUrl})` } : undefined
      }
    >
      <div className="content">
        <h3 className="title">
          {title}
          <span className="issue">#{issueNo}</span>
        </h3>
      </div>
      <style jsx>
        {`
          .card {
            position: relative;
            width: 160px;
            height: 245px;
            border-radius: ${token('borderRadius')};
            overflow: hidden;
            box-shadow: ${token('shadowSmall')};
            border: none;
            border-bottom: 1px solid #eaeaea;
            border-top: 1px solid #eaeaea;
            transition: transform 0.3s ease;
            background-size: cover;
            background-position: top center;
            background-repeat: no-repeat;
          }
          .card:hover {
            transform: scale(1.03);
          }
          .content {
            position: absolute;
            padding: ${token('spaceM')};
            bottom: 0;
            left: 0;
            right: 0;
            background: ${token('background')};
          }
          .title {
            margin: 0;
            border-bottom: 1px solid ${token('colorPrimary')};
            color: ${token('colorText')};
          }
          .issue {
            font-size: 14px;
            font-weight: normal;
            color: #cbd5e0;
            padding-left: ${token('spaceS')};
          }
        `}
      </style>
    </article>
  )
}

const card = css`
  &.card {
    position: relative;
    border-radius: ${token('borderRadius')};
    overflow: hidden;
    box-shadow: ${token('shadowSmall')};
    border: none;
    border-bottom: 1px solid #eaeaea;
    border-top: 1px solid #eaeaea;
  }
`

type Component = 'div' | 'section' | 'article'

export type CardProps = {
  /**
   * Component used to render the Stack.
   * @default 'article'
   */
  component?: Component
  /**
   * Additional classes
   * @default undefined
   */
  className?: string
  /**
   * The Cards Content.
   * @default undefined
   */
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = styled<React.FC<CardProps>>(
  ({ component: Component = 'article', className, children }) => {
    return <Component className={clsx('card', className)}>{children}</Component>
  },
)(
  () => css`
    ${card}
  `,
)
