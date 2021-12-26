import React, { forwardRef } from 'react'

import type { Maybe } from 'types/graphql-client-schema'
import { styled } from 'stitches.config'
import { Card } from 'components/Card'
import { Heading } from 'components/Heading'

type ComicBookProps = {
  _id: string
  title: string
  issueNo: Maybe<number>
  coverImgUrl: Maybe<string>
  releaseDate: Maybe<string>
  href?: string
  className?: string
}

export const ComicBook: React.FC<ComicBookProps> =
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLAnchorElement, ComicBookProps>(
    ({ _id, title, issueNo, coverImgUrl, releaseDate, href }, ref) => {
      const isLink = href !== undefined

      const content = (
        <ComicBookCard>
          {coverImgUrl ? (
            // TODO: Use image component instead of img tag
            <CoverImage src={coverImgUrl} width={160} height={245} />
          ) : null}
          <CardContent>
            <ComicTitle as="h3">
              {title}
              {issueNo ? <IssueNumber>#{issueNo}</IssueNumber> : null}
            </ComicTitle>
            {releaseDate ? (
              <ReleaseDate>
                {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(releaseDate))}
              </ReleaseDate>
            ) : null}
          </CardContent>
        </ComicBookCard>
      )

      return isLink ? (
        <ComicBookLink href={href} ref={ref}>
          {content}
        </ComicBookLink>
      ) : (
        content
      )
    },
  )

const ComicBookCard = styled(Card, {
  width: '160px',
  height: '245px',
  transition: 'transform 0.3s ease',
  backgroundSize: 'cover',
  backgroundPosition: 'top center',
  backgroundRepeat: 'no-repeat',

  '&:hover': {
    transform: 'scale(1.03)',
  },

  '@l': {
    display: 'flex',
    width: 'auto',
  },
})

const ComicBookLink = styled('a', {
  display: 'inline-block',
  textDecoration: 'none',
  color: '$text',

  '@l': {
    display: 'initial',
  },
})

const CardContent = styled('div', {
  position: 'absolute',
  padding: '$m',
  bottom: 0,
  left: 0,
  right: 0,
  background: '$background',

  '@l': {
    position: 'relative',
    padding: '$l',
  },
})

const ComicTitle = styled(Heading, {
  borderBottom: '1px solid $colors$primary',
})

const IssueNumber = styled('span', {
  fontSize: '14px',
  fontWeight: 'normal',
  color: '#cbd5e0',
  paddingLeft: '$s',
})

const CoverImage = styled('img', {
  position: 'absolute',
  inset: 0,

  '@l': {
    position: 'relative',
  },
})

const ReleaseDate = styled('p', {
  display: 'none',

  '@l': {
    display: 'block',
  },
})
