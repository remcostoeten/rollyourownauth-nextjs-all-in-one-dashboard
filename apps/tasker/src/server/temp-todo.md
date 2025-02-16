## TODO

## Finance api

-   Finish prisma example env vs drizzle example env for datbase validation.
-   Finish the prisma sepration of concerns utillity tool.
-   Finish the prisma from sqlite to postgres migration tool.

## Generate secret script

-   Finis shell script for OS agnostic JWT generation to clipboard
    -   Add new documentation subject `utilities` (or `scripts` or `helpers`)
        -   Add documentation subject `jwt`
            Explain the script and why we do that (hint: agnostic OS) - Show `package.json` script equivalent
        -   Add docstring creation tool from `apps/rollyourownauth+aio/src/server/env.ts` (if any good, do audit).
        -   Add extract `.ts` file with multiple functions to a completely seprated of concerned style folder with `index.ts` file and each function in its own file. \*\* This script live somwhere on on my github in either `prisma`, `aio` ,`sb` , `og ryoa`, `notevault`, or `dash starter` repo.
        -   Add shadcn migrate individual import lines to singular `import {A,B,C} from 'ui'` script. Same location as above.
        -   Implement either devbuddy CLI or extract the shadcn manager to a standalone script.
            -
        -   Add documentation subject `cli`
    -   Add documentation subject `scripts`
    -   Add documentation subject `helpers`
    -   Add documentation subject `utilities`
    -   Add documentation subject `scripts`
