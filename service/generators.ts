
import { ScriptType, LeagueGroup, MatchData } from '../types';

export const TOGEL_PASARAN_LIST = [
  'BANGKOK', 'BRUNEI', 'BULLSEYE', 'CALIFORNIA', 'CAMBODIA', 'CAROLINA', 'CHELSEA', 
  'FLORIDA', 'HOKIDRAW', 'HONGKONG', 'HUAHIN', 'KENTUCKY', 'KING KONG4D', 'MAGNUM4D', 
  'NEVADA', 'NEW YORK', 'OREGON', 'PCSO', 'POIPET', 'SINGAPORE', 'SYDNEY', 'TOTOMACAU', 'TOTOMALI'
];

export const SHIO_LIST = [
  { name: 'Tikus', emoji: '🐀' }, { name: 'Kerbau', emoji: '🐂' }, { name: 'Macan', emoji: '🐅' },
  { name: 'Kelinci', emoji: '🐇' }, { name: 'Naga', emoji: '🐉' }, { name: 'Ular', emoji: '🐍' },
  { name: 'Kuda', emoji: '🐎' }, { name: 'Kambing', emoji: '🐐' }, { name: 'Monyet', emoji: '🐒' },
  { name: 'Ayam', emoji: '🐓' }, { name: 'Anjing', emoji: '🐕' }, { name: 'Babi', emoji: '🐖' }
];

