/** 上传参数 */
export interface InitParams {
  /** 目标仓 */
  bucket: string
  /** 源服务器 */
  region: string
  /**
   * access key
   * @description
   * 默认使用 process.env.OSS_AK | process.env.S3_AK
   * 谨慎保存以防泄露
   */
  accessKeyId?: string
  /**
   * access secret
   * @description
   * 默认使用 process.env.OSS_SK | process.env.S3_SK
   * 谨慎保存以防泄露
   */
  accessKeySecret?: string
  /**
   * 自定义资源返回头部
   * @description
   * 主要用于设置 Reponse Header
   * - S3 仅支持 CacheControl
   */
  responseHeaders?: {
    'cache-control'?: string
    [k: string]: string
  }
}

/** 文件信息 */
export interface FileInfo {
  /** 文件名 */
  fileName: string
  /** 文件大小 */
  fileSize: number
  /** CDN 服务地址 */
  fileKey: string
}

/** 进度信息 */
export interface Progress {
  /** 进程百分比 */
  percentage?: number
  /** 传输 */
  transferred?: number
  /** 总量 */
  length?: number
  /** 剩余 */
  remaining?: number
}

/** 重试详情 */
export interface RetryFileInfo extends FileInfo {
  /** 重试次数 */
  times: number
}

/** 上传配置 */
export interface UploadOptions<ClientOptions extends Record<string, any> = never> {
  /** 文件名 */
  fileName?: string
  /** 文件大小 */
  fileSize?: number
  /** CDN 服务地址 */
  fileKey?: string
  /** 进程 */
  onProgress?: (progress: Progress, fileInfo: FileInfo) => void
  /** 重试次数 */
  retryTimes?: number
  /** 重试提醒 */
  onRetry?: (error: Error, fileInfo: RetryFileInfo) => void
  /**
   * 自定义资源返回头部
   * @description
   * 主要用于设置 Reponse Header
   * - S3 仅支持 CacheControl
   */
  responseHeaders?: {
    'cache-control'?: string
    [k: string]: string
  }
  client?: ClientOptions
}

/** 上传返回值 */
export interface UploadResponse {
  /** 文件名 */
  file: string
  /** CDN 服务地址 */
  key: string
  /** 文件内容类型 */
  contentType: string
}
