const guild_basic = require('../../../databases/modelGuild/guild_basic.js');

module.exports = (checkAuth, app, client, renderTemplate) => {
  app.get('/dashboard/:guildID', checkAuth, async (req, res) => { 
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect('/dashboard')
    await guild.members.fetch()
    let member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect('/dashboard')
    if (!member.permissions.has('Administrator')) return res.redirect('/dashboard')

    const guild_data = await guild_basic.findOne({ where: { id: guild.id}})

    if (!guild_data) {
        await guild_basic.create({
            id: guild.id,
            name: guild.name,
            lang: 'en-US'
        })

      renderTemplate(res, req, 'settings/config.ejs', {
        guild: guild,
        language: 'en-US'
      })

    } else {
      renderTemplate(res, req, 'settings/config.ejs', {
        guild: guild,
        language: guild_data.lang
      })
    }

  })

  //Post para los envios

  app.post('/dashboard/:guildID', checkAuth, async (req, res) => { 

    const guild = client.guilds.cache.get(req.params.guildID)

    if (!guild) return res.redirect('/dashboard')

    const member = await guild.members.fetch(req.user.id)

    if (!member) return res.redirect('/dashboard');

    if (!member.permissions.has('Administrator')) {
      return res.redirect('/dashboard')
    }

    //Los datos que recibe
    let data = req.body
    const lang = data.language

    await guild_basic.findOne({ where: { id: guild.id}}).then(x=>{
      x.lang = lang
      x.save()
    })

    renderTemplate(res, req, 'settings/config.ejs', {
      guild: guild,
      language: lang
    })
  })
}