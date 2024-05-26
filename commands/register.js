const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt')
        .setDescription('Kullanıcıyı kayıt eder.')
        .addUserOption(option =>
            option.setName('etiket')
                .setDescription('Kayıt edilecek kullanıcıyı etiketleyin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Kullanıcının ismini belirtin.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('yaş')
                .setDescription('Kullanıcının yaşını belirtin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('cinsiyet')
                .setDescription('Kullanıcının cinsiyetini belirtin. (kadın/erkek)')
                .setRequired(true)),
    async execute(interaction) {
        const { guild } = interaction;

        // Sunucu ayarlarının yüklenmesi
        const settings = getSettings(guild.id);
        const yetkiliRolId = settings.yetkiliRolId;

        const member = guild.members.cache.get(interaction.user.id);

        // Yetkili rolü kontrolü
        if (!member.roles.cache.has(yetkiliRolId)) {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nBu komutu kullanmaya yetkiniz yok!', ephemeral: true });
        }

        // Kullanıcının belirlenmesi
        const user = interaction.options.getUser('etiket');

        // Kullanıcının adının, yaşının ve cinsiyetinin alınması
        const isim = interaction.options.getString('isim');
        const yaş = interaction.options.getInteger('yaş');
        const cinsiyet = interaction.options.getString('cinsiyet');

        // Kadın ve erkek rollerinin belirlenmesi
        let roleId;
        if (cinsiyet === 'kadın') {
            roleId = settings.kadınRolId;
        } else if (cinsiyet === 'erkek') {
            roleId = settings.erkekRolId;
        }

        const role = guild.roles.cache.get(roleId);

        if (!role) {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nGeçersiz cinsiyet belirtildi veya rol ayarlanmamış!', ephemeral: true });
        }

        // Kullanıcıya yeni isminin ve yaşının verilmesi
        try {
            const member = await guild.members.fetch(user.id);
            await member.setNickname(`${isim} | ${yaş}`); // Kullanıcının isminin ve yaşının değiştirilmesi
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nKullanıcının ismi değiştirilirken bir hata oluştu!', ephemeral: true });
        }

        // Kullanıcıya rolün verilmesi
        try {
            await guild.members.cache.get(user.id).roles.add(role);
            const embed = new MessageEmbed()
                .setColor('#30cb74')
                .setTitle('<:sucses:1243275119414214756> Kullanıcı Kayıt Edildi')
                .setDescription(`Başarıyla ${isim} (${user}) kullanıcısı ${cinsiyet} olarak kaydedildi!\nYaş: ${yaş}`)
                .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nKullanıcıya rol verilirken bir hata oluştu!', ephemeral: true });
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
