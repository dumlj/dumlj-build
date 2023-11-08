## BACKGROUND

Some static services cannot automatically switch to the nearest CDN service provider based on the user's region.
When a static project has multiple different CDN service providers, it will automatically switch to the nearest service provider.
By generating `html` entries for different service providers, it can be provided to `Nginx` and other users in different regions to quickly match the nearest CDN service provider.
