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
      <Heading component="h1">Design</Heading>
      <Stack space="large">
        <Heading component="h2">Button:</Heading>
        <Stack component="section" space="medium">
          <Button>Button</Button>
          <Button href="/">ButtonLink</Button>
          <Button isFullWidth>Full Width Button</Button>
          <Button isDisabled>Disabled</Button>
        </Stack>
        <Heading component="h2">Heading:</Heading>
        <Stack component="section" space="medium">
          <Heading component="h1">H1</Heading>
          <Heading component="h2">H2</Heading>
          <Heading component="h3">H3</Heading>
          <Heading component="h4">H4</Heading>
          <Heading component="h5">H5</Heading>
          <Heading component="h6">H6</Heading>
        </Stack>
        <Heading component="h2">Tiles:</Heading>
        <Stack component="section" space="medium">
          <Tiles columns={{ default: 2, tablet: 4 }} space="medium">
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
        <Heading component="h2">Cards:</Heading>
        <Tiles columns={{ default: 2, tablet: 4 }} space="medium">
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
