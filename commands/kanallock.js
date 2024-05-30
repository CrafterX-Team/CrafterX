const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanal-kilit')
    .setDescription('Belirtilen kanalı kilitleyerek mesaj gönderimini engeller.')
    .addChannelOption(option => option.setName('kanal').setDescription('Kilitlemek istediğiniz kanalı belirtin').setRequired(true)),
  async execute(interaction) {
    // Komutu kullanan kullanıcının bir sunucu yöneticisi olup olmadığını kontrol et
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return await interaction.reply('Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.');
    }

    const channel = interaction.options.getChannel('kanal');

    if (!channel) {
      return interaction.reply('Bir kanal belirtmelisiniz.');
    }

    const isLocked = channel.permissionOverwrites.cache.some(overwrite => {
      return overwrite.deny.has('SEND_MESSAGES');
    });

    if (isLocked) {
      const resultEmbed = new MessageEmbed()
        .setColor('#fd494a')
        .setTitle('<:denied:1243275827974504528> Kanal kilitleme başarısız')
        .setDescription(`**#${channel.name}** kanalı zaten kilitli.`);

      return interaction.reply({ embeds: [resultEmbed] });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SEND_MESSAGES: false
    });

    const lockEmbed = new MessageEmbed()
      .setColor('#30cb74')
      .setTitle('<:sucses:1243275119414214756> Kanal kilitleme başarılı')
      .setDescription(`**#${channel.name}** kanalı kilitlendi.`);

    interaction.reply({ embeds: [lockEmbed] });
  },
};
