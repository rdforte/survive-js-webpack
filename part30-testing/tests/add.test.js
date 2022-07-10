const assert = require('assert')
const add = require('./add')

describe('Demo', () => {
	it('should add the two numbers correctly', () => {
		assert.equal(add(1, 1), 2)
	})
})
