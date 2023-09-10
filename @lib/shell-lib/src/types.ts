export interface Dependencies {
  [name: string]: {
    version: string
    dependencies?: Dependencies
  }
}

export interface Package {
  name: string
  version: string
  dependencies?: Dependencies
}
