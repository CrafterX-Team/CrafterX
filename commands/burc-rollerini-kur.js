const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const burçlar = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('burc-rollerini-kur')
        .setDescription('Sunucuya burç rolleri kurar.'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { guild } = interaction;

        try {
            const existingRoles = guild.roles.cache.map(role => role.name);
            for (const burç of burçlar) {
                if (!existingRoles.includes(burç)) {
                    await guild.roles.create({
                        name: burç,
                        color: 'RANDOM',
                        reason: `${burç} rolü oluşturuldu.`
                    });
                }
            }

            const embed = new MessageEmbed()
                .setColor('#30cb74')
                .setTitle('Burç Rolleri Kuruldu')
                .setDescription('Burç rolleri başarıyla oluşturuldu!')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'Burç rolleri oluşturulurken bir hata oluştu!', ephemeral: true });
        }
    },
};
