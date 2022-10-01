const { PermissionsBitField } = require('discord.js');

module.exports = (checkAuth, app, client, renderTemplate) => {
  //GET
  app.get('/', (req, res) => {
    renderTemplate(res, req, 'index.ejs')
  })
  app.get('/Discord', (req, res) => {
    renderTemplate(res, req, 'index.ejs')
  })
  app.get('/dashboard', checkAuth, (req, res) => {
    var guilds_map_bot = []
    var guilds_map_no_bot = []
    req.user.guilds.forEach((guild) => {
      const guild_perms = new PermissionsBitField(guild.permissions.toString())
      if (!guild_perms.has("Administrator")) return
      if (client.guilds.cache.get(guild.id)) {
        guilds_map_bot.push(guild)
      } else {
        guilds_map_no_bot.push(guild)
      }
    })
    renderTemplate(res, req, 'dashboard.ejs', {
      guilds_bot: guilds_map_bot,
      guilds_no_bot: guilds_map_no_bot,
    })
  })

  //POST
  app.post('/', (req, res) => {
    renderTemplate(res, req, 'index.ejs')
  })
  app.post('/dashboard', (req, res) => {
    var guilds_map_bot = []
    var guilds_map_no_bot = []
    req.user.guilds.forEach((guild) => {
      const guild_perms = new PermissionsBitField(guild.permissions.toString())
      if (!guild_perms.has("Administrator")) return
      if (client.guilds.cache.get(guild.id)) {
        guilds_map_bot.push(guild)
      } else {
        guilds_map_no_bot.push(guild)
      }
    })
    renderTemplate(res, req, 'dashboard.ejs', {
      guilds_bot: guilds_map_bot,
      guilds_no_bot: guilds_map_no_bot,
    })
    renderTemplate(res, req, 'dashboard.ejs', {
      guilds_bot: guilds_map_bot,
      guilds_no_bot: guilds_map_no_bot,
    })
  })
}