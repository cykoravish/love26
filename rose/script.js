/* ===========================
   Rose Day - Vanilla JavaScript
   =========================== */

(function () {
  "use strict";

  /* ---- DOM References ---- */
  const navbar = document.getElementById("navbar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  const roseCards = document.querySelectorAll(".rose-card");
  const modal = document.getElementById("rose-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalMessage = document.getElementById("modal-message");
  const modalContent = document.getElementById("modal-content");

  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const musicBars = document.querySelectorAll(".music-bar");

  const petalsContainer = document.getElementById("petals-container");
  const scrollRevealEls = document.querySelectorAll(".scroll-reveal");

  /* ==================================
     1) SMOOTH SCROLL FOR ANCHOR LINKS
     ================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href");
      var target = document.querySelector(targetId);
      if (target) {
        var navHeight = navbar ? navbar.offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
    });
  });

  /* ==================================
     2) NAVBAR SCROLL STATE
     ================================== */
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ==================================
     3) MOBILE MENU TOGGLE
     ================================== */
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  /* ==================================
     4) SCROLL REVEAL (Intersection Observer)
     ================================== */
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    scrollRevealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    scrollRevealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  /* ==================================
     5) ROSE CARD MODAL
     ================================== */
  function openModal(message) {
    if (!modal || !modalMessage) return;
    modalMessage.textContent = message;
    modal.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("visible");
    document.body.style.overflow = "";
  }

  roseCards.forEach(function (card) {
    card.addEventListener("click", function () {
      var message = this.getAttribute("data-message");
      if (message) openModal(message);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  // Close modal on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ==================================
     6) MUSIC PLAYER WITH PLAYLIST
     ================================== */
  var playlist = [
    { src: "music/music1.mp3", title: "Romantic Melody" },
    { src: "music/music2.mp3", title: "Heartfelt Serenade" },
    { src: "music/music3.mp3", title: "Love in the Air" }
  ];

  var currentTrackIndex = 0;
  var isPlaying = false;
  var isShuffled = false;

  var trackTitle = document.getElementById("track-title");
  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");
  var shuffleBtn = document.getElementById("shuffle-btn");
  var trackItems = document.querySelectorAll(".track-item");

  function loadTrack(index) {
    if (!bgMusic) return;
    currentTrackIndex = index;
    bgMusic.src = playlist[index].src;
    if (trackTitle) trackTitle.textContent = playlist[index].title;
    updateActiveTrackUI();
  }

  function updateActiveTrackUI() {
    trackItems.forEach(function (item) {
      var idx = parseInt(item.getAttribute("data-index"), 10);
      var icon = item.querySelector(".track-playing-icon");
      var numEl = item.querySelector(".track-number");
      if (idx === currentTrackIndex) {
        item.classList.add("bg-rose-50");
        if (icon) icon.classList.remove("hidden");
        if (numEl) {
          numEl.classList.remove("bg-rose-100", "text-rose-500");
          numEl.classList.add("bg-rose-600", "text-white");
        }
      } else {
        item.classList.remove("bg-rose-50");
        if (icon) icon.classList.add("hidden");
        if (numEl) {
          numEl.classList.remove("bg-rose-600", "text-white");
          numEl.classList.add("bg-rose-100", "text-rose-500");
        }
      }
    });
  }

  function playCurrentTrack() {
    if (!bgMusic) return;
    bgMusic.play().then(function () {
      isPlaying = true;
      if (playIcon) playIcon.classList.add("hidden");
      if (pauseIcon) pauseIcon.classList.remove("hidden");
      musicBars.forEach(function (bar) {
        bar.classList.add("playing");
      });
    }).catch(function (err) {
      console.warn("Audio playback was prevented:", err);
    });
  }

  function pauseCurrentTrack() {
    if (!bgMusic) return;
    bgMusic.pause();
    isPlaying = false;
    if (playIcon) playIcon.classList.remove("hidden");
    if (pauseIcon) pauseIcon.classList.add("hidden");
    musicBars.forEach(function (bar) {
      bar.classList.remove("playing");
    });
  }

  function toggleMusic() {
    if (!bgMusic) return;
    // If no track loaded yet, load first
    if (!bgMusic.src || bgMusic.src === window.location.href) {
      loadTrack(0);
    }
    if (isPlaying) {
      pauseCurrentTrack();
    } else {
      playCurrentTrack();
    }
  }

  function playNext() {
    if (isShuffled) {
      var randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentTrackIndex && playlist.length > 1);
      loadTrack(randomIndex);
    } else {
      var nextIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(nextIndex);
    }
    playCurrentTrack();
  }

  function playPrev() {
    var prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
    playCurrentTrack();
  }

  // Button listeners
  if (musicToggle) musicToggle.addEventListener("click", toggleMusic);
  if (nextBtn) nextBtn.addEventListener("click", playNext);
  if (prevBtn) prevBtn.addEventListener("click", playPrev);

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function () {
      isShuffled = !isShuffled;
      if (isShuffled) {
        shuffleBtn.classList.remove("bg-rose-100", "text-rose-600");
        shuffleBtn.classList.add("bg-rose-600", "text-white");
      } else {
        shuffleBtn.classList.remove("bg-rose-600", "text-white");
        shuffleBtn.classList.add("bg-rose-100", "text-rose-600");
      }
    });
  }

  // Clicking on a track in the playlist
  trackItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-index"), 10);
      loadTrack(idx);
      playCurrentTrack();
    });
  });

  // When a track ends, auto-play next
  if (bgMusic) {
    bgMusic.addEventListener("ended", function () {
      playNext();
    });
  }

  /* ==================================
     7) FLOATING PETALS
     ================================== */
  function createPetal() {
    if (!petalsContainer) return;

    var petal = document.createElement("div");
    petal.classList.add("petal");

    // Random horizontal position
    petal.style.left = Math.random() * 100 + "%";

    // Random size variation
    var size = 8 + Math.random() * 12;
    petal.style.width = size + "px";
    petal.style.height = size + "px";

    // Random animation duration (slow, gentle fall)
    var duration = 8 + Math.random() * 12;
    petal.style.animationDuration = duration + "s";

    // Random delay so they don't all start at once
    petal.style.animationDelay = Math.random() * 5 + "s";

    // Slightly random opacity
    petal.style.opacity = 0.3 + Math.random() * 0.4;

    petalsContainer.appendChild(petal);

    // Remove petal after animation completes to prevent DOM bloat
    setTimeout(function () {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    }, (duration + 5) * 1000);
  }

  // Create initial batch of petals
  for (var i = 0; i < 15; i++) {
    createPetal();
  }

  // Continuously add petals at intervals
  setInterval(function () {
    createPetal();
  }, 2000);

  /* ==================================
     8) ACTIVE NAV LINK HIGHLIGHT
     ================================== */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll('nav a[href^="#"]');

  function highlightActiveLink() {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove("text-gold-light");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("text-gold-light");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightActiveLink, { passive: true });

})();
