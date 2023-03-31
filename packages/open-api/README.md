# OpenAPI

OpenAPI is a well-used spec that can be used to define APIs. This spec can then be used in collaboration with other tools to generate docs and API clients etc.

Install the package with:
```typescript
npm i -D @typesafe-api/open-api
```

Then call the cli like:
```typescript
npx tsx node_modules/@typesafe-api/open-api/src/cli.js --help
```

These are the cli options: 
```
Options:
  --tsConfigFile <path to tsconfig.json>  The path to the tsconfig file to use. (default: "tsconfig.json")
  --version <version>                     The version number to your for your api spec (default: "1.0.0")
  --output <filepath>                     The path to the yaml file where you want to output your API spec (default: "openapi.yml")
  --title <api title>                     The title of your api
  --routes <glob path(s)>                 The glob path or comma separated paths to your routes files, make sure you wrap it in quotes!
  -h, --help                              display help for command
```

An example command to generate an OpenApi spec would be:
```typescript
npx tsx node_modules/@typesafe-api/open-api/src/cli.js --title my-api --routes "path-to-route-definitions/**/*.ts"
```

### Development

Run this command from the root of the project in order to test the cli

```typescript
npx tsx ./packages/open-api/src/cli.ts --title my-api --tsConfigFile packages/core/tsconfig.spec.json --routes "packages/core/test/**/*.ts"
```
