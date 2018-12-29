const dummy = require('../utils/list_helper').dummy

test('dummy is called', () => {
    expect(dummy([])).toBe(1)
})