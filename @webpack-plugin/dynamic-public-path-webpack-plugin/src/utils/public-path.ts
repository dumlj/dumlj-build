export type MapDynamicPublicPathsCallback = (item: { filename: string; publicPath: string }, index: number) => any
export function mapDynamicPublicPaths<T extends MapDynamicPublicPathsCallback>(publicPaths: Record<string, string>, callback: T): ReturnType<T>[] {
  return Object.keys(publicPaths).map((filename, index) => {
    const publicPath = publicPaths[filename]
    return callback({ filename, publicPath }, index)
  })
}
