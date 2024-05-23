const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yavaş-mod')
    .setDescription('Bir kanala yavaş mod ekler veya kaldırır (sadece yöneticilere özeldir)')
    .addChannelOption(option => option.setName('kanal').setDescription('Yavaş mod uygulanacak kanal').setRequired(true))
    .addIntegerOption(option => option.setName('sure').setDescription('Yavaş mod süresi (saniye)').setRequired(true)),
  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('kanal');
    const slowmodeDuration = interaction.options.getInteger('sure');
    
    // Kullanıcının yönetici iznini kontrol et
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply({ content: '<:denied:1243275827974504528> Bu komutu kullanmak için yönetici iznine sahip olmalısınız.', ephemeral: true });
    }

    try {
      await targetChannel.setRateLimitPerUser(slowmodeDuration);

      const embed = new MessageEmbed()
        .setColor('#30cb74')
        .setTitle('<:sucses:1243275119414214756> Yavaş Mod Açıldı')
        .setDescription(`**${targetChannel.name}** kanalına ${slowmodeDuration} saniye yavaş mod eklendi.`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '<:denied:1243275827974504528> Yavaş mod güncellenirken bir hata oluştu.', ephemeral: true });
    }
  },
};