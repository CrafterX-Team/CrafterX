const { Client, Collection, Intents, MessageEmbed, ActionRowBuilder, SelectMenuBuilder, Permissions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_MESSAGES 
    ]
});

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
        const statuses = [
            { name: 'CrafterX', type: 'PLAYING' },
            { name: `${serverCount} sunucuda`, type: 'PLAYING' },
        ];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setPresence({
            activities: [randomStatus],
            status: 'dnd',
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
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
    }
});

client.on('guildMemberAdd', async member => {
    const settings = getSettings(member.guild.id);
    if (!settings || !settings.hoşGeldinKanalId) return;

    const hoşGeldinKanal = member.guild.channels.cache.get(settings.hoşGeldinKanalId);
    if (!hoşGeldinKanal) return;

    const memberCount = member.guild.memberCount;
    const memberCountEmoji = convertNumberToEmoji(memberCount);

    try {
        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Hoş Geldin!')
            .setDescription(`Sunucuya hoş geldin, ${member.user}!\nSunucumuz şu anda ${memberCountEmoji} üye sayısına ulaştı!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        hoşGeldinKanal.send({ embeds: [embed] });
        console.log(`Hoş geldin mesajı ${member.user.tag} için gönderildi.`);
    } catch (error) {
        console.error(`Hoş geldin mesajı gönderilemedi ${member.user.tag}:`, error);
    }
});

// Küfür engelleme
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const guardFilePath = path.join(__dirname, 'Data/guard.json');
    let guardData = {};

    if (fs.existsSync(guardFilePath)) {
        guardData = JSON.parse(fs.readFileSync(guardFilePath, 'utf8'));
    }

    const guildSettings = guardData[message.guild.id];
    if (!guildSettings || !guildSettings.swearFilter) return;

    const swearWords = [
        'amk', 'aq', 'oç', 'orospu', 'piç', 'sikerim', 'sik', 'siktir', 'yarrak', 'ananı', 'ananız', 'ananızın', 'ananıza', 
        'pezevenk', 'şerefsiz', 'göt', 'ibne', 'puşt', 'kahpe', 'fahişe', 'salak', 'mal', 'aptal', 'gerizekalı', 'dangalak',
        'deli', 'hayvan', 'öküz', 'eşek', 'kaltak', 'kerhane', 'karı', 'beyinsiz', 'aptal', 'geri zekalı', 'damar', 'domuz',
        'serefsiz', 'pezevenk', 'pislik', 'soysuz', 'puşt', 'orospu çocukları', 'kancık', 'yavşak', 'puşt', 'kaşar', 'dalyarak',
        'kaşar', 'meme', 'gavat', 'oturak', 'taşak', 'orospu çocuğu', 'yarak'
    ];

    const messageContent = message.content.toLowerCase();

    for (const swearWord of swearWords) {
        if (messageContent.includes(swearWord)) {
            await message.delete();

            const warningMessage = await message.channel.send(`${message.author}, bu sunucuda küfür etmek yasaktır!`);
            
            // 5 saniye sonra uyarı mesajını sil
            setTimeout(() => warningMessage.delete(), 5000);

            break;
        }
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

// Sunucu ayarlarını kaydetme ve yükleme fonksiyonları
function getSettings(guildId) {
    const settingsFile = './Data/server.json';
    if (fs.existsSync(settingsFile)) {
        const allSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        return allSettings[guildId];
    }
    return null;
}

function saveSettings(guildId, settings) {
    const settingsFile = './Data/server.json';
    let allSettings = {};

    if (fs.existsSync(settingsFile)) {
        allSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    }

    allSettings[guildId] = { ...allSettings[guildId], ...settings };

    fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 4));
}

// Üye sayısını emojiye çeviren fonksiyon
function convertNumberToEmoji(number) {
    const numberString = number.toString();
    const numberEmojis = {
        '0': '<a:sifir:1244099599233318952>',
        '1': '<a:bir:1244099616719376454>',
        '2': '<a:iki:1244099625133146173>',
        '3': '<a:uc:1244099602937024712> ',
        '4': '<a:drt:1244099622964559942>',
        '5': '<a:bes:1244099613145960482>',
        '6': '<a:alti:1244099610452955186>',
        '7': '<a:yedi:1244099606590263368>',
        '8': '<a:sekiz:1244099595106123787>',
        '9': '<a:dokuz:1244099620741840918>',
    };

    return numberString.split('').map(digit => numberEmojis[digit]).join('');
}

client.login(config.token);
