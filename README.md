# 24 GYO

Türkçe, duyarlı gayrimenkul sitesi. React 19, TypeScript ve Vite ile oluşturulmuştur. **Yayımlanacak hazır site `dist/` içindedir**; sunucuda derleme ya da arka uç gerekmez.

![24 GYO masaüstü görünümü](artifacts/desktop-home.jpg)

## Kurulum ve geliştirme

Node.js **22.18+ veya 24+** ve npm kullanın. Kilit dosyası depoya dahildir.

```sh
npm ci
npm run dev
```

Terminalin yazdığı yerel adresi açın. Bağımlılıklar standart npm kayıt deposundan yüklenir. `node_modules/` ve önbellekler teslimata dahil değildir; her düzeyde `.gitignore` kapsamındadır.

## Kontrol, yeniden derleme ve önizleme

```sh
npm run typecheck
npm test
npm run build
npm run verify:export
npm run preview
```

`npm test` yerleşik Node test koşucusuyla filtre, bütçe sınırı, favoriler ve Türkçe para biçimlendirmesi için 8 test çalıştırır. `verify:export`, HTML/CSS içindeki yerel varlıkları, göreli URL’leri ve `public/` dosyalarının birebir kopyalarını denetler. `npm run build`, `dist/` içeriğini yeniden üretir; önceki derlemenin dosyalarını temizler. Önizleme için terminalin yazdığı adresi kullanın. `index.html` dosyasını `file://` ile açmak yerine HTTP üzerinden sunun.

Node kurmadan hazır çıktıyı görüntülemek için, Python varsa:

```sh
python3 -m http.server 8080 --directory dist
```

Sonra `http://localhost:8080` adresini açın. Bu komut yalnızca yerel önizleme içindir.

## Yayınlama

1. İletişim ve portföy içeriğini aşağıdaki dosyalardan düzenleyin.
2. Yukarıdaki kontrolleri ve üretim derlemesini çalıştırın.
3. **`dist/` içeriğinin tamamını**, `index.html`, `assets/`, `images/`, `favicon.svg` ve `third-party.txt` birlikte olacak şekilde statik sunucunuzun yayın klasörüne yükleyin.
4. Kaynakları ve kilit dosyasını sürüm kontrolünde tutarken, güncel `dist/` çıktısını da teslim edin. Yayıncı yeniden derleme yapmadan bu çıktıyı kullanabilir.

`vite.config.ts` içindeki `base: "./"` ve bölüm bağlantıları (`#portfoy`, `#iletisim` vb.), siteyi kök dizinde veya `/emlak/` gibi bir alt dizinde çalıştırır. SPA yönlendirme kuralı, sunucu sırrı, API anahtarı, cüzdan veya veri tabanı yoktur. CSS, JavaScript, görseller ve Türkçe karakterleri içeren yazı tipleri yerel olarak sunulur. JavaScript etkin bir modern tarayıcı gerekir.

## İçerik ve iletişim ayarları

- `src/properties.ts`: 6 **açıkça örnek olarak etiketlenmiş** ilan; fotoğraf, konum, fiyat, tür, oda, banyo, brüt alan ve özellikler. Bunlar doğrulanmış şirket ilanları değildir. Gerçek yayın için doğrulanmış içerikle değiştirin; kullanım hakkına sahip görselleri `public/images/` içine koyun.
- `src/site-config.ts`: `email`, `phone`, `address`, `officeHours`. Gerçek şirket bilgileri verilmediğinden değerler `null` bırakılmıştır; sitede “Yakında paylaşılacak” gösterilir. Yalnızca doğrulanmış şirket bilgilerini girin ve yeniden derleyin. Gizli anahtar yazmayın; bu dosya herkesin erişebileceği çıktıya girer.
- `src/App.tsx`: şirket tanıtımı, misyon, vizyon, hizmetler, Türkçe bölüm metinleri ve menü.
- `src/styles.css`: tasarım sistemi ve duyarlı stiller. Ayrıntılar [DESIGN.md](DESIGN.md) içinde.

**Form davranışı:** Form yerel olarak doğrulanır, seçilen mülkü/hizmeti talebe ekler ve talep metnini indirme/kopyalama olanağı sağlar. “Henüz iletilmedi” ifadesi gösterilir; sahte gönderim başarısı yoktur. Doğrulanmış `email` ayarlandığında, talebi kullanıcının e-posta uygulamasında açan bir bağlantı da görünür. Gönderim kullanıcının e-posta uygulamasında tamamlanır. Bu sürüm sunucuya form göndermez, iletişim bilgilerini saklamaz ve e-posta teslimatı yapmaz. Talep sayfa yenilendiğinde silinir.

**Favoriler:** Yalnızca ilan kimlikleri tarayıcının `localStorage` alanında saklanır (`24gyo-favorites`). Depolama engellenirse favoriler o oturumda çalışmaya devam eder. Hesaplar arası eşitleme yoktur.

## Çalıştırılmış kontroller

2026-10-10 tarihinde Node 24.21.0 ve npm 11.19.0 ile:

| Kontrol | Gerçek sonuç |
| --- | --- |
| `npm run typecheck` | Geçti, çıkış kodu 0 |
| `npm test` | 8/8 geçti |
| `npm run build` | Geçti; 36 modül, `dist/` üretildi |
| `npm run verify:export` | 15 yerel varlık kontrolü geçti; 14 çıktı dosyası, 1.251.413 bayt |
| Chromium / gerçek üretim çıktısı | `/preview/` alt dizininde menü, filtreler, boş sonuç, favoriler, ilan penceresi, form doğrulama, indirme ve kopyalama denendi |
| Duyarlı görünüm | 320, 390, 768, 1024 ve 1440 CSS piksel genişlikleri kontrol edildi; yatay taşma gözlenmedi |
| axe-core 4.10.3 | Son masaüstü ve mobil taramada 0 otomatik ihlal; manuel inceleme gerektiren sonuçlar raporlandı |
| Konsol ve kaynaklar | Son üretim oturumunda hata yok; yerel kaynaklar başarıyla yüklendi |

Bu çalışma ortamında repository `node_modules/` dizinine dokunmamak için aynı kaynak ve kilitli bağımlılıklar `/tmp/24gyo-build` içinde derlendi, sonuç `dist/` içine kopyalandı. Tekrar üretim için bu geçici dizin gerekli değildir. Son teslimde `node scripts/verify-export.mjs` ayrıca repository içinde çalıştırıldı.

Komut çıktıları [artifacts/build-checks.txt](artifacts/build-checks.txt), altı alanı kapsayan Better Interface incelemesi ve düzeltmeler [artifacts/validation.md](artifacts/validation.md), ekran görüntüleri `artifacts/` içindedir. Kontroller çalışan tarafından yapılmıştır; bağımsız sertifikasyon değildir.

**Sınırlar:** Gerçek şirket iletişim bilgileri ve gerçek ilanlar sahibince girilmelidir. Gerçek e-posta gönderimi, fiziksel cihazlar, Safari/Firefox, ekran okuyucular ve tarayıcının yerel %200 yakınlaştırması doğrulanmadı. Dar ekran testi, yerel tarayıcı yakınlaştırmasının yerine geçmez. Otomatik erişilebilirlik taraması tam erişilebilirlik uygunluğu iddiası değildir.

Görsel/yazı tipi kaynakları [ASSETS.md](ASSETS.md), lisanslar `licenses/`, paket boyutu bütçesi [artifacts/submission-budget.md](artifacts/submission-budget.md) içinde bulunur.
