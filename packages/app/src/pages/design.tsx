import React from 'react'

import { Head } from 'components/Head'
import { Heading } from 'components/Heading'
import { Stack } from 'components/Stack'
import { Button } from 'components/Button'

const Design = () => {
  return (
    <div>
      <Head title="Design" />
      <Heading component="h1">Design</Heading>
      <Stack space="large">
        <Heading component="h2">Button:</Heading>
        <Stack component="section" space="medium">
          <Button>Button</Button>
          <Button href="/">ButtonLink</Button>
          <Button isFullWidth>Full Width Button</Button>
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
      </Stack>
    </div>
  )
}

export default Design
