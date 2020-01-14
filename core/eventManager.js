const Discord = require('discord.js');
const fileSystem = require('fs').promises;
const path = require('path');

const ignoreOnDevelopment = [
  'guildMemberAdd', 'messageReactionAdd', 'messageReactionRemove', 'message'
];

module.exports = (client, basePath) => {
  loadEvents(path.join(basePath, 'events'), client);
}

function loadEvents(directory, client) {
  client.events = new Discord.Collection();

  let total = 0;
  let carregados = 0;

  fileSystem.readdir(directory)
  .then(files => {
    total = files.length;

    files.forEach(file => {
      if (!file.endsWith(".js")) return;

      let eventName = file.substring(0, file.indexOf(".js"));
      
      if (process.env.NODE_ENV.includes('development') && ignoreOnDevelopment.includes(eventName)) return;

      let event = require(path.join(directory, eventName));

      client.on(eventName, event.bind(null, client));
      carregados++;
    })
  })
  .then(() => {
    console.log(`${carregados}/${total} eventos carregados.`);
  })
  .catch(err => console.log(err));
}

function loadCommands(directory, client) {
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();

  let total = 0;
  let carregados = 0;
  fileSystem.readdir(directory)
  .then(files => {
    total = files.length;

    files.forEach(file => {
      if (!file.endsWith(".js")) return;

      let commandName = file.substring(0, file.indexOf(".js"));
      let command = require(path.join(directory, commandName));

      client.on(commandName, command.bind(null, client));
      client.commands.set(commandName, command);
      carregados++;
    })
  })
  .then(() => {
    console.log(`${carregados}/${total} comandos carregados.`);
  })
  .catch(err => console.log(err));
}