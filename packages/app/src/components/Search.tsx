import React, { useState } from 'react'

import { useSearch } from 'hooks/useSearch'
import { token } from 'lib/tokens'
import { query, fetcher } from 'data/subscribeToComicSeries'

const subscribeToComicSeries = (url: string) => async () => {
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
        <button className="button" type="submit">
          Search
        </button>
      </form>
      {isLoading ? <div>Loading...</div> : null}
      {search ? (
        <div className="search-results">
          <ul>
            {search.map(({ title, url, inPullList }) => (
              <li>
                <span>{title}</span>
                {inPullList ? null : (
                  <button
                    className="button"
                    type="button"
                    onClick={subscribeToComicSeries(url)}
                  >
                    Add
                  </button>
                )}
              </li>
            ))}
          </ul>
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
        .button {
          border: 0;
          color: #fff;
          background: linear-gradient(60deg, var(--color-primary), #f7ce68);
          padding: 0 ${token('spaceM')};
        }
        .search-results {
          margin-top: ${token('spaceM')};
          width: 90%;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          background-color: ${token('background')};
          border-radius: ${token('borderRadius')};
          overflow: hidden;
        }
        span {
          padding: ${token('spaceM')} ${token('spaceM')};
        }
        li + li {
          margin-top: ${token('spaceM')};
        }
      `}</style>
    </div>
  )
}
