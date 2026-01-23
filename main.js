// Space Safari - Simplified JavaScript

let chaptersData = [];

document.addEventListener("DOMContentLoaded", () => {
  loadChaptersData();
  setupMenuToggle();
});

function setupMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const sideMenu = document.getElementById("side-menu");
  const chapterLinks = document.querySelectorAll(".side-menu .chapter-link");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (sideMenu.classList.contains("active")) {
        closeMenu();
      } else {
        sideMenu.classList.add("active");
        document.body.classList.add("menu-open");
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });
  }

  chapterLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu when clicking overlay on mobile
  document.addEventListener("click", (e) => {
    if (
      sideMenu.classList.contains("active") &&
      !sideMenu.contains(e.target) &&
      !(menuToggle && menuToggle.contains(e.target))
    ) {
      closeMenu();
    }
  });
}

function closeMenu() {
  const sideMenu = document.getElementById("side-menu");
  sideMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
}

function loadChaptersData() {
  const jsonPath = document.body.classList.contains("chapter-page")
    ? "../data/chapters.json"
    : "data/chapters.json";

  fetch(jsonPath)
    .then((response) => response.json())
    .then((data) => {
      chaptersData = data.chapters;
      renderChapterMenu();

      // Render homepage menu if it exists
      const homepageMenu = document.getElementById("chapters-menu-homepage");
      if (homepageMenu) {
        renderChapterMenuFullWidth(homepageMenu);
      }
    })
    .catch((error) => console.error("Error loading chapters:", error));
}

function renderChapterMenu() {
  const menu = document.getElementById("chapters-menu");
  if (!menu) return;

  menu.innerHTML = "";
  chaptersData.forEach((chapter) => {
    const link = document.createElement("a");
    const isChapterPage = document.body.classList.contains("chapter-page");
    link.href = isChapterPage
      ? `chapter-${chapter.number}.html`
      : `chapters/chapter-${chapter.number}.html`;
    link.className = "chapter-link";

    link.innerHTML = `<span class="chapter-number">${String(chapter.number).padStart(2, "0")}</span><span class="chapter-title">${chapter.title}</span>`;

    menu.appendChild(link);
  });
}

function renderChapterMenuFullWidth(menuElement) {
  menuElement.innerHTML = "";
  chaptersData.forEach((chapter) => {
    const link = document.createElement("a");
    link.href = `chapters/chapter-${chapter.number}.html`;
    link.className = "chapter-link";

    link.innerHTML = `<span class="chapter-number">${String(chapter.number).padStart(2, "0")}</span><span class="chapter-title">${chapter.title}</span>`;

    menuElement.appendChild(link);
  });
}

function getChapter(chapterNumber) {
  return chaptersData.find((ch) => ch.number === parseInt(chapterNumber));
}

function getPreviousChapter(chapterNumber) {
  const chapter = getChapter(chapterNumber);
  if (!chapter || chapter.id === 1) return null;
  return getChapter(chapter.id - 1);
}

function getNextChapter(chapterNumber) {
  const chapter = getChapter(chapterNumber);
  if (!chapter || chapter.id === chaptersData.length) return null;
  return getChapter(chapter.id + 1);
}

