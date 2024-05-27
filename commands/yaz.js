const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yaz')
        .setDescription('Belirtilen mesajı yazdırır.')
        .addStringOption(option => 
            option.setName('mesaj')
                .setDescription('Yazılacak mesaj')
                .setRequired(true)),
    async execute(interaction) {
        const mesaj = interaction.options.getString('mesaj');
        
        // Mesajı yanıt olarak gönder
        await interaction.reply({ content: mesaj });
    },
};
