const config = require('./config');
const Dashboard = require('./src/dashboard');
const Discord = require('discord.js');

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages
  ]
});

client.config = config;

client.on('ready', () => {
  console.clear();
  console.log('Yurikó Dashboard (Online)');

  const guild_basic = require('./databases/modelGuild/guild_basic')
  const guild_blacklist = require('./databases/modelGuild/guild_blacklist')

  guild_basic.sync();
  guild_blacklist.sync();

  
  client.user.setStatus("dnd")
});

Dashboard(client);

client.login(config.token);
