import RTCMulticonnection from './rtcmulticonnnection'

export default settings => {
  const connection = new RTCMulticonnection(settings)
  const methods = [
    { name: 'openOrJoin', fnparams: ['isRoomCreated', 'roomId', 'error'] }
  ]
  methods.forEach(({ name, fnparams }) => {
      const fn = connection[name]
      fn.bind(connection)
      connection[name] = (...args) =>
        new Promise((ok, ko) => {
          args.push(function () {
            const res = {}
            const fargs = [...arguments]
            fargs.map((arg, ix) => {
              res[fnparams[ix]] = arg
            })
            const { error } = res
            error ? ko(error) : ok(res)
          })
          fn(...args)
        })
  })
  return connection
}