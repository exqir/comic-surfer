import React, { forwardRef } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import clsx from 'clsx'

import type { Maybe } from 'types/graphql-client-schema'
import { Card } from 'components/Card'
import { Heading } from 'components/Heading'
import { token } from 'lib/tokens'
import { mq } from 'lib/responsiveProps'

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
  ${mq('desktop')} {
    &.comic-book {
      display: flex;
      width: auto;
    }
  }
  &.link {
    display: inline-block;
    text-decoration: none;
    color: ${token('colorText')};
  }
  ${mq('desktop')} {
    &.link {
      display: initial;
    }
  }
  .content {
    position: absolute;
    padding: ${token('spaceM')};
    bottom: 0;
    left: 0;
    right: 0;
    background: ${token('background')};
  }
  ${mq('desktop')} {
    .content {
      position: relative;
      padding: ${token('spaceL')};
    }
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
  }
  ${mq('desktop')} {
    .cover {
      position: relative;
    }
  }
  .release-date {
    display: none;
  }
  ${mq('desktop')} {
    .release-date {
      display: block;
    }
  }
`
type ComicBookProps = {
  _id: string
  title: string
  issueNo: Maybe<number>
  coverImgUrl: Maybe<string>
  releaseDate: Maybe<string>
  href?: string
  className?: string
}

export const ComicBook: React.FC<ComicBookProps> = styled<
  React.FC<ComicBookProps>
>(
  forwardRef<HTMLAnchorElement, ComicBookProps>(
    (
      { _id, title, issueNo, coverImgUrl, releaseDate, href, className },
      ref,
    ) => {
      const isLink = href !== undefined

      const content = (
        <Card className={clsx('comic-book', className)}>
          {coverImgUrl ? (
            <img className="cover" src={coverImgUrl} width={160} height={245} />
          ) : null}
          <div className="content">
            <Heading component="h3" className="title">
              {title}
              {issueNo ? <span className="issue">#{issueNo}</span> : null}
            </Heading>
            {releaseDate ? (
              <p className="release-date">
                {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(releaseDate))}
              </p>
            ) : null}
          </div>
        </Card>
      )

      return isLink ? (
        <a className={clsx('link', className)} href={href} ref={ref}>
          {content}
        </a>
      ) : (
        content
      )
    },
  ),
)(
  () => css`
    ${comicBook}
  `,
)
