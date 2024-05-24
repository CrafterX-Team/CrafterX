const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
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
    setInterval(changePresence, 10000);
// Durumu değiştiren fonksiyon

function changePresence() {

    const serverCount = client.guilds.cache.size;
    // Durumları burada tanımlayabilirsiniz. Örneğin:
    const statuses = [
        { name: 'CrafterX', type: 'PLAYING' },
        { name: `${serverCount} sunucuda`, type: 'PLAYING' },
    ];

    // Rastgele bir durum seçin
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Durumu ayarlayın
    client.user.setPresence({
        activities: [randomStatus],
        status: 'dnd', // Botun çevrimdışı gibi görünmesini istiyorsanız 'dnd' olarak ayarlayabilirsiniz
    });

   
}

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

//! Gelen giden system (Başlangıç)
client.on('guildMemberAdd', member => {
    const serverData = JSON.parse(fs.readFileSync('./Data/server.json', 'utf-8'));
    const logChannelId = serverData[member.guild.id]?.logChannel;
    if (logChannelId) {
        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const embed = new MessageEmbed()
                .setColor('#00FF00')
                .setTitle('Üye Katıldı')
                .setDescription(`${member.user.tag} sunucuya katıldı.`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
});

client.on('guildMemberRemove', member => {
    const serverData = JSON.parse(fs.readFileSync('./Data/server.json', 'utf-8'));
    const logChannelId = serverData[member.guild.id]?.logChannel;
    if (logChannelId) {
        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Üye Ayrıldı')
                .setDescription(`${member.user.tag} sunucudan ayrıldı.`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
});
//! Gelen giden system (Bitiş)


client.login(config.token);
