import { defenv } from '@/misc/defenv'

describe('misc/defenv', () => {
  it('should return an object with raw and stringified properties', () => {
    const render = (_: TemplateStringsArray, key: string, value: string) => `${key}=${value}`
    const variables = {
      FOO: 'bar',
      BAZ: 'qux',
    }

    const result = defenv(render)(variables)

    expect(result).toEqual({
      raw: {
        FOO: 'bar',
        BAZ: 'qux',
      },
      stringified: {
        'process.env.FOO': '"FOO"="bar"',
        'process.env.BAZ': '"BAZ"="qux"',
      },
    })
  })

  it('should use a custom prefix if provided', () => {
    const render = (_: TemplateStringsArray, key: string, value: string) => `${key}=${value}`
    const variables = {
      FOO: 'bar',
      BAZ: 'qux',
    }
    const result = defenv(render, { prefix: 'MY_PREFIX_' })(variables)

    expect(result).toEqual({
      raw: {
        FOO: 'bar',
        BAZ: 'qux',
      },
      stringified: {
        MY_PREFIX_FOO: '"FOO"="bar"',
        MY_PREFIX_BAZ: '"BAZ"="qux"',
      },
    })
  })

  it('should handle dynamic values in the template', () => {
    const render = (_: TemplateStringsArray, key: string, value: string) => {
      if (key === '"FOO"') {
        return `${key}=${value.toUpperCase()}`
      }

      return `${key}=${value}`
    }

    const variables = {
      FOO: 'bar',
      BAZ: 'qux',
    }

    const result = defenv(render)(variables)

    expect(result).toEqual({
      raw: {
        FOO: 'bar',
        BAZ: 'qux',
      },
      stringified: {
        'process.env.FOO': '"FOO"="BAR"',
        'process.env.BAZ': '"BAZ"="qux"',
      },
    })
  })
})
