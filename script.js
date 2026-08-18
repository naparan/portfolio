/* ============================================
   Portfolio - Common JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // --- Hamburger menu ---
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".global-nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("open");
      hamburger.setAttribute(
        "aria-expanded",
        nav.classList.contains("open").toString()
      );
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Scroll fade-in ---
  const fadeEls = document.querySelectorAll(".fade-in");
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach((el) => observer.observe(el));
  }

  // --- Active nav highlight ---
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".global-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // --- Email address ---
  // Built at runtime so the address never appears as a literal string in the
  // served HTML. This stops the simple crawlers that scrape pages for
  // anything shaped like an address; it is not real protection against
  // anyone who reads the DOM.
  document.querySelectorAll(".obfuscated-mail").forEach((holder) => {
    const user = holder.dataset.user;
    const domain = holder.dataset.domain;
    if (!user || !domain) return;

    const link = document.createElement("a");
    link.href = ["mailto", ":", user, "@", domain].join("");
    link.textContent = user + "@" + domain;
    holder.replaceChildren(link);
  });

  // --- Synced comparison videos ---
  document.querySelectorAll("[data-sync-group]").forEach((group) => {
    const videos = Array.from(group.querySelectorAll("video"));
    if (videos.length < 2) return;

    // Re-issuing play/pause on an element already in that state is a no-op and
    // fires no event, so these handlers settle after one round trip.
    videos.forEach((video) => {
      video.addEventListener("play", () => {
        videos.forEach((other) => {
          if (other === video) return;
          other.currentTime = video.currentTime;
          other.play().catch(() => {});
        });
      });

      video.addEventListener("pause", () => {
        videos.forEach((other) => {
          if (other !== video) other.pause();
        });
      });

      video.addEventListener("seeked", () => {
        videos.forEach((other) => {
          // Only nudge a pane that has actually drifted, otherwise each
          // assignment fires another seeked and the pair ping-pongs.
          if (other !== video && Math.abs(other.currentTime - video.currentTime) > 0.05) {
            other.currentTime = video.currentTime;
          }
        });
      });
    });
  });

  // --- Works category filter ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card[data-category]");

  if (filterBtns.length > 0 && cards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active state
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          if (filter === "all" || card.dataset.category === filter) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
            // Don't leave a hidden card's video playing audio off-screen.
            card.querySelectorAll("video").forEach((video) => video.pause());
          }
        });
      });
    });
  }
});
