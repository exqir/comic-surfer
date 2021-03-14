import React, { useState } from 'react'

import { useSearch } from 'hooks/useSearch'
import { token } from 'lib/tokens'
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
    <div className="container">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSeachQuery(input)
        }}
      >
        <label htmlFor="seach-query" className="sr-only">
          Search
        </label>
        <input
          className="input"
          id="search-query"
          name="search-query"
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
        />
        <Button type="submit">
          <SearchIcon />
        </Button>
      </form>
      {isLoading ? <div>Loading...</div> : null}
      {search ? (
        <div className="search-results">
          <Stack component="ul" space="medium">
            {search.map(({ title, url, inPullList }) => (
              <div key={url} className="search-item">
                <span>{title}</span>
                {inPullList ? null : (
                  <Button onClick={addToPullList(url)}>Add</Button>
                )}
              </div>
            ))}
          </Stack>
          <ul></ul>
        </div>
      ) : null}
      <style jsx>{`
        .container {
          z-index: 10000;
          position: fixed;
          top: 50%;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateY(-50%);
        }
        form {
          width: 90%;
          display: flex;
          border-radius: ${token('borderRadius')};
          box-shadow: ${token('shadowSmall')};
          background-color: #fff;
          overflow: hidden;
        }
        .input {
          box-sizing: border-box;
          width: 100%;
          height: calc(2 * ${token('spaceXL')});
          border-width: 0;
          padding: 0 ${token('spaceL')};
        }
        .search-results {
          margin-top: ${token('spaceM')};
          width: 90%;
        }
        .search-item {
          display: flex;
          justify-content: space-between;
          background-color: ${token('background')};
          border-radius: ${token('borderRadius')};
          overflow: hidden;
        }
        span {
          padding: ${token('spaceM')} ${token('spaceM')};
        }
      `}</style>
    </div>
  )
}
