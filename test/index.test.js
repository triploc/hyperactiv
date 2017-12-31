const hyperactiv = require('./hyperactiv.js')
const { computed, observe, dispose } = hyperactiv

const delay = time => new Promise(resolve => setTimeout(resolve, time))

test('simple computation', () => {
    const obj = observe({
        a: 1, b: 2
    })

    let result = 0

    const sum = computed(() => {
        result = obj.a + obj.b
    }, { autoRun: false })
    sum()

    expect(result).toBe(3)
    obj.a = 2
    expect(result).toBe(4)
    obj.b = 3
    expect(result).toBe(5)
})

test('auto-run computed function', () => {
    const obj = observe({
        a: 1, b: 2
    })

    let result = 0

    computed(() => {
        result = obj.a + obj.b
    })

    expect(result).toBe(3)
})

test('multiple getters', () => {
    const obj = observe({
        a: 1,
        b: 2,
        sum: 0
    }, { props: [ 'a', 'b' ]})

    computed(() => {
        obj.sum += obj.a
        obj.sum += obj.b
        obj.sum += obj.a + obj.b
    }, { autoRun: true })

    // 1 + 2 + 3
    expect(obj.sum).toBe(6)

    obj.a = 2

    // 6 + 2 + 2 + 4
    expect(obj.sum).toBe(14)
})

test('nested functions', () => {
    const obj = observe({
        a: 1,
        b: 2,
        c: 3,
        d: 4
    })

    let result

    const aPlusB = () => {
        return obj.a + obj.b
    }
    const cPlusD = () => {
        return obj.c + obj.d
    }

    computed(() => {
        result = aPlusB() + cPlusD()
    })

    expect(result).toBe(10)
    obj.a = 2
    expect(result).toBe(11)
    obj.d = 5
    expect(result).toBe(12)
})

test('multiple observed objects', () => {
    const obj1 = observe({ a: 1 })
    const obj2 = observe({ a: 2 })
    const obj3 = observe({ a: 3 })

    let result = 0

    computed(() => {
        result = obj1.a + obj2.a + obj3.a
    })

    expect(result).toBe(6)
    obj1.a = 0
    expect(result).toBe(5)
    obj2.a = 0
    expect(result).toBe(3)
    obj3.a = 0
    expect(result).toBe(0)
})

test('dispose computed functions', () => {
    const obj = observe({ a: 0 })
    let result = 0
    let result2 = 0

    const minusOne = computed(() => {
        result2 = obj.a - 1
    })
    const addOne = computed(() => {
        result = obj.a + 1
    })

    obj.a = 1
    expect(result).toBe(2)
    expect(result2).toBe(0)
    dispose(minusOne)
    obj.a = 10
    expect(result).toBe(11)
    expect(result2).toBe(0)
})

test('asynchronous computation', async () => {
    const obj = observe({ a: 0, b: 0 })

    const addOne = () => {
        obj.b = obj.a + 1
    }
    const delayedAddOne = computed(
        () => delay(200).then(addOne),
        { autoRun: false }
    )
    await delayedAddOne()

    obj.a = 2
    expect(obj.b).toBe(1)

    await delay(250).then(() => {
        expect(obj.b).toBe(3)
    })
})

test('release capture on asynchronous computation error', async () => {
    expect.assertions(1)

    const obj = observe({ a: 0, b: 0, sum: 0 })
    const error = computed(() => delay(200).then(() => {
        obj.sum = obj.a + 1
        throw new Error()
    }), { autoRun: false })

    try { 
        await error()
    } catch(e) { 
        expect(e instanceof Error).toBe(true)
    }

    obj.b = 1
})

test('concurrent asynchronous computations', async () => {
    const obj = observe({ a: 0, b: 0 })
    let result = 0

    const plusA = computed(async ({ capture: { stop, resume }}) => {
        stop()
        await delay(200)
        resume()
        result += obj.a
        stop()
    }, { autoRun: false })
    const plusB = computed(async ({ capture: { stop, resume }}) => {
        stop()
        await delay(200)
        resume()
        result += obj.b
        stop()
    }, { autoRun: false })

    await Promise.all([ plusA(), plusB() ])

    obj.a = 1
    obj.b = 2

    await delay(250).then(() => {
        expect(result).toBe(3)
    })
})

test('observe arrays', () => {
    const arr = observe([1, 2, 3])
    let sum = 0
    computed(() => sum = arr.reduce((acc, curr) => acc + curr))
    expect(sum).toBe(6)

    arr[0] = 2
    expect(sum).toBe(7)
})

test('usage with "this"', () => {
    const obj = observe({
        a: 1,
        b: 2,
        doSum: function() {
            this.sum = this.a + this.b
        }
    })

    obj.doSum = computed(obj.doSum.bind(obj))
    expect(obj.sum).toBe(3)
    obj.a = 2
    expect(obj.sum).toBe(4)
})

test('"class" syntax', () => {
    class MyClass {
        constructor() {
            this.a = 1
            this.b = 2

            const _this = observe(this)
            this.doSum = computed(this.doSum.bind(_this))
            return _this
        }

        doSum() {
            this.sum = this.a + this.b
        }
    }

    const obj = new MyClass()
    expect(obj.sum).toBe(3)
    obj.a = 2
    expect(obj.sum).toBe(4)
})

test('observe only certain object properties', () => {
    const obj = observe({
        a: 0,
        b: 0,
        sum: 0
    }, { props: ['a'] })

    const doSum = computed(function() {
        obj.sum = obj.a + obj.b
    })

    obj.a = 1
    expect(obj.sum).toBe(1)
    obj.b = 1
    expect(obj.sum).toBe(1)
})