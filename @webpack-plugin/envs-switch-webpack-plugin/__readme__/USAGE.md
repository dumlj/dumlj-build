## USAGE

```bash
$ echo 'process.env.APP_ENV=production' > dotenv/production.env
$ echo 'process.env.APP_ENV=development' > dotenv/development.env
$ echo 'process.env.APP_ENV=default' > .env
```

```ts
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'

export default {
  // ...
  plugins: [new EnvsSwitchWebpackPlugin()],
}
```
