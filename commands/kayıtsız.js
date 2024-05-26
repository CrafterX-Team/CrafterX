const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıtsız')
        .setDescription('Kullanıcıyı kayıtsıza atar.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Kayıtsıza atılacak kullanıcıyı seçin.')
                .setRequired(true)),
    async execute(interaction) {
        const { guild } = interaction;
        const member = guild.members.cache.get(interaction.user.id);

        // Yetkili rolü kontrolü
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nBu komutu kullanmaya yetkiniz yok!', ephemeral: true });
        }

        // Kullanıcının belirlenmesi
        const user = interaction.options.getUser('kullanıcı');

        // Sunucu ayarlarının yüklenmesi
        const settings = getSettings(guild.id);

        // Kayıtsız rolünün belirlenmesi
        const kayıtsızRol = guild.roles.cache.get(settings.kayıtsızRolId);

        if (!kayıtsızRol) {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nKayıtsız rolü bulunamadı veya ayarlanmamış!', ephemeral: true });
        }

        // Kullanıcıya kayıtsız rolünün verilmesi
        try {
            const member = await guild.members.fetch(user.id);
            const userRoles = member.roles.cache.map(role => role.id); // Kullanıcının sahip olduğu rollerin id'leri
            await member.roles.remove(userRoles); // Kullanıcının sahip olduğu bütün rolleri al
            await member.roles.add(kayıtsızRol); // Kullanıcıya kayıtsız rolünü ver
            const embed = new MessageEmbed()
                .setColor('#30cb74')
                .setTitle('<:sucses:1243275119414214756> Kullanıcı Kayıtsıza Atıldı')
                .setDescription(`${user} kullanıcısı başarıyla kayıtsıza atıldı!`)
                .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nKullanıcıyı kayıtsıza atarken bir hata oluştu!', ephemeral: true });
        }
    },
};

// Sunucu ayarlarını yükleme
function getSettings(guildId) {
    const settingsFile = './Data/server.json';
    if (fs.existsSync(settingsFile)) {
        const allSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        return allSettings[guildId];
    }
    return null;
}
