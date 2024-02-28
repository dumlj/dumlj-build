## BACKGROUND

When using the NextJS App Router, it is currently not possible to use `next/dynamic` for code splitting within Server Components. This necessitates calling `next/dynamic` within Client Components, leading to an extra layer of reference wrapping in the code. This plugin was primarily created to enhance the development experience by providing a convention-based approach to virtually wrap client components, thereby achieving code splitting.

For more discussion on this issue, refer to this [ISSUE link](https://github.com/vercel/next.js/issues/49454#issuecomment-1830053413).

This plugin has been developed to supplement features currently lacking in the official release. Should the official development team implement these code-splitting capabilities, the maintenance and development of this plugin will be discontinued.
