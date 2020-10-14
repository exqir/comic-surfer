import React from 'react'

import { Head } from 'components/Head'
import { Stack } from 'components/Stack'
import { Button } from 'components/Button'

const Design = () => {
  return (
    <div>
      <Head title="Design" />

      <p>Button</p>
      <section>
        <Stack space="medium">
          <Button>Button</Button>
          <Button href="/">ButtonLink</Button>
          <Button isFullWidth>Full Width Button</Button>
        </Stack>
      </section>
      <section>
        <Stack component="ul" space="medium">
          <Button>Button</Button>
          <Button href="/">ButtonLink</Button>
          <Button isFullWidth>Full Width Button</Button>
        </Stack>
      </section>
    </div>
  )
}

export default Design
