<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-uploader)&nbsp;
[![NPM Version](https://badge.fury.io/js/@dumlj%2Ffeature-uploader.svg)](https://www.npmjs.com/package/@dumlj/feature-uploader)&nbsp;
[![See Docs](https://img.shields.io/badge/see-docs-blue?logo=dumi&logoColor=green)](https://dumlj.github.io/dumlj-build/docs)&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;
[![DeepSource](https://app.deepsource.com/gh/dumlj/dumlj-build.svg/?label=active+issues&show_trend=true&token=YtSFFZ702Q016pjWlBWT30Iy)](https://app.deepsource.com/gh/dumlj/dumlj-build/)&nbsp;

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

<pre>
<b>@dumlj/feature-uploader</b>

</pre>
