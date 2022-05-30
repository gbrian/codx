module.exports = strapi => ({
  async login (user) {
    strapi.$api('user-activity').create({ ctx: })
  }
})