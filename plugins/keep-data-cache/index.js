module.exports = {
  async onPreBuild({ utils }) {
    await utils.cache.restore("/opt/buildhome/.cache/puppeteer/");
  },

  async onPostBuild({ utils }) {
    await utils.cache.save("/opt/buildhome/.cache/puppeteer/");
  },
};
