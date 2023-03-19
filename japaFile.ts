import execa from 'execa'
import getPort from 'get-port'
import { configure } from 'japa'
import { join } from 'path'
import sourceMapSupport from 'source-map-support'

import 'reflect-metadata'

process.env.NODE_ENV = 'test'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: true })

async function runMigrations() {
  await execa.execaNode('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

async function rollbackMigrations() {
  await execa.execaNode('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

// cria as migrations antes de iniciar o server e após os testes faz o rollback das
configure({
  files: ['test/**/*.spec.ts/'],
  before: [runMigrations, startHttpServer],
  after: [rollbackMigrations],
})
