import React from 'react'

import { Head } from 'components/Head'
import { Heading } from 'components/Heading'
import { Stack } from 'components/Stack'
import { Tiles } from 'components/Tiles'
import { Button } from 'components/Button'
import { Card } from 'components/Card'

const placeholder: React.CSSProperties = {
  backgroundColor: '#ccc',
  height: '48px',
  textAlign: 'center',
}

const Design = () => {
  return (
    <div>
      <Head title="Design" protected={false} />
      <Heading as="h1" variant="h1">
        Design
      </Heading>
      <Stack space="large">
        <Heading as="h2">Button:</Heading>
        <Stack as="section" space="medium">
          <div>
            <Button>Button</Button>
          </div>
          <div>
            <Button href="/">ButtonLink</Button>
          </div>
          <div>
            <Button isFullWidth>Full Width Button</Button>
          </div>
          <div>
            <Button isDisabled>Disabled</Button>
          </div>
        </Stack>
        <Heading as="h2">Heading:</Heading>
        <Stack as="section" space="medium">
          <Heading as="h1">H1</Heading>
          <Heading as="h2">H2</Heading>
          <Heading as="h3">H3</Heading>
          <Heading as="h4">H4</Heading>
          <Heading as="h5">H5</Heading>
          <Heading as="h6">H6</Heading>
        </Stack>
        <Heading as="h2">Tiles:</Heading>
        <Stack as="section" space="medium">
          <Tiles columns={{ '@initial': 2, '@m': 4 }} space="medium">
            <div style={placeholder}>1</div>
            <div style={placeholder}>2</div>
            <div style={placeholder}>3</div>
            <div style={placeholder}>4</div>
          </Tiles>
          <Tiles columns={4} space="medium">
            <div style={placeholder}>1</div>
            <div style={placeholder}>2</div>
            <div style={placeholder}>3</div>
            <div style={placeholder}>4</div>
          </Tiles>
        </Stack>
        <Heading as="h2">Cards:</Heading>
        <Tiles columns={{ '@initial': 2, '@m': 4 }} space="medium">
          <Card>1</Card>
          <Card>2</Card>
          <Card>3</Card>
          <Card>4</Card>
        </Tiles>
      </Stack>
    </div>
  )
}

export default Design
