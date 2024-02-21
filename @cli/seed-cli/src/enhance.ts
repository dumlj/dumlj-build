import type { Command } from 'commander'

export type EnhanceType = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [method in keyof Command]: method extends `add${infer _}` ? method : never
}[keyof Command]

export function registerEnhancer<E extends Exclude<EnhanceType, 'addHelpText'>, T extends Exclude<Parameters<Command[E]>[0], string | boolean | number>>(
  attachMethod: E,
  enhancersMaker: () => T[]
) {
  return function mapEnhancersToCommand(command: Command) {
    if (!(attachMethod in command)) {
      return command
    }

    const enhancers = enhancersMaker()
    enhancers.forEach((enhancer) => {
      command[attachMethod](enhancer as any)
    })

    return command
  }
}

export type Enhancer = ReturnType<typeof registerEnhancer>

export function concatEnhancers(...enhancers: Enhancer[]) {
  return function mapEnhancersToCommand(command: Command) {
    const enhance = [...enhancers]
    while (enhance.length) {
      const fn = enhance.shift()
      typeof fn === 'function' && fn(command)
    }

    return command
  }
}
