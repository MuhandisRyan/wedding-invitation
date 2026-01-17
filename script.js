// ========================================
// WEDDING INVITATION SCRIPT
// URL-based personalization (NO backend)
// ========================================

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);

  /* ----------------------------------------
     UTIL: FORMAT NAME
  ---------------------------------------- */
  function formatName(text) {
    return text
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /* ----------------------------------------
     GET RECIPIENT NAME
  ---------------------------------------- */
  function getRecipientName() {
    const rawName = params.get('to');

    if (!rawName || rawName.trim() === '') {
      return 'Guest';
    }

    return formatName(decodeURIComponent(rawName.trim()));
  }

  /* ----------------------------------------
     UPDATE INVITATION CONTENT
  ---------------------------------------- */
  function updateInvitation() {
    const recipientName = getRecipientName();
    const type = params.get('type'); // family | single | null

    // CARD TEXT
    const cardName = document.getElementById('cardNameText');
    const cardFamily = document.getElementById('cardFamilyText');

    if (cardName) {
      cardName.textContent = recipientName;
    }

    // Default: BLANK second line
    if (cardFamily) {
      cardFamily.textContent = '';

      if (type === 'family') {
        cardFamily.textContent = 'With Family';
      } else if (type === 'single') {
        cardFamily.textContent = '(Only)';
      }
    }

    // VIDEO TEXT (EN)
    const videoNameEn = document.getElementById('videoNameEn');
    if (videoNameEn) {
      videoNameEn.textContent = `Dear ${recipientName}`;
    }

    // VIDEO TEXT (AR)
    const videoNameAr = document.getElementById('videoNameAr');
    if (videoNameAr) {
      videoNameAr.textContent =
        recipientName === 'Guest'
          ? 'عزيزي الضيف'
          : `عزيزي ${recipientName}`;
    }

    // PAGE TITLE
    document.title = `Wedding Invitation - ${recipientName}`;
  }

  /* ----------------------------------------
     VIDEO AUTOPLAY SAFETY (MOBILE)
  ---------------------------------------- */
  function initVideo() {
    const video = document.getElementById('inviteVideo');

    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        document.body.addEventListener(
          'click',
          function playOnce() {
            video.play();
            document.body.removeEventListener('click', playOnce);
          },
          { once: true }
        );
      });
    }
  }

  /* ----------------------------------------
     INIT
  ---------------------------------------- */
  function init() {
    updateInvitation();
    initVideo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