const SYAIR_LIBRARY: Record<string, string[]> = {
  'Tikus': ["Si cerdik lari di lorong sempit", "Mencari celah di angka jitu", "Malam ini bintang melilit", "Hoki datang tepat waktu."],
  'Kerbau': ["Di padang luas kerbau berdiri kokoh", "Kokoh kuat tiada terperi", "Nomor hoki dalam genggaman roh", "Bawa keberuntungan sepanjang hari."],
  'Macan': ["Auman rimba pecahkan sunyi", "Garis loreng membawa angka", "Jangan ragu pasang di sini", "Jackpot besar segera terbuka."],
  'Kelinci': ["Lompatan tangkas di taman bunga", "Angka cantik sembunyi di telinga", "Keberuntungan bukan sekadar bunga", "Pasang niat raih mahkota."],
  'Naga': ["Naga emas terbang membumbung", "Membawa api angka keberuntungan", "Siapa cepat dia yang untung", "Langit biru saksi kemenangan."],
  'Ular': ["Lilitan sunyi di balik batu", "Sisik berkilau angka rahasia", "Tetapkan hati di satu waktu", "Malam indah penuh bahagia."],
  'Kuda': ["Derap langkah pacu kencang", "Membawa kabar dari seberang", "Angka lari jangan dihalang", "Bawa pulang emas berkilang."],
  'Kambing': ["Embek merdu di atas bukit", "Mencari rumput angka yang jitu", "Jangan biarkan mimpi jatuh sakit", "Angka main sudah menunggu."],
  'Monyet': ["Aksi lincah di dahan pohon", "Memetik buah angka kejutan", "Jangan lupa untuk memohon", "Hoki besar jadi kenyataan."],
  'Ayam': ["Kokok pagi bangunkan jiwa", "Membawa berkah di paruh emas", "Angka cantik takkan kecewa", "Hasil besar raih dengan puas."],
  'Anjing': ["Setia menjaga pintu rejeki", "Gonggongan keras tanda menanti", "Angka mistik sudah didaki", "Jangan lepas mimpi di hati."],
  'Babi': ["Mencari untung di tanah subur", "Perut kenyang angka makmur", "Semua duka kini terkubur", "Malam ini hoki takkan luntur."]
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateUniqueNumbers = (count: number, digits: number): string[] => {
  const results = new Set<string>();
  while (results.size < count) {
    let num = "";
    for (let i = 0; i < digits; i++) num += rand(0, 9).toString();
    results.add(num);
  }
  return Array.from(results);
};

export const getImlekShio = () => {
  const year = new Date().getFullYear();
  const shioIndex = (year - 4) % 12;
  return SHIO_LIST[shioIndex];
};

export const generateSyairContent = (shioName?: string): string => {
  const shio = shioName || getImlekShio().name;
  const poems = SYAIR_LIBRARY[shio] || SYAIR_LIBRARY['Naga'];
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const bbfs = generateUniqueNumbers(7, 1).join(' • ');
  const am = generateUniqueNumbers(5, 1).join(' • ');
  const shioAngka = `${rand(10, 99)} • ${rand(10, 99)} • ${rand(10, 99)}`;

  let output = `SYAIR TOGEL - ${dateStr}\n`;
  output += `SHIO HARI INI: ${shio.toUpperCase()}\n`;
  output += `ANGKA SHIO TERBAIK: ${shioAngka}\n`;
  output += `BBFS JITU:\n${bbfs}\n\n`;
  output += `ANGKA MAIN:\n${am}\n\n`;
  output += `"${poems.join(' ')}"`;
  return output;
};

const parseBolaToHTML = (input: string): string => {
  const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const groups: LeagueGroup[] = [];
  let currentLeague: LeagueGroup | null = null;
  const matchRegex = /^(\d{2}\/\d{2})\s+(\d{2}:\d{2}\s+WIB)\s+(.+?)\s+(\d+\s*:\s*\d+)$/i;

  lines.forEach(line => {
    const match = line.match(matchRegex);
    if (match) {
      if (!currentLeague) {
        currentLeague = { leagueName: "LAIN-LAIN", matches: [] };
        groups.push(currentLeague);
      }
      currentLeague.matches.push({ time: match[1], teams: match[3], score: match[4], extra: match[2] } as any);
    } else {
      currentLeague = { leagueName: line, matches: [] };
      groups.push(currentLeague);
    }
  });

  let tableRows = '';
  groups.forEach((group, idx) => {
    tableRows += `<tr><td colspan="3" class="league">⚽ ${group.leagueName.toUpperCase()}</td></tr><tr><th>TANGGAL</th><th>PERTANDINGAN</th><th>PREDIKSI</th></tr>`;
    group.matches.forEach(m => {
      const md = m as any;
      tableRows += `<tr><td>${md.time}<br /><span>${md.extra}</span></td><td>${md.teams}</td><td>${md.score}</td></tr>`;
    });
    if (idx < groups.length - 1) tableRows += `<tr><td colspan="3" style="height: 15px;"></td></tr>`;
  });

  return `<!-- KODE BOLA ABADIWIN -->
<style>
body { background: url("https://cdn.areabermain.club/assets/cdn/az2/2026/01/17/20260117/fd23ec7444085ce9baaec2e5ef286006/abadiwin-background.jpg") center/cover fixed no-repeat; margin:0; font-family: Arial, sans-serif; color:#fff; }
.arena-wrap { background: rgba(0,0,0,0.88); padding: 20px; border-radius: 12px; box-shadow: 0 0 35px rgba(0,153,255,0.7); max-width: 1000px; margin: 20px auto; }
.logo { text-align:center; margin-bottom:15px; } .logo img { max-width:260px; filter: drop-shadow(0 0 20px #0099ff); }
.marquee { background: linear-gradient(90deg,#0055aa,#66ccff,#0055aa); color:#fff; padding:12px; overflow:hidden; white-space:nowrap; font-weight:bold; margin-bottom:15px; border-radius: 8px; }
.marquee span { display:inline-block; animation: run 25s linear infinite; } @keyframes run { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
table { width: 100%; border-collapse: collapse; background: rgba(30,30,30,0.9); font-size: 14px; margin-bottom: 20px; border-radius: 8px; overflow: hidden; }
th { background: linear-gradient(135deg,#0077cc,#ccffff); color: #fff; padding: 10px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #99ccff; text-shadow: 0 0 6px #000; }
td { padding: 8px 10px; border-bottom: 1px solid #006699; color:#cceeff; text-align: center; }
td span { font-size: 12px; color: #66ccff; }
.league { background: linear-gradient(135deg,#003366,#0099ff); color:#cceeff; font-weight:bold; text-align:center; padding:14px; font-size:17px; text-shadow: 0 0 10px #0099ff; }
</style>
<div class="arena-wrap">
  <div class="logo"><img src="https://cdn.areabermain.club/assets/cdn/az2/2026/01/17/20260117/906884f06ce7e9d84c4fb76480da1e49/abadiwin-logoacc.png" /></div>
  <div class="marquee"><span>🔥 Prediksi Bola Terupdate &bull; Analisis Akurat &bull; ABADIWIN 🔥</span></div>
  <table><tbody>${tableRows}</tbody></table>
</div>`;
};

const parseTogelToHTML = (input: string): string => {
  const lines = input.split('\n').map(l => l.trim());
  let pasaran = "HONGKONG";
  let bbfs = "1 • 9 • 6 • 8 • 2 • 0 • 4";
  let am = "1 • 9 • 6 • 8 • 2";
  let shio = getImlekShio().name.toUpperCase();
  let shioAngka = `${rand(10, 99)} • ${rand(10, 99)} • ${rand(10, 99)}`;
  let date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  let poem = "Setiap syair disusun dari kode alam pilihan untuk peluang jackpot Anda.";

  let captureBBFS = false;
  let captureAM = false;

  lines.forEach((line, idx) => {
    const l = line.toUpperCase();
    if (l.includes("🏳️") || l.includes("PREDIKSI") || l.includes("SYAIR TOGEL")) {
       const clean = line.replace(/[🏳️|📅|PREDIKSI|SYAIR TOGEL|PASARAN|—|🎰|🎲|🎯|🔥|⚡|🐾|💠|📌|🍀]/gi, '').trim();
       if (clean) pasaran = clean;
    }
    if (l.includes("📅")) date = line.replace("📅", "").trim().toUpperCase();
    if (l.includes("BBFS")) { captureBBFS = true; captureAM = false; return; }
    if (l.includes("ANGKA IKUT") || l.includes("ANGKA MAIN")) { captureAM = true; captureBBFS = false; return; }
    if (captureBBFS && line.includes("•")) { bbfs = line; captureBBFS = false; }
    if (captureAM && line.includes("•")) { am = line; captureAM = false; }
    if (l.includes("SHIO") || l.includes("🐾")) {
      let extracted = line.replace(/[🐾|COLOK|SHIO|:]/gi, '').trim();
      if (!extracted && idx + 1 < lines.length) extracted = lines[idx + 1].trim();
      if (extracted) {
        shio = extracted.replace(/[^\w\s]/gi, '').trim().toUpperCase();
        const parts = shio.split(/\s+/);
        shio = parts[parts.length - 1];
      }
    }
    if (line.includes('"')) poem = line.replace(/"/g, '').trim();
  });

  return `<!-- KODE SYAIR ABADIWIN PREMIUM -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Poppins', sans-serif; background: #000; color: #fff; display: flex; flex-direction: column; align-items: center; min-height: 100vh; overflow-x: hidden; }
.stars { position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: -1; pointer-events: none; }
.star { position: absolute; border-radius: 50%; background: #fff; opacity: 0; animation: blink 3s infinite; }
@keyframes blink { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
.neon-logo { display: block; margin: 30px auto 15px auto; max-width: 180px; width: 100%; filter: drop-shadow(0 0 15px #0ff); animation: neonBlink 1.5s infinite alternate; }
@keyframes neonBlink { 0%, 100% { filter: drop-shadow(0 0 10px #0ff); } 50% { filter: drop-shadow(0 0 20px #0ff); } }
.marquee-box { width: 100%; padding: 15px 0; background: linear-gradient(270deg, #ff0048, #ff7b00, #ffe600, #00ffea, #ff00f2); background-size: 1000% 1000%; animation: animateGradient 15s ease infinite; overflow: hidden; text-align: center; }
@keyframes animateGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.marquee-text { font-size: 20px; font-weight: 700; text-shadow: 0 0 12px #fff; white-space: nowrap; display: inline-block; animation: moveText 12s linear infinite; }
@keyframes moveText { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
.card { width: 95%; max-width: 800px; margin: 25px auto; padding: 30px; border-radius: 20px; background: rgba(0,255,255,0.05); backdrop-filter: blur(15px); border: 2px solid rgba(255,255,255,0.1); box-shadow: 0 0 40px rgba(0,255,255,0.2); text-align: center; }
.title { font-size: 32px; font-weight: 700; background: linear-gradient(90deg, #ff00f2, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
.sub-title { font-size: 14px; color: #ccc; margin-bottom: 22px; }
.banner-img { display: block; margin: 0 auto 25px auto; width: 100%; border-radius: 15px; box-shadow: 0 0 25px rgba(0,255,255,0.2); }
.info-box { margin-top: 20px; padding: 20px; border-radius: 12px; background: rgba(255,0,255,0.1); border-left: 5px solid #ff009d; text-align: left; line-height: 1.8; }
.info-box strong { color: #00eaff; }
.poem { margin-top: 25px; padding: 22px; border-radius: 15px; background: rgba(0,255,255,0.05); font-style: italic; font-size: 17px; color: #ffe6f0; text-shadow: 0 0 5px #ff00ff; }
.footer-text { margin-top: 30px; font-size: 12px; color: #bbb; }
</style>
<div class="stars" id="stars"></div>
<img src="https://cdn.areabermain.club/assets/cdn/az1/2026/01/14/20260114/6b4bc6990943304dce0adac8cdf5a6d8/abadiwin-logoacc.png" class="neon-logo" />
<div class="marquee-box"><span class="marquee-text">✨ ABADIWIN — Syair Pilihan, Inspirasi Angka, & Keberuntungan Setiap Hari! ✨</span></div>
<div class="card">
  <div class="title">SYAIR TOGEL PASARAN ${pasaran.toUpperCase()}</div>
  <div class="sub-title">${date} • ABADIWIN</div>
  <img src="https://cdn.areabermain.club/assets/cdn/az6/2026/02/09/20260209/ebfc207610b9c8c0b0afed0440cd89b8/segera-pasang-dengan-semangat-tinggi-2.jpg" class="banner-img" />
  <div class="info-box">
    🔮 <strong>ANGKA SHIO TERBAIK:</strong> ${shioAngka}<br />
    🐅 <strong>SHIO JITU:</strong> ${shio.toUpperCase()}<br /><br />
    🔢 <strong>BBFS JITU:</strong> ${bbfs}<br />
    🎯 <strong>ANGKA MAIN:</strong> ${am}
  </div>
  <div class="poem">"${poem}"</div>
  <div class="footer-text">Setiap syair disusun dari kode alam pilihan,<br />untuk membuka peluang keberuntungan Anda.<br /><strong>Salam Jackpot dari ABADIWIN ✨</strong></div>
</div>
<script>
const sc = document.getElementById('stars');
if(sc) {
  for(let i=0; i<200; i++){
    const s = document.createElement('div');
    s.classList.add('star');
    const sz = Math.random()*2 + 1;
    s.style.width = sz+'px'; s.style.height = sz+'px';
    s.style.top = Math.random()*100+'%'; s.style.left = Math.random()*100+'%';
    s.style.animationDuration = (Math.random()*3 + 1)+'s';
    sc.appendChild(s);
  }
}
</script>`;
};

export const generatePrediksiTogel = (pasaran: string): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const bbfs = generateUniqueNumbers(7, 1).join(' • ');
  const am = generateUniqueNumbers(5, 1).join(' • ');
  
  // LOGIKA BARU: Pilih Shio secara acak untuk setiap pasaran
  const randomShio = SHIO_LIST[Math.floor(Math.random() * SHIO_LIST.length)];
  
  let output = `🏳️ ${pasaran.toUpperCase()}\n📅 ${dateStr}\n━━━━━━━━━━━━━━━━━━\n\n`;
  output += `🧿 BBFS KUAT:\n${bbfs}\n\n🎯 ANGKA IKUT:\n${am}\n\n`;
  output += `🎰 4D (BB):\n✨ ${generateUniqueNumbers(4, 4).join(' — ')}\n\n`;
  output += `🎲 3D (BB):\n${generateUniqueNumbers(4, 3).join(' — ')}\n\n`;
  output += `🎯 2D (BB):\n${generateUniqueNumbers(10, 2).join(' • ')}\n\n`;
  output += `🔥 COLOK BEBAS:\n${rand(0, 9)} / ${rand(0, 9)}\n\n`;
  output += `⚡ COLOK MACAU:\n${rand(0, 9)}${rand(0, 9)} • ${rand(0, 9)}${rand(0, 9)}\n\n`;
  output += `🐾 COLOK SHIO:\n${randomShio.emoji} ${randomShio.name.toUpperCase()}\n\n`;
  output += `💠 INVEST TWIN:\n${rand(0,9)}${rand(0,9)} • ${rand(0,9)}${rand(0,9)}\n\n`;
  output += `📌 Catatan:\nUtamakan prediksi sendiri 🍀`;
  return output;
};

export const generateOutput = (type: ScriptType, input: string): string => {
  if (type === ScriptType.BOLA) return parseBolaToHTML(input);
  if (type === ScriptType.TOGEL || type === ScriptType.SYAIR) return parseTogelToHTML(input);
  if (type === ScriptType.BUKTI_JP) {
    const [userId, amount, game] = input.split('|');
    const cleanUserId = userId || "Usyyyyyy";
    const cleanAmount = amount || "75,000,000";
    const cleanGame = game || "Sweet Bonanza Provider PRAGMATIC PLAY";

    return `<div class="entry">
    <img src="URL_GAMBAR_BARU.jpg" alt="Kemenangan User Baru" />
    <div class="text">
        <em><b>Selamat Kepada User Id ${cleanUserId}</b> berhasil meraih kemenangan fantastis sebesar <span class="neon-text">Rp ${cleanAmount},-</span> di permainan ${cleanGame}.<br /><br />Penarikan dana sebesar <span class="neon-text">Rp ${cleanAmount},-</span> telah <b class="neon-text">SUKSES DITRANSFER</b> dengan cepat dan aman.</em>
    </div>
</div>

user id : ${cleanUserId}
nominal kemenangan : ${cleanAmount}
permainan : ${cleanGame}`;
  }
  return "";
};

// --- BOLA CALCULATOR ENGINE ---
export const calculateBolaWin = (market: string, hdp: number, odds: number, stake: number, resultGD: number): string => {
  if (stake <= 0) return "INPUT STAKE TIDAK VALID.";

  let status = "LOSS";
  let payout = 0;
  let profit = -stake;

  if (market === "1X2" || market === "BTTS" || market === "CORRECT_SCORE" || market === "DNB") {
    // Basic Binary Win Logic
    if (resultGD > 0) { // Assume 'resultGD > 0' means 'Winning Outcome' for these markets
      payout = stake * odds;
      status = "WIN";
    } else if (resultGD === 0 && market === "DNB") {
      payout = stake;
      status = "REFUND";
    }
  } else if (market === "HDP") {
    const diff = resultGD + hdp;
    if (diff > 0.25) {
      status = "WIN FULL";
      payout = stake * odds;
    } else if (diff === 0.25) {
      status = "HALF WIN";
      payout = stake + (stake * (odds - 1)) / 2;
    } else if (diff === 0) {
      status = "REFUND";
      payout = stake;
    } else if (diff === -0.25) {
      status = "HALF LOSS";
      payout = stake / 2;
    } else {
      status = "LOSS";
      payout = 0;
    }
  } else if (market === "OU") {
    const totalGoals = resultGD; // For OU we reuse resultGD as 'Total Goals'
    const diff = totalGoals - hdp;
    if (diff > 0.25) {
      status = "OVER WIN";
      payout = stake * odds;
    } else if (diff === 0.25) {
      status = "OVER HALF WIN";
      payout = stake + (stake * (odds - 1)) / 2;
    } else if (diff === 0) {
      status = "REFUND";
      payout = stake;
    } else if (diff === -0.25) {
      status = "UNDER HALF WIN (HALF LOSS FOR OVER)";
      payout = stake / 2;
    } else {
      status = "LOSS";
      payout = 0;
    }
  }

  profit = payout - stake;

  let output = `⚽ NEXUS SPORTS ANALYTICS - BET TICKET\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `MARKET  : ${market.replace('_', ' ')}\n`;
  output += `ODDS    : ${odds.toFixed(2)}\n`;
  output += `STAKE   : Rp ${stake.toLocaleString('id-ID')}\n`;
  if (market === "HDP" || market === "OU") output += `LINE    : ${hdp > 0 ? '+' + hdp : hdp}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `STATUS  : ${status}\n`;
  output += `PAYOUT  : Rp ${payout.toLocaleString('id-ID')}\n`;
  output += `PROFIT  : Rp ${profit.toLocaleString('id-ID')}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `SYSTEM_NOTE: Global standard calc applied.\n`;
  output += `✨ SALAM JACKPOT ABADIWIN ✨`;
  
  return output;
};

// --- CALCULATOR TOGEL LOGIC (CRASH PROTECTED) ---
export const calculateTogelWin = (market: "4D" | "5D", betCategory: string, rewardType: string, stake: number): string => {
  if (stake <= 0) return "MASUKKAN NOMINAL TARUHAN VALID.";
  
  let result = `📊 ABADIWIN SYSTEM - WIN CALCULATOR\n`;
  result += `MARKET: ${market} | TYPE: ${betCategory} (${rewardType})\n`;
  result += `STAKE: Rp ${stake.toLocaleString('id-ID')}\n`;
  result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // 4D MARKET LOGIC
  if (market === "4D") {
    if (rewardType === "FULL") {
      const mult = betCategory === "4D" ? 10000 : betCategory === "3D" ? 1000 : 100;
      result += `💠 HADIAH FULL ${betCategory}\n`;
      result += `🏆 ESTIMASI WIN: Rp ${(stake * mult).toLocaleString('id-ID')}\n`;
    } 
    else if (rewardType === "BB") {
      const data: Record<string, number[]> = { "4D": [4000, 200], "3D": [400, 100], "2D": [70, 20] };
      const config = data[betCategory];
      if (config) {
        result += `💠 HADIAH BOLAK-BALIK ${betCategory}\n`;
        result += `✅ TEPAT: Rp ${(stake * config[0]).toLocaleString('id-ID')}\n`;
        result += `🔄 TERBALIK: Rp ${(stake * config[1]).toLocaleString('id-ID')}\n`;
      } else {
        result += `⚠️ KATEGORI ${betCategory} TIDAK VALID UNTUK BB.\n`;
      }
    }
    else if (rewardType === "DISKON") {
      const data: Record<string, number[]> = { "4D": [3000, 0.665], "3D": [400, 0.595], "2D": [70, 0.295] };
      const config = data[betCategory];
      if (config) {
        const [mult, disc] = config;
        const stakeFinal = stake * (1 - disc);
        result += `💠 HADIAH DISKON ${betCategory}\n`;
        result += `🧧 DISKON (${(disc * 100).toFixed(1)}%): Rp ${(stake * disc).toLocaleString('id-ID')}\n`;
        result += `💸 BET AFTER DISC: Rp ${stakeFinal.toLocaleString('id-ID')}\n`;
        result += `🏆 WIN: Rp ${(stake * mult).toLocaleString('id-ID')}\n`;
      } else {
        result += `⚠️ KATEGORI ${betCategory} TIDAK VALID UNTUK DISKON.\n`;
      }
    }
    else if (rewardType === "PRIZE_123") {
      const data: Record<string, number[]> = { 
        "4D": [6500, 2100, 1100], 
        "3D": [650, 210, 110], 
        "2D": [70, 20, 8] 
      };
      const config = data[betCategory];
      if (config) {
        result += `💠 HADIAH PRIZE 1/2/3 ${betCategory}\n`;
        result += `🥇 PRIZE 1: Rp ${(stake * config[0]).toLocaleString('id-ID')}\n`;
        result += `🥈 PRIZE 2: Rp ${(stake * config[1]).toLocaleString('id-ID')}\n`;
        result += `🥉 PRIZE 3: Rp ${(stake * config[2]).toLocaleString('id-ID')}\n`;
      } else {
        result += `⚠️ KATEGORI ${betCategory} TIDAK VALID UNTUK PRIZE 123.\n`;
      }
    }
  } 
  // 5D MARKET LOGIC (HOKIDRAW)
  else {
    if (betCategory === "5D" && rewardType === "FULL") {
      result += `💠 HOKIDRAW 5D (FULL)\n`;
      result += `🏆 5D: Rp ${(stake * 88000).toLocaleString('id-ID')}\n`;
      result += `🏆 4D: Rp ${(stake * 10000).toLocaleString('id-ID')}\n`;
      result += `🏆 3D: Rp ${(stake * 1000).toLocaleString('id-ID')}\n`;
      result += `🏆 2D: Rp ${(stake * 100).toLocaleString('id-ID')}\n`;
    }
    else if (betCategory === "5D" && rewardType === "DISKON") {
      const config = [
        { l: "5D", m: 50000, d: 0.38 }, { l: "4D", m: 7000, d: 0.20 },
        { l: "3D", m: 750, d: 0.20 }, { l: "2D", m: 75, d: 0.20 }
      ];
      config.forEach(c => {
        result += `💠 ${c.l} DISKON (${c.d * 100}%)\n`;
        result += `💸 BET AFTER DISC: Rp ${(stake * (1-c.d)).toLocaleString('id-ID')}\n`;
        result += `🏆 TOTAL PAYOUT: Rp ${(stake * c.m).toLocaleString('id-ID')}\n\n`;
      });
    }
    else if (betCategory === "5D" && rewardType === "BB") {
      result += `💠 HOKIDRAW 5D (BB)\n`;
      result += `✅ TEPAT (5D/4D/3D/2D): 50k / 5k / 500 / 80\n`;
      result += `🔄 BB (5D/4D/3D/2D): 350 / 180 / 75 / 15\n`;
      result += `*Hitung manual berdasarkan pengali di atas.\n`;
    }
    else if (betCategory === "COLOK_BEBAS") {
      const disc = 0.06;
      const win = stake * 1.5;
      const stakeDisc = stake * (1 - disc);
      result += `💠 COLOK BEBAS (DISC 6%)\n`;
      result += `🏆 WIN: Rp ${win.toLocaleString('id-ID')}\n`;
      result += `💸 BET AFTER DISC: Rp ${stakeDisc.toLocaleString('id-ID')}\n`;
      result += `💰 TOTAL PAYOUT: Rp ${(win + stakeDisc).toLocaleString('id-ID')}\n`;
    }
    else if (betCategory === "COLOK_MACAU") {
      const disc = 0.10;
      const stakeDisc = stake * (1 - disc);
      result += `💠 COLOK MACAU 2D (DISC 10%)\n`;
      result += `🎲 2 ANGKA: Rp ${(stake * 7 + stakeDisc).toLocaleString('id-ID')}\n`;
      result += `🎲 3 ANGKA: Rp ${(stake * 11 + stakeDisc).toLocaleString('id-ID')}\n`;
      result += `🎲 4 ANGKA: Rp ${(stake * 18 + stakeDisc).toLocaleString('id-ID')}\n`;
    }
    else if (betCategory === "SHIO") {
      const disc = 0.05;
      const stakeDisc = stake * (1 - disc);
      result += `💠 SHIO JITU (DISC 5%)\n`;
      result += `🏆 WIN: Rp ${(stake * 9.5).toLocaleString('id-ID')}\n`;
      result += `💰 TOTAL PAYOUT: Rp ${(stake * 9.5 + stakeDisc).toLocaleString('id-ID')}\n`;
    }
    else if (betCategory.includes("HOKI_DRAW")) {
      result += `💠 KHUSUS HOKI DRAW VARIAN\n`;
      result += `*Sesuai Logika: Win + (Stake - Discount)\n`;
      if (betCategory.includes("COLOK_JITU")) result += `🎯 WIN 8x + Modal Bersih\n`;
      if (betCategory.includes("COLOK_NAGA")) result += `🐉 WIN (12x/30x/125x) + Modal Bersih\n`;
    }
  }

  result += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  result += `SALAM JACKPOT — ABADIWIN`;
  return result;
};
