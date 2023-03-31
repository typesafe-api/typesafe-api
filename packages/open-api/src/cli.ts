#!/usr/bin/env node

import glob from 'glob-promise';
import { Command } from 'commander';

import writeYamlFile from 'write-yaml-file';
import { endpointDefinitions } from './endpoint-definitions.js';
import { generateOpenApi } from './generate-open-api.js';

const program = new Command();

program
  .option(
    '--tsConfigFile <path to tsconfig.json>',
    'The path to the tsconfig file to use.',
    'tsconfig.json'
  )
  .option(
    '--version <version>',
    'The version number to your for your api spec',
    '1.0.0'
  )
  .option(
    '--output <filepath>',
    'The path to the yaml file where you want to output your API spec',
    'openapi.yml'
  )
  .requiredOption('--title <api title>', 'The title of your api')
  .requiredOption(
    '--routes <glob path(s)>',
    'The glob path or comma separated paths to your routes files, make sure you wrap it in quotes!'
  )
  .parse(process.argv);

const { version, title, tsConfigFile, routes, output } = program.opts();

const main = async () => {
  const globPaths = routes.split(',');

  let files: string[] = [];
  for (const globPath of globPaths) {
    files = files.concat(await glob(globPath));
  }

  const endpointDefs = await endpointDefinitions({
    files,
    tsConfigFile,
  });

  const spec = await generateOpenApi({
    endpointDefs,
    title,
    version,
  });

  await writeYamlFile(output, spec);
  console.log(`Api spec written to: ${output}`);
};

main()
  .then(() => console.log('Finished building api spec.'))
  .catch(console.error);
