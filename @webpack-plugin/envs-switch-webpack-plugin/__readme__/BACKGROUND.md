## BACKGROUND

Because the environment variables in static projects are generally injected into the code through `DefinePlugin`, which can not only change the dynamic switch when the environment is changed, it needs to be recompiled.

The tool is designed to solve this problem by dynamically switching variables before publication to achieve no repeat compilation.

## PRINCIPLE

Replace environment variable codes (e.g. `process.env.name`) with `Object.oFn(name, defaultValue)` via `DefinePlugin`.
The `name` in parameter of `oFn` is a hash value that changes every time when it is compiled.
The `name` refers to the variable name `process.env.{name}`.
The `defaultValue` is the variable in `.env` when it is compiled.
If you don't switch the environment, the function will eventually return to the default value.
