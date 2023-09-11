# Mock 请求服务

## BACKGROUND

对于需要做网络请求的应用，我们通常需要 mock 数据来进行单元测试，或者在开发阶段，我们需要 mock 数据来进行开发，以便于我们不依赖于后端的接口，能够快速的进行开发和稳定的进行单元测试。

## USAGE

### 安装

```bash
# 仅用于本项目
yarn add @lib/mock-server-lib -D
```

### 用于单元测试

```typescript
// setup-jest.ts

import { server } from '@dumlj/mock-server-lib'

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
```

```typescript
// jest.config.ts
import type { Config } from '@jest/types'
export default async (): Promise<Config.InitialOptions> => ({
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
  // 配置 setup-jest
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
})

```

### 增加 mock 路由

```typescript
// @lib/mock-server-lib/src/handlers/newHandlers
import { rest } from 'msw'
import type { Handlers } from '../types'

export const demoHandlers: Handlers = [
  rest.get('https://baidu.com', (req, res, ctx) => {
    return res(ctx.text('baidu.com has been mock'))
  }),
]
```
