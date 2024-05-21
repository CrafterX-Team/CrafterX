const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Tüm komutları gösterir.')
    .addStringOption(option =>
      option.setName('kategori')
        .setDescription('Komut kategorisini seçin.')
        .setRequired(false)
        .addChoices([
          ["Kullanıcı Komutları", "kullanıcı"],
          ["Kayıt Komutları", "kayıt"],
          ["Cezalandırma Komutları", "ceza"],
          ["Stat Komutları", "stat"],
          ["Yetkili Komutları", "yetkili"],
          ["Kurucu Komutları", "kurucu"],
          ["Sahip Komutları", "sahip"],
          ["Vandetta Komutları", "vandetta"]
        ])
    ),
  async execute(interaction) {
    const category = interaction.options.getString("kategori");

    // Kullanıcının yetkisini kontrol et
    if (!interaction.member.permissions.has("ADMINISTRATOR") && !["bot-commands"].includes(interaction.channel.name)) {
      return await interaction.reply({ content: "Bu komutu kullanmak için gerekli izinlere sahip değilsiniz veya bu kanalda kullanamazsınız.", ephemeral: true });
    }

    if (!category) {
      // Eğer kategori belirtilmemişse genel yardımı göster
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Yardım Menüsü")
        .setDescription("Bir kategori seçmek için aşağıdaki seçeneklerden birini kullanın.")
        .addField("Kullanıcı Komutları", "Kullanıcı komutları hakkında yardım almak için `/yardım kullanıcı`.")
        .addField("Kayıt Komutları", "Kayıt komutları hakkında yardım almak için `/yardım kayıt`.")
        // Diğer kategorileri buraya ekle...
        .setFooter("Kategori seçerek daha detaylı bilgi alabilirsiniz.");

      return await interaction.reply({ embeds: [embed] });
    }

    // Kategoriye göre komutları filtrele
    const commands = interaction.client.commands.filter(command => command.data.options[0].choices.some(choice => choice.value === category));

    if (commands.size === 0) {
      return await interaction.reply({ content: "Belirtilen kategoride komut bulunamadı.", ephemeral: true });
    }

    // Komutları listele
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Komutları`)
      .setDescription(commands.map(command => `\`${command.data.name}\`: ${command.data.description}`).join("\n"));

    await interaction.reply({ embeds: [embed] });
  }
};
