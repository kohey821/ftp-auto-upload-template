import { watch } from 'chokidar'
import { Client } from 'basic-ftp'
import { resolve, relative } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const {
  LOCAL_ROOT,
  REMOTE_ROOT,
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
} = process.env

/**
  * @type {string} path
  */
async function upload(path) {
  const client = new Client()

  client.ftp.verbose = true

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false,
    })

    const relativePath = relative(LOCAL_ROOT, path)
    const remotePath = `${REMOTE_ROOT}/${relativePath}`
    await client.uploadFrom(path, remotePath)
  } catch (err) {
    console.log(err)
  }

  client.close()
}

watch(resolve(import.meta.dirname, LOCAL_ROOT))
  .on('change', (path) => { upload(path) })

