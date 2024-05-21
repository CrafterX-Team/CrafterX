const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Belirtilen miktarda mesajı siler.')
    .addIntegerOption(option => option.setName('sayı').setDescription('Kaç mesajın silineceğini belirtin').setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('sayı');
    
    if (amount <= 0 || amount > 100) {
      return await interaction.reply({ content: '<:denied:1242201411492778034> Silme işlemi için 1 ile 100 arasında bir değer belirtmelisiniz.', ephemeral: true });
    }
    
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return await interaction.reply({ content: '<:denied:1242201411492778034> Bu komutu kullanmak için mesajları yönetme iznine sahip olmalısınız.', ephemeral: true });
    }

    await interaction.channel.bulkDelete(amount, true).catch(error => {
      console.error(error);
      return interaction.reply({ content: '<:denied:1242201411492778034> Mesajları silerken bir hata oluştu.', ephemeral: true });
    });

    const embed = new MessageEmbed()
      .setColor('#4ce94f')
      .setTitle('CrafterX')
      .setDescription(`**${amount}** Mesaj başarıyla silindi.`)
      .setFooter({ text: 'Silme Komutu' });

    const reply = await interaction.reply({ embeds: [embed], ephemeral: false });
    
  },
};