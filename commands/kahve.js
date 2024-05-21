// commands/eğlence/kahve.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// Kullanılan cümleleri saklamak için bir dizi
let kullanılanCümleler = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kahve')
        .setDescription('Bir fincan kahve içersiniz.'),
    async execute(interaction) {
        // Farklı kahve cümleleri
        const kahveCümleleri = [
            'İşte size bir fincan ☕ kahve!',
            'Günaydın! İşte size sıcak bir ☕ kahve.',
            '☕ Kahveniz hazır, afiyet olsun! ',
            'Bu ☕ kahve size özel, keyfini çıkarın!',
            'Bir fincan ☕ kahveyle gününüzü renklendirin!',
            'Sonunda bu kadar yoldan sonra sıcak bir ☕ kahveye ulaştın tebrik ederim korsan <:pandapirate:1199828932288073901>'
        ];

        // Rastgele bir kahve cümlesi seçme (aynı cümle 3 kez üst üste çıkmasın)
        let rastgeleCümle;
        do {
            rastgeleCümle = kahveCümleleri[Math.floor(Math.random() * kahveCümleleri.length)];
        } while (kullanılanCümleler.includes(rastgeleCümle) && kullanılanCümleler.length < kahveCümleleri.length);

        // Kullanılan cümleleri saklamak için diziye ekleme
        kullanılanCümleler.push(rastgeleCümle);

        // Kahve embed oluşturma
        const kahveEmbed = new MessageEmbed()
            .setColor('#4ce94f') // Kahve rengine uygun renk seçimi
            .setTitle('Fincan Kahve')
            .setDescription(rastgeleCümle);

        // Kahve ismarla butonu oluşturma (ephemeral: true)
        const ismarlaButton = new MessageButton()
            .setLabel('Bana Kahve Ismarla')
            .setStyle('PRIMARY')
            .setCustomId('ismarla_button')
            .setEmoji('☕'); // Panda emoji ekledim

        // Butonları içeren bir satır oluşturma
        const row = new MessageActionRow().addComponents(ismarlaButton);

        // Interaction'a embedli mesaj ve butonlu cevap verme
        await interaction.reply({
            embeds: [kahveEmbed],
            components: [row],
            ephemeral: false, // Bu mesaj herkese görünür
        });

        // Buton tıklama olayını bekleyen bir fonksiyon ekleyelim
        const filter = i => i.customId === 'ismarla_button' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        // Kahve ismarla butonuna basılınca bu kısım çalışacak
        collector.on('collect', async i => {
            await i.update({ content: 'Bir fincan ☕ kahve bana ısmarlandı! Teşekkür ederim <a:Panda:1199828905503236156>', components: [] });
            // İsmarla işlemi buraya eklenmeli
            collector.stop(); // Collector'ı durdur
        });
    },
};