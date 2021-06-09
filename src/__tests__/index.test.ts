import { action } from '..'

const asyncTimeout = (timeout?: number) => new Promise(resolve => setTimeout(resolve, timeout))

describe('Action', () => {
  test('executing', () => {
    const queue: number[] = []

    const push = (n: number) => {
      queue.push(n)
    }

    const one = action()
    const two = one.next()
    const three = two.next()

    one.add(() => asyncTimeout(50).then(() => push(3)))
    one.add(() => asyncTimeout(20).then(() => push(2)))

    two.add(() => asyncTimeout(30).then(() => push(6)))
    two.add(() => asyncTimeout(20).then(() => push(5)))

    two.add(() => asyncTimeout(10).then(() => push(4)))
    three.add(() => asyncTimeout(30).then(() => push(7)))
    one.add(() => asyncTimeout(10).then(() => push(1)))

    return asyncTimeout(200).then(() => {
      expect(queue).toMatchObject([1, 2, 3, 4, 5, 6, 7])
    })
  })
})
