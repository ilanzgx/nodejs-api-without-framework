import test from "node:test";
import assert from "node:assert";
const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

import { routes } from './../../../src/routes/heroRoutes.js'
import { DEFAULT_HEADER } from "../../../src/util/util.js";

test('Hero routes - endpoints test suite', async (t) => {
  await t.todo('it should call /heroes:get route', async (t) => {
    const databaseMock = [{
      "id": "f88f7343-de39-4cec-8c45-195c518a3965",
      "name": "Batman",
      "age": 50,
      "power": "Rich" 
    }]

    const heroServiceStub = {
      find: async () => databaseMock
    }

    const endpoints = routes({
      heroService: heroServiceStub
    })

    const endpoint = '/heroes:get'
    const request = {}
    const response = {
      write: callTracker.calls(item => {
        const expected = JSON.stringify({
          results: databaseMock
        })
        assert.strictEqual(
          item,
          expected,
          'write should be called with the correct payload'
        )
      }),
      end: callTracker.calls(item => {
        assert.strictEqual(
          item,
          undefined,
          'end should be called without params'
        )
      })
    }
    
    const route = endpoints[endpoint]
    await route(request, response)
  })
  await t.todo('it should call /heroes:post route')
})