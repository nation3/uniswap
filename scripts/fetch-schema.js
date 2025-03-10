/* eslint-env node */

require('dotenv').config({ path: '.env.production' })
const child_process = require('child_process')
const fs = require('fs/promises')
const { promisify } = require('util')
const dataConfig = require('../graphql.data.config')
const thegraphConfig = require('../graphql.thegraph.config')

const exec = promisify(child_process.exec)

async function fetchSchema(url, outputFile) {
  try {
    const { stdout } = await exec(`yarn --silent get-graphql-schema --h Origin=https://app.uniswap.org ${url}`);
    await fs.writeFile(outputFile, stdout);
  } catch(err){
    console.error(`Failed to fetch schema from ${url}`)
  }
}

fetchSchema(process.env.THE_GRAPH_SCHEMA_ENDPOINT, thegraphConfig.schema)
fetchSchema(process.env.REACT_APP_AWS_API_ENDPOINT, dataConfig.schema)
