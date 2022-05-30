const user = require('./user')
const room = require('./codx-room')
const company = require('./company')

const codx = {}
module.exports = strapi => {
  strapi.codx = codx
  codx.user = user.bind(codx)(strapi)
  codx.room = room.bind(codx)(strapi)
  codx.company = company.bind(codx)(strapi)
  codx.activity = room.bind(codx)(strapi)
  return codx
}