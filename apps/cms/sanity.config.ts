import {defineConfig} from '@sanity-typed/types'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {InferSchemaValues} from '@sanity-typed/types'

const config = defineConfig({
  name: 'default',
  title: 'escape-theme-park',
  projectId: 'fbt3ts82',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

export default config

export type SanityValues = InferSchemaValues<typeof config>
