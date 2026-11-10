const hero = document.querySelector('#home');
const badge = document.querySelector('#badge');
const path = document.querySelector('#tetherPath');
const badgeImage = badge.querySelector('img');
const badgeRig = badge.querySelector('.badge-rig');
const menuTemplate = document.querySelector('.site-menu');
const pageMenus = ['home', 'projects', 'video-works', 'image-works-cover', 'image-works', 'personal-ip', 'about'].map((id, index) => {
  const section = document.getElementById(id);
  const menu = index === 0 ? menuTemplate : menuTemplate.cloneNode(true);
  const panelId = `nav-panel-${id}`;
  const subnavId = `projects-subnav-${id}`;
  menu.querySelector('.nav-panel').id = panelId;
  menu.querySelector('.menu').setAttribute('aria-controls', panelId);
  menu.querySelector('.nav-panel__subnav').id = subnavId;
  menu.querySelector('[data-projects-toggle]').setAttribute('aria-controls', subnavId);
  section.prepend(menu);
  return menu;
});
const customCursor = document.querySelector('.custom-cursor');
const catTilt = document.querySelector('.ip-cat__state--tilt');
function syncCatTilt() {
  catTilt?.closest('.ip-cat')?.classList.toggle('has-tilt', catTilt.complete && catTilt.naturalWidth > 0);
}
catTilt?.addEventListener('load', syncCatTilt);
catTilt?.addEventListener('error', syncCatTilt);
syncCatTilt();

function closePageMenus() {
  pageMenus.forEach((menu) => {
    const button = menu.querySelector('.menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '打开菜单');
    const panel = menu.querySelector('.nav-panel');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    menu.querySelector('[data-projects-toggle]').setAttribute('aria-expanded', 'false');
    menu.querySelector('.nav-panel__subnav').hidden = true;
  });
}
closePageMenus();
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-menu')) closePageMenus();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePageMenus();
});

function playEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    badge.classList.remove('pre-enter');
    return;
  }

  const frames = [];
  const step = 1 / 120;
  let elapsed = 0;
  let y = -window.innerHeight * 1.3;
  let velocity = 0;
  let hasLanded = false;

  while (elapsed < 4.2) {
    let acceleration;
    if (!hasLanded) {
      acceleration = 2000;
      if (y >= 0) hasLanded = true;
    } else {
      acceleration = -210 * y - 18 * velocity;
    }

    velocity += acceleration * step;
    y += velocity * step;
    elapsed += step;
    if (Math.round(elapsed / step) % 2 === 0) frames.push({ translate: `0 ${y.toFixed(2)}px` });
    if (hasLanded && elapsed > 1.4 && Math.abs(y) < .08 && Math.abs(velocity) < .35) break;
  }

  badge.classList.add('is-entering');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    badge.classList.remove('pre-enter');
    const entrance = badge.animate(frames, { duration: elapsed * 1000, delay: 260, easing: 'linear', fill: 'both' });
    entrance.addEventListener('finish', () => {
      badge.classList.remove('is-entering');
      entrance.cancel();
    }, { once: true });
  }));
}

playEntrance();

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    customCursor.style.setProperty('--cursor-x', `${event.clientX - 5}px`);
    customCursor.style.setProperty('--cursor-y', `${event.clientY - 4}px`);
    customCursor.classList.add('is-visible');
  });
  window.addEventListener('pointerdown', () => customCursor.classList.add('is-active'));
  window.addEventListener('pointerup', () => customCursor.classList.remove('is-active'));
  document.documentElement.addEventListener('mouseleave', () => customCursor.classList.remove('is-visible'));
}

