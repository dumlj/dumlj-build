export interface FilenameParts {
  folder: string
  stem: string
  extname: string
}

export interface VirtualBuilderContext extends FilenameParts {
  file: string
  origin: string
}

export interface VirtualBuilder {
  (context: VirtualBuilderContext): string
}

export interface Loader {
  loader: string
  options?: any
}
