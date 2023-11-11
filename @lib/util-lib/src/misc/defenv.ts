export type Processify<T extends Record<string, any>> = {
  [K in keyof T]: K extends string ? Record<`process.env.${K}`, T[K]> : never
}

export interface DefenvResp<T extends Record<string, any>> {
  raw: T
  stringified: Processify<T>
}

export type TemplateRenderer = ([]: TemplateStringsArray, key: string, value: string) => string

export interface DefenvOptions {
  prefix?: string
}

export const defenv = <T extends Record<string, string> = Record<string, string>>(render: TemplateRenderer, options?: DefenvOptions) => {
  const { prefix = 'process.env.' } = options || {}
  return (variables: Record<string, any>): DefenvResp<T> => {
    const raw = Object.keys(variables).reduce((env, key) => {
      env[key] = variables[key]
      return env
    }, {}) as T

    const stringified = {
      ...(Object.keys(raw).reduce((env, name) => {
        const key = JSON.stringify(name)
        const value = JSON.stringify(variables[name])

        if (prefix && 0 === name.indexOf(prefix)) {
          const dynamicValue = render`${key} ${value}`
          env[name] = dynamicValue
          return env
        }

        const dynamicValue = render`${key} ${value}`
        env[`${prefix}${name}`] = dynamicValue
        return env
      }, {}) as Processify<T>),
    }

    return { raw, stringified }
  }
}
