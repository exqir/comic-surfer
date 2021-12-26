import React, { ChangeEvent, FormEvent, useState } from 'react'

import { styled, srOnly } from 'stitches.config'
import { useSearch } from 'hooks/useSearch'
import { query, fetcher } from 'data/addToPullList'
import { Stack } from 'components/Stack'
import { Button } from 'components/Button'
import { Search as SearchIcon } from 'components/icons/Search'

const addToPullList = (url: string) => async () => {
  try {
    await fetcher(query, url)
  } catch (error) {}
}

export const Search: React.FC = () => {
  const [input, setInput] = useState('')
  const [searchQuery, setSeachQuery] = useState('')
  const { search, isLoading } = useSearch({ searchQuery })
  return (
    <Container>
      <Form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          setSeachQuery(input)
        }}
      >
        <SearchLabel htmlFor="seach-query">Search</SearchLabel>
        <SearchInput
          id="search-query"
          name="search-query"
          type="text"
          value={input}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setInput(event.target.value)
          }}
        />
        <Button type="submit">
          <SearchIcon />
        </Button>
      </Form>
      {isLoading ? <div>Loading...</div> : null}
      {search ? (
        <SearchResultsContainer>
          <Stack as="ul" space="medium">
            {search.map(({ title, url, inPullList }) => (
              <li key={url}>
                <SearchResultItem>
                  <SearchResultItemTitle>{title}</SearchResultItemTitle>
                  {inPullList ? null : (
                    <Button onClick={addToPullList(url)}>Add</Button>
                  )}
                </SearchResultItem>
              </li>
            ))}
          </Stack>
        </SearchResultsContainer>
      ) : null}
    </Container>
  )
}

const Container = styled('div', {
  zIndex: 10000,
  position: 'fixed',
  top: '50%',
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transform: 'translateY(-50%)',
})

const Form = styled('form', {
  width: '90%',
  display: 'flex',
  borderRadius: '$m',
  boxShadow: '$s',
  backgroundColor: '#fff',
  overflow: 'hidden',
})

const SearchLabel = styled('label', srOnly)

const SearchInput = styled('input', {
  boxSizing: 'border-box',
  width: '100%',
  height: 'calc(2 * $space$xl)',
  borderWidth: 0,
  padding: '0 $l',
})

const SearchResultsContainer = styled('div', {
  marginTop: '$m',
  width: '90%',
})

const SearchResultItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '$background',
  borderRadius: '$m',
  overflow: 'hidden',
})

const SearchResultItemTitle = styled('span', {
  padding: '$m',
})
