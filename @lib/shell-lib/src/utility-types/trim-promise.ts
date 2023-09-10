/** trim promise wrapper */
export type TrimPromise<P> = P extends Promise<infer R> ? R : P
