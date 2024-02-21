import kebabCase from 'lodash/kebabCase'
import type { Assign } from 'utility-types'
import { type Plugin } from 'vite'

/** 遍历返回函数的返回类型 */
export type EachReturnType<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never
}

/** 增强 */
export type VitePluginEnhancer = (name: string) => any
/** 增强集合 */
export type VitePluginEnhancerRecord = Record<string, VitePluginEnhancer>

/**
 * Vite 插件实例
 * @description
 * 主要去除名称，因为名称会自动注入
 */
export type VitePluginInstance = Omit<Plugin, 'name'>

/** Vite 插件 */
export type VitePlugin = (...args: any[]) => VitePluginInstance

/**
 * 插件工厂函数
 * @description
 * 这里返回第一个函数是为了入参，第二个函数是为了注入增强（为了继承）
 */
export type VitePluginFactory<E extends VitePluginEnhancerRecord, I extends VitePluginInstance> = (...args: any[]) => (enhancers: EachReturnType<E>) => I

/** 插件增强工厂函数 */
export type VitePluginEnhancerFactory<E extends VitePluginEnhancerRecord, F extends VitePlugin> = (enhancerFactory: (name: string) => EachReturnType<E>) => F

/**
 * 插件增强最终形态
 * @description
 * connect 主要为了结合 VitePluginFactory 完成增强的注入
 * enhance 主要为了扩展增强
 */
export interface VitePluginEnhancers<E extends VitePluginEnhancerRecord> {
  connect<F extends VitePlugin>(factory: VitePluginEnhancerFactory<E, F>): F
  enhance<NE extends VitePluginEnhancerRecord>(extendsFactories: Partial<NE>): VitePluginEnhancers<Assign<E, NE>>
}

/** 创建增强集合 */
export const createVitePluginEnhancers = <E extends VitePluginEnhancerRecord>(enhanceFactories: Partial<E> = {}): VitePluginEnhancers<E> => {
  const connectEnhancers = (name: string) => {
    const enhancers = Object.keys(enhanceFactories).reduce((result, key: keyof E) => {
      const fn = enhanceFactories[key]
      if (typeof fn === 'function') {
        result[key] = fn(name)
      }

      return result
    }, {} as EachReturnType<E>)

    return enhancers
  }

  const connect = <F extends VitePlugin>(factory: VitePluginEnhancerFactory<E, F>) => {
    return factory(connectEnhancers)
  }

  const enhance = <NE extends VitePluginEnhancerRecord>(extendsFactories: Partial<NE> = {}) => {
    const factories = Object.assign({}, enhanceFactories, extendsFactories) as Assign<E, NE>
    const { connect, enhance } = createVitePluginEnhancers(factories)
    return { connect, enhance }
  }

  return { connect, enhance }
}

/** 创建插件 */
export const createVitePlugin = <E extends VitePluginEnhancerRecord, I extends VitePluginInstance, F extends VitePluginFactory<E, I>>(name: string, factory: F) => {
  return (enhancerFactory: (name: string) => EachReturnType<E>) => {
    return (...args: Parameters<F>): Assign<{ name: string }, ReturnType<ReturnType<F>>> => {
      const alias = kebabCase(name)
      /** 增强能力，辅助函数服务等 */
      const enhancers = enhancerFactory(alias)
      /** 插件工厂函数 */
      const create = factory(...args)
      /** 插件实例 */
      const instance = create(enhancers) as ReturnType<ReturnType<F>>
      // 附上名称
      return { ...instance, name: alias }
    }
  }
}
