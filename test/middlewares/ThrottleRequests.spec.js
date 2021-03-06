/* eslint-env jest */
const sinon = require('sinon')
const {
  Crawler,
  ThrottleRequests
} = require('../../')

let mockRequest = jest.fn()
jest.mock('request', () => (...args) => mockRequest.apply(null, args))

describe('apps/ThrottleRequests', () => {
  let app
  let requestOptions
  let clock

  beforeEach(() => {
    requestOptions = {}
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })

  describe('if throttle time is given', () => {
    beforeEach(() => {
      app = new ThrottleRequests({ throttle: 1000 })
    })

    it('sends out the first request right away', done => {
      app.preRequest(requestOptions)
        .then(() => done())
    })

    //  How to make this test work?
    // it.only('waits given time between requests', done => {
    //   const callOrder = []
    //   app.preRequest(requestOptions)
    //     .then(() => {
    //       callOrder.push(3)
    //       console.log(3);
    //       return app.preRequest(requestOptions)
    //     })
    //     .then(() => {
    //       callOrder.push(5)
    //       console.log(5);
    //       return app.preRequest(requestOptions)
    //     })
    //     .then(() => {
    //       console.log('end');
    //       expect(callOrder).toEqual([1, 2, 3, 4, 5])
    //       done()
    //     })
    //   callOrder.push(1)
    //   clock.tick(999)
    //   callOrder.push(2)
    //   console.log(2);
    //   clock.tick(100)
    //   callOrder.push(4)
    //   console.log(4);
    //   clock.tick(1000)
    //   clock.tick(1000)
    //   clock.tick(1000)
    // })
  })

  describe('if there is no throttle given', () => {
    beforeEach(() => {
      app = new ThrottleRequests({})
    })

    it('sends out the first request right away', () => {
      return expect(app.preRequest(requestOptions))
        .resolves.toEqual()
    })

    it('sends out all request right away', () => {
      return expect(app.preRequest(requestOptions)
        .then(() => app.preRequest(requestOptions))
        .then(() => app.preRequest(requestOptions))
        .then(() => app.preRequest(requestOptions))
        .then(() => app.preRequest(requestOptions))
        .then(() => app.preRequest(requestOptions)))
        .resolves.toEqual()
    })
  })

  describe('integration test', () => {
    let crawler
    let requestError
    let getMockResponse
    let calledOptions

    beforeEach(() => {
      getMockResponse = () => ({})
      calledOptions = []
      mockRequest.mockImplementation((options, cb) => {
        calledOptions.push(options)
        cb(requestError, getMockResponse(options))
      })
    })

    afterEach(() => {
      mockRequest.mockClear()
    })

    // no clue how to test that properly
    xit('does not call a page more often then delay says', (done) => {
      crawler = new Crawler({ throttle: 1000 })
      crawler.addApp(config => new ThrottleRequests(config))
      crawler.seed(['http://localhost/item1', 'http://localhost/item2', 'http://localhost/item3'])
        .on('finish', () => {
          expect(calledOptions[0]).toEqual(expect.objectContaining({
            headers: {
              'User-Agent': 'Botty'
            }
          }))

          expect(calledOptions[1]).toEqual(expect.objectContaining({
            headers: {
              'User-Agent': 'GreatBot'
            }
          }))

          expect(calledOptions[2]).toEqual(expect.objectContaining({
            headers: {
              'User-Agent': 'VeryNiceBotIndeed'
            }
          }))
          done()
        })
        .start()

      // console.log(calledOptions);
      // clock.tick(1000)
      // console.log(calledOptions);
    })
  })
})
