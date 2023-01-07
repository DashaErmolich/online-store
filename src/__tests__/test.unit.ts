import type * as TestFunctions from '../sum'

const { sum } = jest.requireActual<typeof TestFunctions>('../sum.ts');

const successCases = [
  {
    id: 0,
    input: {a: 1, b: 1},
    output: 2,
  },
  {
    id: 1,
    input: {a: 2, b: 3},
    output: 5,
  },
]

describe('Test sum function', () => {
  it.each(successCases)('success case $id', ({ input, output }) => {
    const { a, b } = input;
    expect(sum(a, b)).toBe(output);
  })
})