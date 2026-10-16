const scene = document.getElementById('experience');
const song = document.getElementById('song');
const lampButton = document.getElementById('lampButton');
const introHint = document.getElementById('introHint');
const soundNote = document.getElementById('soundNote');
const room = document.getElementById('room');
const boardView = document.getElementById('boardView');
const approachButton = document.getElementById('approachButton');
const backButton = document.getElementById('backButton');
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.getElementById('closeModal');
const audioNotice = document.getElementById('audioNotice');
let noticeTimer;
song.volume = 0.28; // Volumen inicial moderado (28%)

function showNotice(message) {
  audioNotice.textContent = message;
  audioNotice.classList.add('show');
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => audioNotice.classList.remove('show'), 3600);
}

async function startMusic() {
  try {
    song.volume = 0.12;
    await song.play();
    // Subida suave hasta un volumen moderado, sin un golpe de sonido al iniciar.
    const targetVolume = 0.28;
    const fadeStart = performance.now();
    const fadeDuration = 2200;
    const fade = (now) => {
      const progress = Math.min(1, (now - fadeStart) / fadeDuration);
      song.volume = 0.12 + (targetVolume - 0.12) * progress;
      if (progress < 1) requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
    soundNote.textContent = 'la música acompaña este momento';
    return true;
  } catch (e) {
    showNotice('El navegador bloqueó la música. Tocá la lámpara otra vez para intentarlo.');
    return false;
  }
}

lampButton.addEventListener('click', async () => {
  await startMusic();
  scene.classList.add('lit');
  room.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
});

approachButton.addEventListener('click', () => {
  scene.classList.add('board-open');
  boardView.setAttribute('aria-hidden', 'false');
  room.setAttribute('aria-hidden', 'true');
  // On mobile, the board itself can scroll if needed.
  boardView.scrollTop = 0;
});

backButton.addEventListener('click', () => {
  scene.classList.remove('board-open');
  boardView.setAttribute('aria-hidden', 'true');
  room.setAttribute('aria-hidden', 'false');
});

document.querySelectorAll('.photo-card[data-photo]').forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalCaption.textContent = card.querySelector('.photo-caption').textContent;
    modal.hidden = false;
    closeModal.focus();
  });
});

function dismissModal() {
  modal.hidden = true;
  modalImage.src = '';
}
closeModal.addEventListener('click', dismissModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) dismissModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) dismissModal();
});

// Try autoplay quietly. Browsers may block it until the visitor interacts.
// If blocked, the lamp button starts playback as part of the first interaction.
window.addEventListener('load', async () => {
  song.volume = 0.22;
  try {
    await song.play();
    soundNote.textContent = 'la canción ya está sonando';
  } catch (_) {
    soundNote.textContent = 'Tocá la lámpara para comenzar con música';
  }
});
