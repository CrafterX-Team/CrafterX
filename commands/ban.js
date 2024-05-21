const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir kullanıcıyı yasaklar.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Yasaklanacak kullanıcı')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Yasaklama sebebi')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#e94c4c')
                .setTitle('<:denied:1242201411492778034> Yetki Hatası')
                .setDescription('Bu komutu kullanmak için yetkiniz yok.');
            return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            const userNotFoundEmbed = new MessageEmbed()
                .setColor('#e94c4c')
                .setTitle('<:denied:1242201411492778034> Kullanıcı Bulunamadı')
                .setDescription('Belirtilen kullanıcı bulunamadı.');
            return interaction.reply({ embeds: [userNotFoundEmbed], ephemeral: true });
        }

        try {
            await member.ban({ reason });
            const successEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('<:sucses:1242201413556113499> Kullanıcı Yasaklandı')
                .setDescription(`${user.tag} kullanıcısı başarıyla yasaklandı.\nSebep: ${reason}`);
            return interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new MessageEmbed()
                .setColor('#e94c4c')
                .setTitle('<:denied:1242201411492778034> Hata')
                .setDescription('Kullanıcıyı yasaklarken bir hata oluştu.');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
