const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanal-ayar')
    .setDescription('Kanalı kilitleyerek veya kilidini açarak ayarlar.')
    .addChannelOption(option => option.setName('kanal').setDescription('Kilitlemek veya kilidini açmak istediğiniz kanalı belirtin').setRequired(true)),
  async execute(interaction) {
    // Kanalı al
    const channel = interaction.options.getChannel('kanal');

    // Kilitli mi açık mı olduğunu kontrol et
    const isLocked = channel.permissionOverwrites.cache.some(overwrite => {
      return overwrite.deny.has('SEND_MESSAGES');
    });

    // Butonlar oluştur
    const lockButton = new MessageButton()
      .setCustomId('lock_channel')
      .setLabel('Kilitle')
      .setStyle(isLocked ? 'SECONDARY' : 'PRIMARY');

    const unlockButton = new MessageButton()
      .setCustomId('unlock_channel')
      .setLabel('Kilidini Aç')
      .setStyle(isLocked ? 'PRIMARY' : 'SECONDARY');

    // Butonları bir araya getir
    const actionRow = new MessageActionRow()
      .addComponents(lockButton, unlockButton);

    // Yanıtı oluştur
const embed = new MessageEmbed()
.setColor(isLocked ? '#fd494a' : '#30cb74')
.setTitle(isLocked ? '<:denied:1243275827974504528> Kanal kilitli' : '<:sucses:1243275119414214756> Kanal açık')
.setDescription(`**#${channel.name}** kanalının durumu: ${isLocked ? 'kilitli' : 'açık'}.`)
.setFooter(`Kanalı kitlemek veya kilidini açmak için bu komutu tekrar kullanabilirsiniz.`);


    // Komutu sadece sunucu yöneticileri kullanabilsin
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return await interaction.reply({ content: 'Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.', ephemeral: true });
    }

    await interaction.reply({ embeds: [embed], components: [actionRow] });

    // Buton tıklama işlemleri
    const filter = i => i.customId === 'lock_channel' || i.customId === 'unlock_channel';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'lock_channel' && !isLocked) {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: false });
        await i.update({ embeds: [embed.setColor('#fd494a').setTitle('<:denied:1243275827974504528> Kanal kilitlendi')], components: [actionRow] });
      } else if (i.customId === 'unlock_channel' && isLocked) {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: null });
        await i.update({ embeds: [embed.setColor('#30cb74').setTitle('<:sucses:1243275119414214756> Kanal açıldı')], components: [actionRow] });
      }
    });

    collector.on('end', async () => {
      await interaction.editReply({ components: [] });
    });
  },
};


//