const state = {
  x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0,
  dragging: false, pointerId: null, lastX: 0, lastY: 0, lastT: 0,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function setBadge() {
  const rotationZ = clamp(state.x * 0.035 + state.vx * 0.12, -24, 24);
  const rotationY = clamp(state.x * 0.24 + state.vx * 1.1, -125, 125);
  const rotationX = clamp(-state.y * 0.1 + state.vy * 0.65, -52, 42);
  badge.style.setProperty('--x', `${state.x}px`);
  badge.style.setProperty('--y', `${state.y}px`);
  badgeRig.style.setProperty('--rx', `${rotationX}deg`);
  badgeRig.style.setProperty('--ry', `${rotationY}deg`);
  badgeRig.style.setProperty('--rz', `${rotationZ}deg`);

  const box = badge.getBoundingClientRect();
  const startX = window.innerWidth / 2;
  const startY = 0;
  const endX = box.left + box.width / 2;
  const endY = box.top + box.height * .168;
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.max(1, Math.hypot(dx, dy));
  const normalX = -dy / length;
  const normalY = dx / length;
  const turns = clamp(Math.round(length / 9), 8, 28);
  const segments = turns * 6;
  const amplitude = 8;
  const points = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const edgeFade = Math.min(1, t / .08, (1 - t) / .08);
    const wave = Math.sin(t * Math.PI * 2 * turns) * amplitude * Math.max(0, edgeFade);
    const x = startX + dx * t + normalX * wave;
    const y = startY + dy * t + normalY * wave;
    points.push(`${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  path.setAttribute('d', points.join(' '));
}

pageMenus.forEach((menu) => {
const menuButton = menu.querySelector('.menu');
const navPanel = menu.querySelector('.nav-panel');
const projectsToggle = menu.querySelector('[data-projects-toggle]');
const projectsSubnav = menu.querySelector('.nav-panel__subnav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  closePageMenus();
  navPanel.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  navPanel.setAttribute('aria-hidden', String(!open));
  navPanel.classList.toggle('is-open', open);
  projectsToggle?.setAttribute('aria-expanded', 'false');
  if (projectsSubnav) projectsSubnav.hidden = true;
});

navPanel.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-projects-toggle]');
  if (toggle) {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    if (projectsSubnav) projectsSubnav.hidden = !open;
    return;
  }

  const link = event.target.closest('a');
  if (!link) return;
  closePageMenus();
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开菜单');
  navPanel.setAttribute('aria-hidden', 'true');
  navPanel.classList.remove('is-open');

  if (link.dataset.nav === 'home') {
    event.preventDefault();
    hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#home');
  }
});

});

function startDrag(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  state.dragging = true;
  state.pointerId = event.pointerId;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  state.lastT = performance.now();
  badge.setPointerCapture(event.pointerId);
  badge.classList.add('is-dragging');
  hero.classList.add('is-dragging');
}

function moveDrag(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) return;
  const now = performance.now();
  const dt = Math.max(8, now - state.lastT);
  const dx = event.clientX - state.lastX;
  const dy = event.clientY - state.lastY;
  state.x = clamp(state.x + dx, -window.innerWidth * .34, window.innerWidth * .34);
  state.y = clamp(state.y + dy, -8, window.innerHeight * .34);
  state.vx = (dx / dt) * 16;
  state.vy = (dy / dt) * 16;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  state.lastT = now;
  setBadge();
}

function endDrag(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) return;
  state.dragging = false;
  badge.classList.remove('is-dragging');
  hero.classList.remove('is-dragging');
  if (badge.hasPointerCapture(event.pointerId)) badge.releasePointerCapture(event.pointerId);
  state.pointerId = null;
}

function animate() {
  if (!state.dragging) {
    const spring = .038;
    const damping = .89;
    state.vx = (state.vx + (state.targetX - state.x) * spring) * damping;
    state.vy = (state.vy + (state.targetY - state.y) * spring) * damping;
    state.x += state.vx;
    state.y += state.vy;
    if (Math.abs(state.x) < .02 && Math.abs(state.y) < .02 && Math.abs(state.vx) < .02 && Math.abs(state.vy) < .02) {
      state.x = state.y = state.vx = state.vy = 0;
    }
    setBadge();
  }
  requestAnimationFrame(animate);
}

badge.addEventListener('pointerdown', startDrag);
badge.addEventListener('pointermove', moveDrag);
badge.addEventListener('pointerup', endDrag);
badge.addEventListener('pointercancel', endDrag);
badge.addEventListener('keydown', (event) => {
  const step = event.shiftKey ? 30 : 12;
  if (event.key === 'ArrowLeft') state.x -= step;
  else if (event.key === 'ArrowRight') state.x += step;
  else if (event.key === 'ArrowDown') state.y += step;
  else if (event.key === 'ArrowUp') state.y -= step;
  else if (event.key === 'Escape' || event.key === 'Enter') state.x = state.y = 0;
  else return;
  event.preventDefault();
  setBadge();
});

window.addEventListener('resize', setBadge);
setBadge();
animate();

const revealItems = document.querySelectorAll('.reveal-item');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .16, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const videoModal = document.querySelector('#episode-video-modal');
const videoOpenButton = document.querySelector('[data-video-open]');
const videoCloseButtons = videoModal?.querySelectorAll('[data-video-close]') || [];
const videoModalClose = videoModal?.querySelector('.video-modal__close');
const episodeVideo = videoModal?.querySelector('.episode-video');
const videoShell = videoModal?.querySelector('.video-shell');
const videoToggle = videoModal?.querySelector('.video-toggle');
const videoTime = videoModal?.querySelector('.video-time');
const videoProgress = videoModal?.querySelector('.video-progress');
const videoMute = videoModal?.querySelector('.video-mute');
const videoFullscreen = videoModal?.querySelector('.video-fullscreen');

const formatVideoTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

function syncVideoControls() {
  if (!episodeVideo) return;
  const duration = Number.isFinite(episodeVideo.duration) ? episodeVideo.duration : 0;
  const percent = duration ? (episodeVideo.currentTime / duration) * 100 : 0;
  videoProgress?.style.setProperty('--video-progress', `${percent}%`);
  videoProgress?.setAttribute('aria-valuenow', String(Math.round(percent)));
  if (videoTime) videoTime.textContent = `${formatVideoTime(episodeVideo.currentTime)} / ${formatVideoTime(duration)}`;
  if (videoToggle) {
    videoToggle.textContent = episodeVideo.paused ? '▶' : 'Ⅱ';
    videoToggle.setAttribute('aria-label', episodeVideo.paused ? '播放视频' : '暂停视频');
  }
  if (videoMute) {
    videoMute.textContent = episodeVideo.muted ? 'MUTE' : 'VOL';
    videoMute.setAttribute('aria-label', episodeVideo.muted ? '打开声音' : '静音');
  }
}

function toggleEpisodeVideo() {
  if (!episodeVideo) return;
  if (episodeVideo.paused) episodeVideo.play().catch(showVideoFailure);
  else episodeVideo.pause();
}

function seekEpisodeVideo(clientX) {
  if (!episodeVideo || !videoProgress || !Number.isFinite(episodeVideo.duration)) return;
  const rect = videoProgress.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  episodeVideo.currentTime = ratio * episodeVideo.duration;
}

function openVideoModal() {
  if (!videoModal) return;
  videoModal.classList.add('is-open');
  videoModal.setAttribute('aria-hidden', 'false');
  videoModalClose?.focus();
  episodeVideo?.play().catch(showVideoFailure);
}

function showVideoFailure(error) {
  if (error?.name === 'AbortError') return;
  const status = document.querySelector('.video-status');
  if (!status) return;
  status.textContent = error?.name === 'NotAllowedError'
    ? '请点击播放按钮开始播放。'
    : '视频暂时无法加载，请刷新后重试。';
  status.hidden = false;
}
episodeVideo?.addEventListener('error', showVideoFailure);
episodeVideo?.querySelector('source')?.addEventListener('error', showVideoFailure);
episodeVideo?.addEventListener('playing', () => {
  const status = document.querySelector('.video-status');
  if (status) status.hidden = true;
});

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('is-open');
  videoModal.setAttribute('aria-hidden', 'true');
  episodeVideo?.pause();
  videoOpenButton?.focus();
}

videoOpenButton?.addEventListener('click', openVideoModal);
videoCloseButtons.forEach((button) => button.addEventListener('click', closeVideoModal));
episodeVideo?.addEventListener('click', toggleEpisodeVideo);
episodeVideo?.addEventListener('play', syncVideoControls);
episodeVideo?.addEventListener('pause', syncVideoControls);
episodeVideo?.addEventListener('timeupdate', syncVideoControls);
episodeVideo?.addEventListener('loadedmetadata', syncVideoControls);
episodeVideo?.addEventListener('volumechange', syncVideoControls);
videoToggle?.addEventListener('click', toggleEpisodeVideo);
videoProgress?.addEventListener('pointerdown', (event) => seekEpisodeVideo(event.clientX));
videoProgress?.addEventListener('keydown', (event) => {
  if (!episodeVideo || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  episodeVideo.currentTime = Math.min(episodeVideo.duration, Math.max(0, episodeVideo.currentTime + (event.key === 'ArrowRight' ? 5 : -5)));
});
videoMute?.addEventListener('click', () => {
  if (episodeVideo) episodeVideo.muted = !episodeVideo.muted;
});
videoFullscreen?.addEventListener('click', () => {
  if (!document.fullscreenElement) videoShell?.requestFullscreen?.();
  else document.exitFullscreen?.();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && videoModal?.classList.contains('is-open')) closeVideoModal();
});

const cameraGallery = document.querySelector('[data-camera-gallery]');
const cameraShutter = cameraGallery?.querySelector('[data-camera-shutter]');
const cameraPhoto = cameraGallery?.querySelector('[data-camera-image]');
const cameraPrint = cameraGallery?.querySelector('[data-photo-print]');
const cameraCount = cameraGallery?.querySelector('[data-camera-count]');
const cameraClose = cameraGallery?.querySelector('[data-photo-close]');
const cameraPrevious = cameraGallery?.querySelector('[data-photo-prev]');
const cameraNext = cameraGallery?.querySelector('[data-photo-next]');
// Use the same ordered collection as the film strip to avoid stale filenames.
const cameraImages = [...document.querySelectorAll('.film-set:first-child > .film-frame img')]
  .map((image) => image.getAttribute('src'));
let cameraIndex = -1;
let cameraLocked = false;

cameraImages.forEach((source) => {
  const image = new Image();
  image.src = source;
});

function changeCameraPhoto(nextIndex, animatePhoto = true) {
  if (!cameraGallery || !cameraPhoto) return;
  cameraIndex = (nextIndex + cameraImages.length) % cameraImages.length;
  cameraPhoto.src = cameraImages[cameraIndex];
  cameraPhoto.alt = `舞台摄影作品 ${String(cameraIndex + 1).padStart(2, '0')}`;
  if (cameraCount) cameraCount.textContent = `${String(cameraIndex + 1).padStart(2, '0')} / ${String(cameraImages.length).padStart(2, '0')}`;
  cameraGallery.classList.add('is-open');
  if (animatePhoto && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cameraPrint?.classList.remove('is-changing');
    void cameraPrint?.offsetWidth;
    cameraPrint?.classList.add('is-changing');
  }
}

function takeCameraPhoto() {
  if (!cameraGallery || cameraLocked) return;
  cameraLocked = true;
  cameraGallery.classList.remove('is-shooting');
  cameraShutter?.classList.add('is-pressed');
  void cameraGallery.offsetWidth;
  cameraGallery.classList.add('is-shooting');

  const nextIndex = cameraIndex < 0 ? 0 : cameraIndex + 1;
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 135;
  window.setTimeout(() => changeCameraPhoto(nextIndex, cameraIndex >= 0), delay);
  window.setTimeout(() => {
    cameraGallery.classList.remove('is-shooting');
    cameraShutter?.classList.remove('is-pressed');
    cameraLocked = false;
  }, delay ? 540 : 0);
}

cameraShutter?.addEventListener('click', takeCameraPhoto);
cameraPrevious?.addEventListener('click', () => changeCameraPhoto(cameraIndex - 1));
cameraNext?.addEventListener('click', () => changeCameraPhoto(cameraIndex + 1));
cameraClose?.addEventListener('click', () => {
  cameraGallery?.classList.remove('is-open');
  cameraShutter?.focus();
});

document.addEventListener('keydown', (event) => {
  if (!cameraGallery?.classList.contains('is-open')) return;
  if (event.key === 'ArrowLeft') changeCameraPhoto(cameraIndex - 1);
  else if (event.key === 'ArrowRight') changeCameraPhoto(cameraIndex + 1);
  else if (event.key === 'Escape') {
    cameraGallery.classList.remove('is-open');
    cameraShutter?.focus();
  } else return;
  event.preventDefault();
});

const filmCamera = document.querySelector('[data-film-camera]');
const filmTrack = filmCamera?.querySelector('.film-track');
const firstFilmSet = filmTrack?.querySelector('.film-set');
const filmShutter = filmCamera?.querySelector('[data-film-shutter]');
const filmScrubber = filmCamera?.querySelector('[data-film-scrubber]');
let isFilmScrubbing = false;

if (filmTrack && firstFilmSet && !filmTrack.querySelector('.film-set[aria-hidden="true"]')) {
  const repeatedFilmSet = firstFilmSet.cloneNode(true);
  repeatedFilmSet.setAttribute('aria-hidden', 'true');
  repeatedFilmSet.querySelectorAll('img').forEach((image) => {
    image.alt = '';
  });
  filmTrack.append(repeatedFilmSet);
}

filmShutter?.addEventListener('click', () => {
  filmCamera?.classList.remove('is-flashing');
  filmShutter.classList.add('is-pressed');
  void filmCamera?.offsetWidth;
  filmCamera?.classList.add('is-flashing');
  window.setTimeout(() => {
    filmCamera?.classList.remove('is-flashing');
    filmShutter.classList.remove('is-pressed');
  }, 520);
});

function getFilmRollAnimation() {
  return filmTrack?.getAnimations().find((animation) => animation.effect?.getTiming().iterations === Infinity) || filmTrack?.getAnimations()[0];
}

function setFilmPositionFromScrubber() {
  const animation = getFilmRollAnimation();
  if (!animation || !filmScrubber) return;
  const duration = Number(animation.effect.getTiming().duration);
  if (!Number.isFinite(duration) || duration <= 0) return;
  animation.currentTime = (Number(filmScrubber.value) / Number(filmScrubber.max)) * duration;
}

function finishFilmScrubbing() {
  if (!isFilmScrubbing) return;
  isFilmScrubbing = false;
  getFilmRollAnimation()?.play();
}

filmScrubber?.addEventListener('pointerdown', () => {
  isFilmScrubbing = true;
  getFilmRollAnimation()?.pause();
});
filmScrubber?.addEventListener('input', setFilmPositionFromScrubber);
filmScrubber?.addEventListener('change', () => {
  setFilmPositionFromScrubber();
  finishFilmScrubbing();
});
window.addEventListener('pointerup', finishFilmScrubbing);
window.addEventListener('pointercancel', finishFilmScrubbing);

function syncFilmScrubber() {
  const animation = getFilmRollAnimation();
  if (animation && filmScrubber && !isFilmScrubbing) {
    const duration = Number(animation.effect.getTiming().duration);
    const currentTime = Number(animation.currentTime);
    if (Number.isFinite(duration) && duration > 0 && Number.isFinite(currentTime)) {
      filmScrubber.value = String(((currentTime % duration) / duration) * Number(filmScrubber.max));
    }
  }
  requestAnimationFrame(syncFilmScrubber);
}

requestAnimationFrame(syncFilmScrubber);