function renderChapterPage(chapterNumber) {
  const chapter = getChapter(chapterNumber);
  if (!chapter) {
    window.location.href = "/";
    return;
  }

  document.title = `${chapter.title} - Space Safari`;

  const header = document.querySelector(".chapter-header");
  if (header) {
    header.innerHTML = `
            <h1>Chapter ${chapter.number}: ${chapter.title}</h1>
            <div class="chapter-meta">
                <span>📚 ${chapter.sections.length} sections</span>
                <span>🎬 ${chapter.videoSuggestions.length} videos</span>
                <span>🔗 ${chapter.resources.length} resources</span>
            </div>
        `;
  }

  const summary = document.querySelector("#chapter-summary");
  if (summary) {
    summary.innerHTML = `
            <div class="content-section">
                <h2>Overview</h2>
                <p>${chapter.summary}</p>
                <div class="key-topics">
                    ${chapter.keyTopics.map((topic) => `<span>${topic}</span>`).join("")}
                </div>
            </div>
        `;
  }

  const sections = document.querySelector("#chapter-sections");
  if (sections) {
    sections.innerHTML = `
            <div class="content-section">
                <h2>Sections</h2>
                <ul>
                    ${chapter.sections.map((section) => `<li>${section}</li>`).join("")}
                </ul>
            </div>
        `;
  }

  const videosContainer = document.querySelector("#chapter-videos");
  if (videosContainer) {
    let html = '<h2>Videos</h2><div class="video-grid">';
    chapter.videoSuggestions.forEach((video) => {
      const title = video.title || "Video";
      const source = video.source || "";
      const type = video.type || "link";

      if (type === "gif" && video.url) {
        html += `
                <div class="video-card">
                    <h3>${title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${source}</p>
                    <img class="video-embed gif-embed" src="${video.url}" alt="${title}" />
                </div>
            `;
      } else if (type === "youtube") {
        let embedSrc = null;
        if (video.youtubeId) {
          embedSrc = `https://www.youtube.com/embed/${video.youtubeId}`;
        } else if (video.embedUrl) {
          embedSrc = video.embedUrl;
        } else if (video.url) {
          try {
            const url = new URL(video.url);
            const host = url.hostname.replace("www.", "");
            if (host === "youtube.com" && url.pathname === "/watch") {
              const id = url.searchParams.get("v");
              if (id) embedSrc = `https://www.youtube.com/embed/${id}`;
            } else if (host === "youtu.be") {
              const id = url.pathname.split("/").filter(Boolean)[0];
              if (id) embedSrc = `https://www.youtube.com/embed/${id}`;
            }
          } catch (e) {
            // ignore parsing errors
          }
        }

        if (embedSrc) {
          html += `
                <div class="video-card">
                    <h3>${title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${source}</p>
                    <iframe class="video-embed" src="${embedSrc}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            `;
        } else {
          const linkUrl =
            video.url ||
            `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " " + source)}`;
          html += `
                <div class="video-card">
                    <h3>${title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${source}</p>
                    <a href="${linkUrl}" target="_blank">Open on YouTube</a>
                </div>
            `;
        }
      } else {
        html += `
                <div class="video-card">
                    <div style="font-size: 2rem;">🎬</div>
                    <h3>${title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${source}</p>
                    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(title + " " + source)}" target="_blank">Watch on YouTube</a>
                </div>
            `;
      }
    });
    html += "</div>";
    videosContainer.innerHTML = html;
  }

  const resourcesContainer = document.querySelector("#chapter-resources");
  if (resourcesContainer) {
    let html = '<h2>Resources</h2><div class="resource-list">';
    chapter.resources.forEach((resource) => {
      html += `
                <div class="resource-item">
                    <h3>${resource.title}</h3>
                    <p>${resource.description}</p>
                    <a href="${resource.url}" target="_blank">Visit →</a>
                </div>
            `;
    });
    html += "</div>";
    resourcesContainer.innerHTML = html;
  }

  const navContainer = document.querySelector(".chapter-nav");
  if (navContainer) {
    const prevChapter = getPreviousChapter(chapterNumber);
    const nextChapter = getNextChapter(chapterNumber);

    let html = "";

    if (prevChapter) {
      html += `
                <a href="chapter-${prevChapter.number}.html" class="nav-button">
                    <div>
                        <div class="nav-label">← Previous</div>
                        <div class="nav-title">${prevChapter.title}</div>
                    </div>
                </a>
            `;
    } else {
      html += `<a href="../index.html" class="nav-button"><div class="nav-label">← Home</div></a>`;
    }

    if (nextChapter) {
      html += `
                <a href="chapter-${nextChapter.number}.html" class="nav-button">
                    <div style="text-align: right;">
                        <div class="nav-label">Next →</div>
                        <div class="nav-title">${nextChapter.title}</div>
                    </div>
                </a>
            `;
    }

    navContainer.innerHTML = html;
  }
}

window.spacesafari = {
  getChapter,
  renderChapterPage,
};
