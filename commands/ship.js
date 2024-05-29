const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('İki kullanıcı arasındaki uyumu ölçer.')
        .addUserOption(option => 
            option.setName('user1')
                .setDescription('İlk kullanıcıyı seçin')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user2')
                .setDescription('İkinci kullanıcıyı seçin')
                .setRequired(true)),
    
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        const compatibility = Math.floor(Math.random() * 101); // 0 ile 100 arasında rastgele bir sayı üret
        const heartIcon = compatibility >= 75 ? '❤️' : compatibility >= 50 ? '💖' : '💔'; // Uyum yüzdesine göre kalp ikonu seç

        // Canvas ile görsel oluşturma
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        // Arka plan rengini belirleyin
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // İlk kullanıcının avatarını ekleyin
        const avatar1 = await Canvas.loadImage(user1.displayAvatarURL({ format: 'jpg' }));
        context.drawImage(avatar1, 25, 25, 200, 200);

        // İkinci kullanıcının avatarını ekleyin
        const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'jpg' }));
        context.drawImage(avatar2, 475, 25, 200, 200);

        // Kalp ikonunu ekleyin
        context.font = 'bold 60px sans-serif';
        context.fillStyle = '#000000';
        context.fillText(heartIcon, 300, 150);

        // Uyum yüzdesini ekleyin
        context.font = 'bold 30px sans-serif';
        context.fillText(`${compatibility}%`, 290, 200);

        // Görseli oluşturun
        const attachment = new MessageAttachment(canvas.toBuffer(), 'ship-image.png');

        const embed = new MessageEmbed()
            .setTitle('💖 Ship Testi 💖')
            .setDescription(`${user1.username} ve ${user2.username} arasındaki uyum: ${compatibility}%`)
            .setColor('RANDOM')
            .setImage('attachment://ship-image.png')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], files: [attachment] });
    },
};
