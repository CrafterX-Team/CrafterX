const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-al')
    .setDescription('Kullanıcıdan belirli bir rolü alır')
    .addUserOption(option => option.setName('user').setDescription('Rolü alınacak kullanıcı').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Alınacak rolü seçin').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return interaction.reply({ content: '<:denied:1243275827974504528> Rolleri yönetme iznim yok.', ephemeral: true });
    }

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return interaction.reply({ content: '<:denied:1243275827974504528> Rolleri yönetme izniniz yok.', ephemeral: true });
    }

    if (!user.roles.cache.has(role.id)) {
      return interaction.reply({ content: '<:denied:1243275827974504528> Kullanıcı belirtilen role sahip değil.', ephemeral: true });
    }

    try {
      await user.roles.remove(role);

      const embed = new MessageEmbed()
        .setColor('#30cb74')
        .setTitle('<:sucses:1243275119414214756> Başarılı Şekilde Alındı')
        .addField('Alınan Rol', role.name, true)
        .addField('Kullanıcı', user.user.tag, true);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '<:denied:1243275827974504528> Rol alırken bir hata oluştu.', ephemeral: true });
    }
  },
};