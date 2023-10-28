export interface MakeTsConfigOptions {
  /** 支持 ts 别名 */
  supportAlias?: boolean
}

export const makeTsConfig = (tsconfig: Record<string, any>, options?: MakeTsConfigOptions) => {
  const { supportAlias = false } = options || {}
  const compilerOptions = {
    ...(tsconfig?.compilerOptions || {}),
    declaration: true,
    emitDeclarationOnly: true,
  }

  if (supportAlias) {
    compilerOptions.plugins = [
      ...(compilerOptions?.plugins || []),
      // 路径别名，编译成 .d.ts
      {
        transform: 'typescript-transform-paths',
        useRootDirs: true,
        afterDeclarations: true,
        exclude: ['**/node_modules/**'],
      },
    ]
  }

  return { ...tsconfig, compilerOptions }
}
