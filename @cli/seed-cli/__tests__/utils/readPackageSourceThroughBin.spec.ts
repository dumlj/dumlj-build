import { fs, vol } from 'memfs'
import { readPackageSourceThroughBin } from '@/utils/readPackageSourceThroughBin'

jest.mock('fs', () => fs)

describe('test utils/readPackageSourceThroughBin', () => {
  afterEach(() => {
    vol.reset()
  })

  it('can find file package.json from the project where BIN is located', async () => {
    vol.fromJSON({
      '/package.json': JSON.stringify({ name: 'root' }),
      '/bin': 'echo "ok"',
      '/packages/a/package.json': JSON.stringify({ name: 'a' }),
      '/packages/a/bin': 'echo "ok"',
      '/packages/b/package.json': JSON.stringify({ name: 'b' }),
      '/packages/b/path/bin': 'echo "ok"',
    })

    expect(await readPackageSourceThroughBin('/bin')).toStrictEqual({ name: 'root' })
    expect(await readPackageSourceThroughBin('/packages/a/bin')).toStrictEqual({ name: 'a' })
    expect(await readPackageSourceThroughBin('/packages/b/path/bin')).toStrictEqual({ name: 'b' })
  })

  it('will return null when pacakge.json not found.', async () => {
    vol.fromJSON({
      '/bin': 'echo "ok"',
      '/packages/a/package.json': JSON.stringify({ name: 'a', bin: "./bin" }),
    })

    expect(await readPackageSourceThroughBin('/bin')).toBeNull()
  })
})
