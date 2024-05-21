const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

// Komutları komutlar klasöründen yükleyin
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Komutun doğru yapıda olup olmadığını kontrol edin
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[UYARI] ${filePath} dosyası doğru bir komut modülü içermiyor.`);
    }
}

const commands = client.commands.map(cmd => cmd.data.toJSON());

client.once('ready', async () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);

    // Botun durumunu ayarlayın
    client.user.setPresence({
        activities: [{ name: 'CrafterX', type: 'PLAYING' }],
        status: 'dnd',
    });

    const rest = new REST({ version: '9' }).setToken(config.token);

    try {
        console.log('Başlatılıyor: (/) komutları kaydediliyor.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Başarıyla (/) komutları kaydedildi.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
    }
});

client.login(config.token);
