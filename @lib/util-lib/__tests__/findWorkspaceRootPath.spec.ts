import path from 'path'
import { findWorkspaceRootPath } from '@/findWorkspaceRootPath'

describe('test findWorkspaceRootPath', () => {
  const rootPath = path.join(__dirname, '../../../').replace(/\/$/, '')

  it('can find root path in workspace', async () => {
    expect(await findWorkspaceRootPath()).toBe(rootPath)
  })
})
