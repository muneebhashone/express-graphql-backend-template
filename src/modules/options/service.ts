import { NexusGenObjects } from 'nexus-typegen'
import fs from 'node:fs/promises'
import path from 'node:path'

export const getTimezones = async (): Promise<
  NexusGenObjects['Timezone'][]
> => {
  const states = await fs.readFile(
    path.resolve('.', 'json/timezones.json'),
    'utf-8'
  )

  return JSON.parse(states)
}
