import 'graphql-import-node'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'

import Root from 'schema/index.graphql'
import { types } from 'schema/types'
import { queries } from 'schema/queries'
import { mutations } from 'schema/mutations'

export const schema = [DIRECTIVES, Root, ...types, ...queries, ...mutations]
