const request = require('supertest')
const makeApp = require('../app')

const register = jest.fn()

const server = makeApp({ register })

describe('Posts', () => {
  describe('GET /posts', () => {})
  describe('POST /posts', () => {})
  describe('GET /posts/:id', () => {})
  describe('DELETE /posts/:id', () => {})
})
