// ⚙️ https://docs.google.com/spreadsheets/d/1PFp7gzAUK44NqFb1PX8Hk-6brwrsj33HtoUGGzDjkW0/edit?usp=sharing
const SHEET_ID = "https://docs.google.com/spreadsheets/d/1PFp7gzAUK44NqFb1PX8Hk-6brwrsj33HtoUGGzDjkW0/edit?usp=sharing";
const SHEET_NAME = "Sheet1"; // nama tab sheet kamu

async function cariMember() {
  const username = document.getElementById("usernameInput").value.trim().toLowerCase();
  const hasilDiv = document.getElementById("hasil");

  if (!username) {
    hasilDiv.innerHTML = `<p class="error">⚠️ Masukkan username dulu ya!</p>`;
    hasilDiv.classList.remove("hidden");
    return;
  }

  hasilDiv.innerHTML = `<p class="loading">Mencari data...</p>`;
  hasilDiv.classList.remove("hidden");

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    const res = await fetch(url);
    const text = await res.text();

    // Google Sheets bungkus responsenya, kita perlu "buka"
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    // Cari username yang cocok
    let found = null;
    for (let row of rows) {
      const uname = row.c[0]?.v?.toString().toLowerCase();
      if (uname === username) {
        found = {
          username: row.c[0]?.v,
          nama_fc: row.c[1]?.v,
          status: row.c[2]?.v,
          foto: row.c[3]?.v,
        };
        break;
      }
    }

    if (!found) {
      hasilDiv.innerHTML = `<p class="error">❌ Username <strong>${username}</strong> tidak ditemukan di database.</p>`;
      return;
    }

    const isLolos = found.status?.toUpperCase() === "LOLOS";

    hasilDiv.innerHTML = `
      <div class="kartu ${isLolos ? 'lolos' : 'tidak-lolos'}">
        <img src="${found.foto}" alt="${found.nama_fc}" class="foto-fc" />
        <div class="info">
          <p class="username-display">@${found.username}</p>
          <p class="nama-fc">${found.nama_fc}</p>
          <div class="badge ${isLolos ? 'badge-lolos' : 'badge-gagal'}">
            ${isLolos ? '✓ LOLOS SELEKSI' : '✗ TIDAK LOLOS'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    hasilDiv.innerHTML = `<p class="error">⚠️ Terjadi error. Pastikan Sheet sudah dipublish.</p>`;
    console.error(err);
  }
}

// Biar bisa Enter juga
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("usernameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") cariMember();
  });
});
