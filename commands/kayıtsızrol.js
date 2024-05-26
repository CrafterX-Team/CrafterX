const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıtsızrol')
        .setDescription('Kayıtsız rolünü ayarlar.')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Kayıtsız rolü')
                .setRequired(true)),
    async execute(interaction) {
        const { guild } = interaction;
        const member = guild.members.cache.get(interaction.user.id);

        // Yetkili rolü kontrolü
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nBu komutu kullanmaya yetkiniz yok!', ephemeral: true });
        }

        // Kayıtsız rolünü ayarlama
        const kayıtsızRol = interaction.options.getRole('rol');

        // Ayarları kaydetme
        saveSettings(guild.id, { kayıtsızRolId: kayıtsızRol.id });

        // Geri dönüş mesajı gönderme
        const embed = new MessageEmbed()
            .setColor('#30cb74')
            .setTitle('<:sucses:1243275119414214756> Kayıtsız Rolü Ayarlandı')
            .setDescription(`Kayıtsız rolü başarıyla <@&${kayıtsızRol.id}> olarak ayarlandı!`);
        interaction.reply({ embeds: [embed], ephemeral: false });
    },
};

// Sunucu ayarlarını kaydetme
function saveSettings(guildId, settings) {
    const settingsFile = './Data/server.json';
    let allSettings = {};

    if (fs.existsSync(settingsFile)) {
        allSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    }

    allSettings[guildId] = { ...allSettings[guildId], ...settings };

    fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 4));
}
