import type { setupServer } from 'msw/lib/node'

export type Handlers = Parameters<typeof setupServer>
