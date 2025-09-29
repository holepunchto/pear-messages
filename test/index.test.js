'use strict'
const test = require('brittle')
const b4a = require('b4a')
const sodium = require('sodium-native')
const Iambus = require('iambus')
const { isWindows } = require('which-runtime')
const IPC = require('pear-ipc')
global.Pear = {}
const messages = require('..')

function pipeId(s) {
  const buf = b4a.allocUnsafe(32)
  sodium.crypto_generichash(buf, b4a.from(s))
  return b4a.toString(buf, 'hex')
}

test('messages(pattern)', async (t) => {
  t.plan(2)
  const kIPC = Symbol('test.ipc')
  const socketPath = isWindows
    ? `\\\\.\\pipe\\test-${pipeId(__dirname)}`
    : __dirname + '/test.sock' // eslint-disable-line
  const bus = new Iambus()
  const srv = new IPC.Server({
    socketPath,
    handlers: {
      messages(pattern) {
        const sub = bus.sub(pattern)
        bus.pub({ some: 'props', to: { pattern: ['match', 'against'] } })
        setImmediate(() => sub.end())
        return sub
      }
    }
  })
  t.teardown(() => srv.close())
  await srv.ready()
  const ipc = new IPC.Client({ socketPath })
  t.teardown(() => ipc.close())
  await ipc.ready()
  class API {
    static IPC = kIPC
    get [kIPC]() {
      return ipc
    }
    teardown(fn, pos) {
      t.is(pos, undefined)
    }
  }
  global.Pear = new API()

  const stream = messages({ some: 'props' })
  stream.on('data', (msg) => {
    t.alike({ some: 'props', to: { pattern: ['match', 'against'] } }, msg)
  })
})

test('messages(pattern, listener)', async (t) => {
  t.plan(2)
  const kIPC = Symbol('test.ipc')
  const socketPath = isWindows
    ? `\\\\.\\pipe\\test-${pipeId(__dirname)}`
    : __dirname + '/test.sock' // eslint-disable-line
  const bus = new Iambus()
  const srv = new IPC.Server({
    socketPath,
    handlers: {
      messages(pattern) {
        const sub = bus.sub(pattern)
        bus.pub({ some: 'props', to: { pattern: ['match', 'against'] } })
        setImmediate(() => sub.end())
        return sub
      }
    }
  })
  t.teardown(() => srv.close())
  await srv.ready()
  const ipc = new IPC.Client({ socketPath })
  t.teardown(() => ipc.close())
  await ipc.ready()
  class API {
    static IPC = kIPC
    get [kIPC]() {
      return ipc
    }
    teardown(fn, pos) {
      t.is(pos, undefined)
    }
  }
  global.Pear = new API()

  messages({ some: 'props' }, (msg) => {
    t.alike({ some: 'props', to: { pattern: ['match', 'against'] } }, msg)
  })
})

test('messages(listener, pattern)', async (t) => {
  t.plan(2)
  const kIPC = Symbol('test.ipc')
  const socketPath = isWindows
    ? `\\\\.\\pipe\\test-${pipeId(__dirname)}`
    : __dirname + '/test.sock' // eslint-disable-line
  const bus = new Iambus()
  const srv = new IPC.Server({
    socketPath,
    handlers: {
      messages(pattern) {
        const sub = bus.sub(pattern)
        bus.pub({ some: 'props', to: { pattern: ['match', 'against'] } })
        setImmediate(() => sub.end())
        return sub
      }
    }
  })
  t.teardown(() => srv.close())
  await srv.ready()
  const ipc = new IPC.Client({ socketPath })
  t.teardown(() => ipc.close())
  await ipc.ready()
  class API {
    static IPC = kIPC
    get [kIPC]() {
      return ipc
    }
    teardown(fn, pos) {
      t.is(pos, undefined)
    }
  }
  global.Pear = new API()

  messages(
    (msg) => {
      t.alike({ some: 'props', to: { pattern: ['match', 'against'] } }, msg)
    },
    { some: 'props' }
  )
})
