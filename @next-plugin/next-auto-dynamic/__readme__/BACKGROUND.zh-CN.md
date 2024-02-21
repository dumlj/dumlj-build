## 背景

在使用 NextJS App Router 的过程中，我们发现在 Server Component 中暂时无法使用 `next/dynamic` 进行代码分割。这意味着我们必须在 Client Component 中调用 `next/dynamic`，这将导致代码中出现额外的引用层级。此插件的设计初衷就是为了优化这一开发体验。通过约定式的方法，我们可以对客户端组件进行虚拟包装，从而实现代码分割。

这个问题的讨论可以参考这个 [ISSUE 链接](https://github.com/vercel/next.js/issues/49454#issuecomment-1830053413)。

> 此插件是为了补充官方版本中目前所缺少的功能而开发的。
> 如果官方开发团队实现了这些代码拆分功能，该插件的维护和开发将停止。
