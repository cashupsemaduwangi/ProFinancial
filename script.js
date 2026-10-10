// ==========================================
// KONFIGURASI API BACKEND GOOGLE APPS SCRIPT
// ==========================================
const API_URL =
  "https://script.google.com/macros/s/AKfycbzZ3KVkH_NzVULyvZQimfvF8PCFcehhsJvtYlzf-d3zvSTeZteFjMUo0ABJDH9m8bKymA/exec";

// Toggle password visibility
function togglePassword(inputId, eyeOffId, eyeOnId) {
  const passwordInput = document.getElementById(inputId);
  const eyeOff = document.getElementById(eyeOffId);
  const eyeOn = document.getElementById(eyeOnId);

  if (passwordInput.type === "password") {
    // Ubah mode ke Teks (Password Terlihat)
    passwordInput.type = "text";
    eyeOff.classList.add("hidden"); // Sembunyikan mata disilang
    eyeOn.classList.remove("hidden"); // Tampilkan mata terbuka
  } else {
    // Ubah mode ke Password (Password Tersembunyi)
    passwordInput.type = "password";
    eyeOff.classList.remove("hidden"); // Tampilkan mata disilang
    eyeOn.classList.add("hidden"); // Sembunyikan mata terbuka
  }
}
// Switch antara Tab Login & Register
function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    tabLoginBtn.classList.add("active");
    tabRegisterBtn.classList.remove("active");
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    tabRegisterBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
  }
}

// Modal Pop-up Helper
function showModal(title, message, icon = "⚠️") {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;
  document.getElementById("modalIcon").innerText = icon;
  document.getElementById("statusModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("statusModal").classList.add("hidden");
}

function openResetModal() {
  document.getElementById("resetModal").classList.remove("hidden");
}

function closeResetModal() {
  document.getElementById("resetModal").classList.add("hidden");
}

// Helper untuk set status loading pada tombol
function setLoading(btnId, isLoading, textDefault) {
  const btn = document.getElementById(btnId);
  if (isLoading) {
    btn.disabled = true;
    btn.innerHTML = `<span>Proses...</span>`;
  } else {
    btn.disabled = false;
    btn.innerHTML = `<span>${textDefault}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------------------
  // 1. EVENT SUBMIT LOGIN
  // ----------------------------------------
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    setLoading("loginSubmitBtn", true, "Masuk Ke Profin Pro");

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "login", username, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Simpan sesi login ke sessionStorage
        sessionStorage.setItem(
          "profin_user",
          JSON.stringify({
            username: result.username,
            namaLengkap: result.namaLengkap,
            isLoggedIn: true,
          }),
        );

        // Pengalihan ke halaman ProFin Pro
        window.location.href = "profinpro.html";
      } else {
        showModal("Login Gagal", result.message, "❌");
      }
    } catch (err) {
      showModal(
        "Koneksi Error",
        "Gagal terhubung ke database. Periksa internet Anda.",
        "🚨",
      );
    } finally {
      setLoading("loginSubmitBtn", false, "Masuk Ke Profin Pro");
    }
  });

  // ----------------------------------------
  // 2. EVENT SUBMIT REGISTRASI
  // ----------------------------------------
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    setLoading("regSubmitBtn", true, "Daftar Sekarang");

    const namaLengkap = document.getElementById("regNama").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const noHp = document.getElementById("regNoHp").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "register",
          namaLengkap,
          username,
          noHp,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Auto Login setelah registrasi berhasil
        sessionStorage.setItem(
          "profin_user",
          JSON.stringify({
            username: result.username,
            namaLengkap: result.namaLengkap,
            isLoggedIn: true,
          }),
        );

        showModal(
          "Registrasi Berhasil!",
          "Selamat datang di Profin Pro. Mengalihkan...",
          "🎉",
        );
        setTimeout(() => {
          window.location.href = "profinpro.html";
        }, 1500);
      } else {
        showModal("Registrasi Gagal", result.message, "⚠️");
      }
    } catch (err) {
      showModal("Koneksi Error", "Terjadi kesalahan koneksi ke server.", "🚨");
    } finally {
      setLoading("regSubmitBtn", false, "Daftar Sekarang");
    }
  });

  // ----------------------------------------
  // 3. EVENT RESET PASSWORD
  // ----------------------------------------
  const resetForm = document.getElementById("resetForm");
  resetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    setLoading("resetSubmitBtn", true, "Simpan Password");

    const username = document.getElementById("resetUsername").value.trim();
    const email = document.getElementById("resetEmail").value.trim();
    const newPassword = document
      .getElementById("resetNewPassword")
      .value.trim();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "resetPassword",
          username,
          email,
          newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        closeResetModal();
        showModal("Password Diperbarui", result.message, "✅");
      } else {
        showModal("Gagal Reset", result.message, "❌");
      }
    } catch (err) {
      showModal("Koneksi Error", "Gagal memperbarui password.", "🚨");
    } finally {
      setLoading("resetSubmitBtn", false, "Simpan Password");
    }
  });
});
