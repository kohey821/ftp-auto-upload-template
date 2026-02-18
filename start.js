import { watch } from 'chokidar'
import { Client } from 'basic-ftp'
import { resolve, relative } from 'path'
import { readFileSync } from 'fs'

const file = readFileSync('./settings.json')
const settings = JSON.parse(file)
const {
  localRoot,
  remoteRoot,
  host,
  user,
  password,
  secure,
  ignorePatterns,
} = settings;

/**
  * @type {string} path
  */
async function upload(path) {
  const relativePath = relative(localRoot, path)

  const ignorePatternMatched = ignorePatterns.some((i) => {
    return new RegExp(i).test(relativePath)
  });
  if (ignorePatternMatched) {
    return;
  }

  const client = new Client()

  client.ftp.verbose = true

  try {
    await client.access({
      host,
      user,
      password,
      secure,
    })

    const remotePath = `${remoteRoot}/${relativePath}`
    await client.uploadFrom(path, remotePath)
  } catch (err) {
    console.log(err)
  }

  client.close()
}

watch(resolve(import.meta.dirname, localRoot))
  .on('change', (path) => { upload(path) })

