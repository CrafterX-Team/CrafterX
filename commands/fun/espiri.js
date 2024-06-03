const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios'); // axios kütüphanesini eklemeyi unutmayın

// Daha önce çıkan esprileri izlemek için bir dizi kullanacağız
const usedJokes = [];

module.exports = {
    data: {
        name: 'espiri',
        description: 'Üst üste aynı espirilerin gelmediği rastgele espiri yapar.',
    },
    async execute(interaction) {
        const botAvatarURL = interaction.client.user.displayAvatarURL();
        const jokes = [
            '**Soru:** Niye matematik kitabını sevmezler? \n**Cevap:** Çünkü problemli bir ilişkileri var!',
            '**Soru:** Neden bisiklet yolda düşmez? \n**Cevap:** Çünkü iki tekerlekli!',
            '**Soru:** Beni neden park yeri gibi görüyorsun? \n**Cevap:** Çünkü senin için hep boşum!',
            '**Soru:** Neden güneş gözlüğü taktım biliyor musun? \n**Cevap:** Çünkü bu espri çok parlak!',
            '**Soru:** Neden kitaplarla arkadaş olmak iyidir? \n**Cevap:** Çünkü onlar hep açık fikirlidir!',
            '**Soru:** Neden deniz anasının hiç arkadaşı yok? \n**Cevap:** Çünkü her zaman farklı bir dalda!',
            '**Soru:** Beni neden denizde temizlik yapmaya gönderdiler biliyor musun? \n**Cevap:** Çünkü hep dalgalıydım!',
            '**Soru:** Neden hiç bir zaman televizyon satın almamalısın? \n**Cevap:** Çünkü bu konuda pek net değilim!',
            '**Soru:** Telefonumun neden bu kadar üzgün göründüğünü biliyor musun? \n**Cevap:** Sanırım sürekli daldığı için!',
            '**Soru:** Neden bazı çaylar soğuyamaz? \n**Cevap:** Kendini hep sıcak tuttuğu için!',
            '**Soru:** Örümcek adam neden ağ atamaz? \n**Cevap:** Çünkü ağır işi yapar!',
            '**Soru:** Ayakkabılarım sürekli neden geç kalkıyorlar? \n**Cevap:** Çünkü bağları kopuklar!',
            '**Soru:** Neden hiçbir saat birbirine benzemez? \n**Cevap:** Çünkü hepsi benzerini istemez!',
            '**Soru:** Neden 6\'yı sevmeyen çocuklar korkar? \n**Cevap:** Çünkü altı tehdit eder!',
            '**Soru:** En hızlı yemek hangisidir? \n**Cevap:** Kaşıkla yoğurt!',
            '**Soru:** Neden kitaplara asla güvenmemelisiniz? \n**Cevap:** Çünkü onlar her zaman kapaklarını saklar!',
            '**Soru:** Uykucu lamba neden sık sık yanar? \n**Cevap:** Dinlenmesi gerektiği için!',
            '**Soru:** En çılgın sebze hangisidir? \n**Cevap:** Salatalık çünkü sürekli sallanır!',
            '**Soru:** Hangi şehir hem içeride hem dışarıda? \n**Cevap:** İç-dış!',
            '**Soru:** Tembel bir güvenlik görevlisi nasıl işe alınır? \n**Cevap:** Gözleri açıkken!',
            '**Soru:** Hangi pillerden korkarsınız? \n**Cevap:** Şarj edilebilirler!',
            '**Soru:** Ayılar neden asla okur? \n**Cevap:** Çünkü her zaman sayfaları yırtarlar!',
            '**Soru:** Hangi dağda su içilmez? \n**Cevap:** Çamaşır suyu!',
            '**Soru:** En çok kaygan olan ülke hangisidir? \n**Cevap:** Kaymakhane!',
            '**Soru:** Hangi araba hep sağa gitmek ister? \n**Cevap:** Direksiyonu sağda olan!',
            '**Soru:** Hangi bahçede çiçek yetişmez? \n**Cevap:** Göz bahçesinde!',
            '**Soru:** Hangi kalemle yazı yazılmaz? \n**Cevap:** Kâğıt kalemle!',
            '**Soru:** Hangi ayak bileği en güçlüdür? \n**Cevap:** Demirbaş!',
            '**Soru:** Hangi yolda trafik yoktur? \n**Cevap:** At yolu!',
            '**Soru:** Hangi bahçede çiçek yetişmez? \n**Cevap:** Göz bahçesinde!',
            '**Soru:** Hangi kuyruklu yıldız çarpmaz? \n**Cevap:** Posta kuyruğu!',
            '**Soru:** Hangi macun ağızlık sürmez? \n**Cevap:** Diş macunu!',
            '**Soru:** Hangi dondurma küflenmez? \n**Cevap:** Kuru dondurma!',
            '**Soru:** Hangi yaprak uçar? \n**Cevap:** Cevap yaprakları!',
            '**Soru:** Hangi kuş uçmaz? \n**Cevap:** Deve kuşu!',
            '**Soru:** Hangi simit yenmez? \n**Cevap:** Deniz simidi!',
            '**Soru:** Hangi taş suya düşmez? \n**Cevap:** Karataş!',
            '**Soru:** Hangi üzüm ekşi değildir? \n**Cevap:** Şıralık üzüm!',
            '**Soru:** Hangi kale tavan arasına konur? \n**Cevap:** Süngü kale!',
            '**Soru:** Hangi tüfek patlamaz? \n**Cevap:** Ses tüfeği!',
            '**Soru:** Hangi yemek araba ile gelir? \n**Cevap:** Makarna çünkü arabaşı!',
            '**Soru:** Hangi makine ağırlık kaldıramaz? \n**Cevap:** Şişe makinesi!',
            '**Soru:** Hangi makarna yenmez? \n**Cevap:** Amacına uygun makarna!',
            '**Soru:** Hangi dairede kapı olmaz? \n**Cevap:** Basketbol sahasında!',
            '**Soru:** Hangi bıçak kesmez? \n**Cevap:** Uyku bıçağı!',
            '**Soru:** Hangi tarla ürün vermez? \n**Cevap:** Kuru tarla!',
            '**Soru:** Hangi bacadan duman çıkmaz? \n**Cevap:** Peri bacalarından!',
            '**Soru:** Hangi ahtapot en küçüktür? \n**Cevap:** Yumurta ahtapotu!',
            '**Soru:** Hangi çiçek sulanmaz? \n**Cevap:** Mantar çiçeği!',
            '**Soru:** Hangi elbise yıkanmaz? \n**Cevap:** Gömlek elbisesi!',
            '**Soru:** Hangi balık tuzlu suya girer? \n**Cevap:** Zıpkın balığı!',
            '**Soru:** Hangi denizde su yoktur? \n**Cevap:** Kuru denizde!',
            '**Soru:** Hangi teneke öter? \n**Cevap:** Horoz teneke!',
            '**Soru:** Hangi takım elbise giyilmez? \n**Cevap:** Amatör takım elbise!',
            '**Soru:** Hangi devirde asker tütün yerine çimen tüttürmüştür? \n**Cevap:** İlkçağ devrinde!',
            '**Soru:** Hangi gün ertelenmez? \n**Cevap:** Dünden sonraya!',
            '**Soru:** Hangi bina silahla vurulmaz? \n**Cevap:** Bina zaten dururken vurulmaz!',
            '**Soru:** Hangi at nal takmaz? \n**Cevap:** Oyuncak at!',
            '**Soru:** Hangi karpuz yere düşmez? \n**Cevap:** Uzay karpuzu!',
            '**Soru:** Hangi telefon çalmaz? \n**Cevap:** Kapalı telefon!',
            '**Soru:** Hangi çorbanın içine giren adam zıplamaz? \n**Cevap:** Sahan çorbasının içine giren adam!',
            '**Soru:** Hangi pil çalışmaz? \n**Cevap:** İdrar pil!',
            '**Soru:** Hangi kanun insanları uyutmaz? \n**Cevap:** Yerçekimi kanunu!',
            '**Soru:** Hangi teneke bütün dünyayı gezebilir? \n**Cevap:** Ses teneke!',
            '**Soru:** Hangi patlıcan söylenir? \n**Cevap:** Göz patlıcan!',
            '**Soru:** Hangi otobüs durakta beklemiş? \n**Cevap:** Motor otobüs!',
            '**Soru:** Hangi fil havalanır? \n**Cevap:** Kar fili!',
            '**Soru:** Hangi balık gözlüklüdür? \n**Cevap:** Güneş balığı!',
            '**Soru:** Hangi cüce uzundur? \n**Cevap:** Tembel cüce!',
            '**Soru:** Hangi boya asla akmaz? \n**Cevap:** Kuru boya!',
            '**Soru:** Hangi pil hareket etmez? \n**Cevap:** Doldurulabilir pil!',
            '**Soru:** Hangi fare peynir yerken ağlar? \n**Cevap:** Testere fare!',
            '**Soru:** Hangi radyo dinlenmez? \n**Cevap:** Mıknatıslı radyo!',
            '**Soru:** Hangi araba kendi başına hareket eder? \n**Cevap:** Otomatik araba!',
            '**Soru:** Hangi denizde su bulunmaz? \n**Cevap:** Kuru denizde!',
            '**Soru:** Hangi ağaç yalnız yetişir? \n**Cevap:** Tek ağaç!',
            '**Soru:** Hangi yıldız parlar? \n**Cevap:** Kuzey yıldızı!',
            '**Soru:** Hangi kale yenmez? \n**Cevap:** Şelale!',
            '**Soru:** Hangi devirde insanlar sadece su içmiştir? \n**Cevap:** Taş devirde!',
            '**Soru:** Hangi denizde dalgakıran bulunmaz? \n**Cevap:** Cennet denizinde!',
            '**Soru:** Hangi ev yanmaz? \n**Cevap:** Kireç ev!',
            '**Soru:** Hangi çivi çivi deler? \n**Cevap:** Ses çivisi!',
            '**Soru:** Hangi araba çiçek satar? \n**Cevap:** Laale oto!',
            '**Soru:** Hangi kadın sadece beylerin altına bakar? \n**Cevap:** Terzi kadın!',
            '**Soru:** Hangi bıçak hızlıdır? \n**Cevap:** Tırnak makası!',
            '**Soru:** Hangi makina dişleri temizler? \n**Cevap:** Torna makası!',
            '**Soru:** Hangi bahçe yapılır? \n**Cevap:** Don bahçesi!',
            '**Soru:** Hangi motor ses çıkarmaz? \n**Cevap:** Kısık motor!',
            '**Soru:** Hangi mendil ağlar? \n**Cevap:** Gözyaşı mendili!',
            '**Soru:** Hangi ayı uçar? \n**Cevap:** Jüpiter ayı!',
            '**Soru:** Hangi insanın gözü hiç bir yere gitmez? \n**Cevap:** İğneli insanın!',
            '**Soru:** Hangi yüzme havuzu kurumaz? \n**Cevap:** Dondurma havuzu!',
            '**Soru:** Hangi anahtar düşmez? \n**Cevap:** Narkozlu anahtar!',
            '**Soru:** Hangi davul içi boşalmaz? \n**Cevap:** Gövde davulu!',
            '**Soru:** Hangi tüfek uzun süre patlamaz? \n**Cevap:** Fotoğraf makinesi!',
            '**Soru:** Hangi fare peynir yerken ağlar? \n**Cevap:** Testere fare!',
            '**Soru:** Hangi radyo dinlenmez? \n**Cevap:** Mıknatıslı radyo!',
            '**Soru:** Hangi araba kendi başına hareket eder? \n**Cevap:** Otomatik araba!',
            '**Soru:** Hangi denizde su bulunmaz? \n**Cevap:** Kuru denizde!',
            '**Soru:** Hangi ağaç yalnız yetişir? \n**Cevap:** Tek ağaç!',
            '**Soru:** Hangi yıldız parlar? \n**Cevap:** Kuzey yıldızı!',
            '**Soru:** Hangi kale yenmez? \n**Cevap:** Şelale!',
            '**Soru:** Hangi devirde insanlar sadece su içmiştir? \n**Cevap:** Taş devirde!',
            '**Soru:** Hangi denizde dalgakıran bulunmaz? \n**Cevap:** Cennet denizinde!',
            '**Soru:** Hangi ev yanmaz? \n**Cevap:** Kireç ev!',
            '**Soru:** Hangi çivi çivi deler? \n**Cevap:** Ses çivisi!',
            '**Soru:** Hangi araba çiçek satar? \n**Cevap:** Laale oto!',
            '**Soru:** Hangi kadın sadece beylerin altına bakar? \n**Cevap:** Terzi kadın!',
            '**Soru:** Hangi bıçak hızlıdır? \n**Cevap:** Tırnak makası!',
            '**Soru:** Hangi makina dişleri temizler? \n**Cevap:** Torna makası!',
            '**Soru:** Hangi bahçe yapılır? \n**Cevap:** Don bahçesi!',
            '**Soru:** Hangi motor ses çıkarmaz? \n**Cevap:** Kısık motor!',
            '**Soru:** Hangi mendil ağlar? \n**Cevap:** Gözyaşı mendili!',
            '**Soru:** Hangi ayı uçar? \n**Cevap:** Jüpiter ayı!',
            '**Soru:** Hangi insanın gözü hiç bir yere gitmez? \n**Cevap:** İğneli insanın!',
            '**Soru:** Hangi yüzme havuzu kurumaz? \n**Cevap:** Dondurma havuzu!',
            '**Soru:** Hangi anahtar düşmez? \n**Cevap:** Narkozlu anahtar!',
            '**Soru:** Hangi davul içi boşalmaz? \n**Cevap:** Gövde davulu!',
            '**Soru:** Hangi tüfek uzun süre patlamaz? \n**Cevap:** Fotoğraf makinesi!',
        ];

        const oylazim = new MessageEmbed()
            .setTitle("<:fun:1243846210645917716> Espirimatik kullanabilmek için Oy Ver")
            .setDescription("Bu komutu kullanabilmen için botumuza Top.gg üzerinden oy vermelisin. [OY VER](https://top.gg/bot/1052989477641007114/vote)")
            .setThumbnail(botAvatarURL)
            .setColor('#fb00ff'); // Renk kodunu değiştirebilirsiniz

        const url = `https://top.gg/api/bots/1241818111238213703/check?userId=${interaction.user.id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyNDE4MTgxMTEyMzgyMTM3MDMiLCJib3QiOnRydWUsImlhdCI6MTcxNzQyNTc2Mn0.r1QKXbkPmlTLm5jPL4kre7mG0C_OZ5ACkZ4I6qQ-TvE"
                }
            });

            if (response.data["voted"] !== 1) {
                return interaction.reply({ embeds: [oylazim] });
            }

            let randomJoke = getRandomJoke(jokes);
            while (usedJokes.includes(randomJoke)) {
                randomJoke = getRandomJoke(jokes);
            }

            usedJokes.push(randomJoke);
            if (usedJokes.length > 5) {
                usedJokes.shift();
            }

            const embed = new MessageEmbed()
                .setTitle('<:0_:1206985334118809660><:1_:1206985335989600316><:2_:1206985338527162398><:3_:1206985332235444345>')
                .setDescription(randomJoke)
                .setColor('#fb00ff');

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },
};

function getRandomJoke(jokes) {
    return jokes[Math.floor(Math.random() * jokes.length)];
}