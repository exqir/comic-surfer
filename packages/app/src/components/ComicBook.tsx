import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import clsx from 'clsx'

import { Card } from 'components/Card'
import { Heading } from 'components/Heading'
import { token } from 'lib/tokens'

type ComicBookProps = {
  _id: string
  title: string
  issueNo: string | null
  coverImgUrl: string | null
  className?: string
}

const comicBook = css`
  &.comic-book {
    width: 160px;
    height: 245px;
    transition: transform 0.3s ease;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
  }
  &.comic-book:hover {
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
    border-bottom: 1px solid ${token('colorPrimary')};
  }
  .issue {
    font-size: 14px;
    font-weight: normal;
    color: #cbd5e0;
    padding-left: ${token('spaceS')};
  }
  .cover {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: -1;
  }
`

export const ComicBook: React.FC<ComicBookProps> = styled<
  React.FC<ComicBookProps>
>(({ _id, title, issueNo, coverImgUrl, className }) => {
  return (
    <Card className={clsx('comic-book', className)}>
      {coverImgUrl ? (
        <img className="cover" src={coverImgUrl} width={160} height={245} />
      ) : null}
      <div className="content">
        <Heading component="h3" className="title">
          {title}
          {issueNo ? <span className="issue">#{issueNo}</span> : null}
        </Heading>
      </div>
    </Card>
  )
})(
  () => css`
    ${comicBook}
  `,
)
