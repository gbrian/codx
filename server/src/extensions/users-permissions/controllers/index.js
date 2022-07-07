const codx = require('../../../codx')

module.exports = ({ controllers }) => {
  const { user } = controllers
  const { user: codxUser } = codx(strapi)
  const orgMe = user.me
  user.me = async ctx => {
    await orgMe(ctx)
    const sme = ctx.body
    const codxUserData = await codxUser.me({ id: sme. id })
    ctx.body = codxUserData
  }
  user.find = async ({ request: { query }}) => {
    return codxUser.findPeople(query.q)
  }
  return controllers
}