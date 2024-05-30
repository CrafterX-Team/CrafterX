const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanal-aç')
    .setDescription('Kilitli olan bir kanalın kilidini açar.')
    .addChannelOption(option => option.setName('kanal').setDescription('Kilidi açmak istediğiniz kanalı belirtin').setRequired(true)),
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

    if (!isLocked) {
      const resultEmbed = new MessageEmbed()
        .setColor('#fd494a')
        .setTitle('<:denied:1243275827974504528> Kanal zaten açık')
        .setDescription(`**#${channel.name}** kanalının kilidi zaten açık.`);

      return interaction.reply({ embeds: [resultEmbed] });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SEND_MESSAGES: null
    });

    const unlockEmbed = new MessageEmbed()
      .setColor('#30cb74')
      .setTitle('<:sucses:1243275119414214756> Kanal açma başarılı')
      .setDescription(`**#${channel.name}** kanalının kilidi açıldı.`);

    interaction.reply({ embeds: [unlockEmbed] });
  },
};
