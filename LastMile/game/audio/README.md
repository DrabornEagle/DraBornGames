# LastMile v0.7.2 — Müzik

Oyunda yalnızca iki gerçek MP3 müzik parçası bulunur:

- `InnerLight.mp3` — Kurye Merkezi ve ana menü.
- `SeMeNota.mp3` — aktif vardiya ve sürüş.

Telefon ve WebView paket boyutunu düşük tutmak için kullanıcı tarafından sağlanan MP3 kaynakları 32 kHz mono / 32 kbps mobil oyun kopyasına dönüştürülmüştür. Derleme her iki dosyanın boyutunu ve SHA-256 değerini doğrular; eski prosedürel müzik motoru susturulur ve önceki altı v0.5 MP3 dosyası paketten kaldırılmıştır.
