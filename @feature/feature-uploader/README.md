<!-- This file is dynamically generated. please edit in __readme__ -->

# Feature Uploader

Corss platform uploader.

## BACKGROUND

The tool is mainly designed to smooth the SDK upload interfaces of different CDN Service Providers and use some unified methods to connect to various CDN Service Providers.

## FEATURE

- Support OSS
- Support S3

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/feature-uploader
# use yarn
$ yarn add --dev @dumlj/feature-uploader
# use pnpm
$ pnpm add @dumlj/feature-uploader -D
```

## USAGE

### OSS

```ts
import { OSSClient } from '@dumlj/feature-uploader'
const oss = new OSSClient({ bucket, region, accessKeyId, accessKeySecret })
// fileKey is the final name in cdn service
await oss.upload('hello world', { fileName: 'a.js', fileKey: 'a.hash.js' })
```

### S3

```ts
import { S3Client } from '@dumlj/feature-uploader'
const s3 = new S3Client({ bucket, region, accessKeyId, accessKeySecret })
// fileKey is the final name in cdn service
await s3.upload('hello world', { fileName: 'a.js', fileKey: 'a.hash.js' })
```

## INTERNAL DEPENDENCIES
