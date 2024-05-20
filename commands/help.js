const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Bot komutları hakkında bilgi verir.'),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor('#4ca7e9')
            .setTitle(':scroll: Yardım Komutları')
            .setDescription('Bot komutları hakkında bilgi almak için aşağıdaki menüden bir seçenek belirleyin.');

        const menu = new MessageSelectMenu()
            .setCustomId('help_menu')
            .setPlaceholder('Bir komut seçin')
            .addOptions([
                {
                    label: '/help',
                    description: 'Bot komutları hakkında bilgi verir.',
                    value: 'help',
                },
                {
                    label: '/ping',
                    description: 'Botun gecikme süresini gösterir.',
                    value: 'ping',
                },
                // Diğer komutlar için seçenekler ekleyin
            ]);

        const row = new MessageActionRow()
            .addComponents(menu);

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'help_menu' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            let description;

            switch (i.values[0]) {
                case 'help':
                    description = 'Bot komutları hakkında bilgi verir.';
                    break;
                case 'ping':
                    description = 'Botun gecikme süresini gösterir.';
                    break;
                // Diğer komutlar için case ekleyin
            }

            const selectedEmbed = new MessageEmbed()
                .setColor('#4ca7e9')
                .setTitle(`:${i.values[0]}: ${i.values[0]} Komutu`)
                .setDescription(description);

            await i.update({ embeds: [selectedEmbed], components: [row] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Zaman aşımı! Yardım menüsünden bir seçenek seçilmedi.', components: [] });
            }
        });
    },
};