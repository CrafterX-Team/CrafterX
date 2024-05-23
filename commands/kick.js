const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Bir kullanıcıyı sunucudan atar.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Atılacak kullanıcı')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Atılma sebebi')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:denied:1243275827974504528> Yetki Hatası')
                .setDescription('Bu komutu kullanmak için yetkiniz yok.');
            return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            const userNotFoundEmbed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:denied:1243275827974504528> Kullanıcı Bulunamadı')
                .setDescription('Belirtilen kullanıcı bulunamadı.');
            return interaction.reply({ embeds: [userNotFoundEmbed], ephemeral: true });
        }

        try {
            await member.kick({ reason });
            const successEmbed = new MessageEmbed()
                .setColor('#30cb74')
                .setTitle('<:sucses:1243275119414214756> Kullanıcı Atıldı')
                .setDescription(`${user.tag} kullanıcısı başarıyla sunucudan atıldı.\nSebep: ${reason}`);
            return interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:denied:1243275827974504528> Hata')
                .setDescription('Kullanıcıyı sunucudan atarken bir hata oluştu.');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
