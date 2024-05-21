const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-ver')
    .setDescription('Kullanıcıya belirli bir rolü verir')
    .addUserOption(option => option.setName('user').setDescription('Role verilecek kullanıcı').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Verilecek rolü seçin').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
      return interaction.reply({ content: '<:denied:1242201411492778034> Rolleri yönetme iznim yok.', ephemeral: true });
    }

    if (!interaction.member.permissions.has('MANAGE_ROLES')) {
      return interaction.reply({ content: '<:denied:1242201411492778034> Rolleri yönetme izniniz yok.', ephemeral: true });
    }

    try {
      await user.roles.add(role);

      const embed = new MessageEmbed()
        .setColor('#4ce94f')
        .setTitle('<:sucses:1242201413556113499> Başarılı Şekilde verildi')
        .addField('Rol', role.name, true)
        .addField('Kullanıcı', user.user.tag, true);
        

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '<:denied:1242201411492778034> Rol verirken bir hata oluştu.', ephemeral: true });
    }
  },
};