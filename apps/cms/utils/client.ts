import type {SanityValues} from '../sanity.config'
import {createClient} from '@sanity-typed/client'

export const client = createClient<SanityValues>()({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-12-19',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN || '',
  perspective: 'published',
})
