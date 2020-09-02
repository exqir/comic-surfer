import React from 'react'

import { token } from 'lib/tokens'

type CardProps = {
  _id: string
  title: string
  issueNo: string | null
  coverImgUrl: string | null
}

export const Card: React.FC<CardProps> = ({
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
        <h3 className="title">{title}</h3>
        <span className="issue">{issueNo}</span>
      </div>
      <style jsx>
        {`
          .card {
            position: relative;
            width: 260px;
            height: 380px;
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
          .title {
            margin: 0;
            font-size: 18px;
          }
          .content {
            z-index: 1;
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
            padding: 18px;
            text-align: center;
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(5px);
            border-radius: ${token('borderRadius')};
            color: ${token('colorText')};
          }
          .issue {
            z-index: 2;
            position: absolute;
            top: -12px;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${token('colorPrimary')};
            color: ${token('background')};
            box-shadow: ${token('shadowSmall')};
          }
        `}
      </style>
    </article>
  )
}
