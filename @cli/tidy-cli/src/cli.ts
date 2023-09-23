import { registerCli } from '@dumlj/seed-cli'

import './commands/tidyDeps'
import './commands/tidyTscfg'
import './commands/tidyReadme'

registerCli('dumlj-tidy')
