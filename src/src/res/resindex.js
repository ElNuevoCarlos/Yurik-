const config = require('./data/config');
const pages = require('./data/pages');
module.exports = (checkAuth, app, client, renderTemplate) => {
  config(checkAuth, app, client, renderTemplate);
  pages(checkAuth, app, client, renderTemplate);
}