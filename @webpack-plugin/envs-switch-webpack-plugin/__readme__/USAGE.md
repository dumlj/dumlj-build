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

## NOTICE

- When `process is not defined` appears, please check whether the variable exists in the `root/path/.env` file.
- If an environment variable does not exist in a specific environment, please check whether the corresponding `dotenv/{env}.env` file exists.
- If the variables are determined only during compilation, you can additionally use `DefinePlugin` for variable substitution, but these variables will not be compiled into dynamic environment variables.
- When compiling, please make sure that the files under `dotenv` have the definitions of all environment variables (subject to `root/path/.env`). Even if the environment does not require the environment variables, you still need to declare the variables.
