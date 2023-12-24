import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schemas'

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
