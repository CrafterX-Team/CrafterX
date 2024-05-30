const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojiyukle')
        .setDescription('Sunucuya emoji yükler.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Yüklenecek emoji URL\'si')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Yüklenecek emoji adı')
                .setRequired(true)),
    async execute(interaction) {
        // Komutu kullanan kullanıcının bir sunucu yöneticisi olup olmadığını kontrol et
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply('Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.');
        }

        const url = interaction.options.getString('url');
        const name = interaction.options.getString('isim');

        try {
            const emoji = await interaction.guild.emojis.create(url, name);
            await interaction.reply(`Emoji başarıyla yüklendi: ${emoji.toString()}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('Emoji yüklenirken bir hata oluştu.');
        }
    },
};
