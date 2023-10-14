import type { Command } from 'commander'

export type Method = Exclude<
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [method in keyof Command]: method extends `add${infer _}` ? method : never
  }[keyof Command],
  'addHelpText'
>

export const registerEnhance =
  <E extends Method, T extends Exclude<Parameters<Command[E]>[0], string | boolean | number>>(attachMethod: E, enhancersMaker: () => T[]) =>
  (command: Command) => {
    if (!(attachMethod in command)) {
      return command
    }

    const enhancers = enhancersMaker()
    enhancers.forEach((enhancer) => command[attachMethod](enhancer as any))
    return command
  }

export const enhance =
  (...enhancers: Array<ReturnType<typeof registerEnhance>>) =>
  (command: Command) => {
    const enhance = [...enhancers]
    while (enhance.length) {
      const fn = enhance.shift()
      fn(command)
    }

    return command
  }
