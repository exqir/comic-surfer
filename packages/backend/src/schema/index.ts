import { join } from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'

const typeDefs = loadFilesSync(join(__dirname, '.'), { recursive: true })

export const schema = mergeTypeDefs([DIRECTIVES, ...typeDefs])
