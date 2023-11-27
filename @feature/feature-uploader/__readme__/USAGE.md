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
