import semver from 'semver'

export const diff = (target: string, compare: string) => {
  const tSemver = semver.parse(target)
  const cSemver = semver.parse(compare)

  if (!tSemver || !cSemver) {
    throw new Error('invalid version')
  }

  // 对比主版本
  if (tSemver.major !== cSemver.major) {
    if (tSemver.comparePre(cSemver) > 0) {
      return 'premajor'
    }

    return 'major'
  }

  /** 对比功能版本 */
  if (tSemver.minor !== cSemver.minor) {
    if (tSemver.comparePre(cSemver) > 0) {
      return 'preminor'
    }

    return 'minor'
  }

  /** 对比补丁版本 */
  if (tSemver.patch !== cSemver.patch) {
    if (tSemver.comparePre(cSemver) > 0) {
      return 'prepatch'
    }

    return 'patch'
  }

  return false
}

export type DiffValues = ReturnType<typeof diff>
