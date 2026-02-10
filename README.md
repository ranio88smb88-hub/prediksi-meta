
# Nexus Content Formatter

A professional administrative tool designed to automate content formatting for structured posting.

## Features
- **Prediksi Bola**: Generates clean HTML/CSS tables grouped by leagues.
- **Prediksi Togel**: Standardized emoji-based text output.
- **Syair Togel**: Multi-line poetry formatting with pasaran headers.
- **Bukti JP**: Financial proof summaries with labels.
- **Interactive Background**: High-performance Three.js metaballs effect.

## Technical Details
- **Architecture**: React (Vite/TSX) with Tailwind CSS.
- **Parsing Engine**: Regex-based string processing for high flexibility.
- **Styling**: Minimalist "Nexus" dark theme using custom typography.

## How to Deploy
1. **GitHub**: Push this repository to your GitHub account.
2. **Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New** -> **Project**.
   - Import this repository.
   - Choose **Vite** as the framework preset (or simply let it auto-detect).
   - Click **Deploy**.

## Logic Parsing Explanation
Aplikasi ini menggunakan kombinasi pemrosesan baris demi baris dan regular expression (RegEx).
- **Bola**: Memisahkan teks berdasarkan baris, mengidentifikasi Liga (teks non-format skor) dan Match (menggunakan regex `\d{2}/\d{2} ... VS`).
- **Togel/JP**: Mencari kata kunci (PASARAN, BBFS, WIN, dll) dan mengambil nilai setelahnya menggunakan lookahead/splitting.
- **Syair**: Mengambil baris 'Pasaran' sebagai header dan baris sisanya sebagai konten utama.
