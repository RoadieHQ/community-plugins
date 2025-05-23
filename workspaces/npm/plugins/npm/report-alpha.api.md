## API Report File for "@backstage-community/plugin-npm"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { AnyApiFactory } from '@backstage/core-plugin-api/*';
import { ConfigurableExtensionDataRef } from '@backstage/frontend-plugin-api';
import { ExtensionDefinition } from '@backstage/frontend-plugin-api';
import { FrontendPlugin } from '@backstage/frontend-plugin-api';
import { isNpmAvailable } from '@backstage-community/plugin-npm-common';

// @alpha
const _default: FrontendPlugin<{}, {}, {}>;
export default _default;

// @alpha
export const entityNpmInfoCard: any;

// @alpha
export const entityNpmReleaseOverviewCard: any;

// @alpha
export const entityNpmReleaseTableCard: any;

export { isNpmAvailable };

// @alpha
export const npmBackendApi: ExtensionDefinition<{
  kind: 'api';
  name: 'npmBackendApi';
  config: {};
  configInput: {};
  output: ConfigurableExtensionDataRef<AnyApiFactory, 'core.api.factory', {}>;
  inputs: {};
  params: {
    factory: AnyApiFactory;
  };
}>;

// (No @packageDocumentation comment for this package)
```
