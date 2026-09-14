/*
 * 纯原生 JS,把 data.js 里的数据渲染进页面里预留好的容器 <div id="...">。
 * 每个函数开头都先检查容器是否存在,所以同一份 render.js 可以被所有页面共用,
 * 没有对应容器的页面会自动跳过那部分渲染。
 */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function renderFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

function renderFooterMeta() {
  document.querySelectorAll("[data-last-verified]").forEach((el) => (el.textContent = SITE.lastVerified));
  document.querySelectorAll("[data-site-email]").forEach((el) => {
    el.textContent = SITE.email;
    el.href = "mailto:" + SITE.email;
  });
  document.querySelectorAll("[data-scholar-url]").forEach((el) => (el.href = SITE.scholarUrl));
  document.querySelectorAll("[data-profile-url]").forEach((el) => (el.href = SITE.profileUrl));
}

function renderTagline() {
  const el = document.getElementById("hero-tagline");
  if (el) el.textContent = SITE.tagline;
}

function renderStats() {
  const el = document.getElementById("metrics-line");
  if (!el) return;
  const m = SITE.metrics;
  el.innerHTML =
    `<strong>${escapeHtml(m.hIndex)}</strong> h-index &middot; ` +
    `<strong>${escapeHtml(m.i10Index)}</strong> i10-index &middot; ` +
    `<strong>${escapeHtml(m.citations)}</strong> citations &middot; ` +
    `<strong>${escapeHtml(m.publications)}</strong> publications ` +
    `<span class="small">(Google Scholar, ${escapeHtml(SITE.lastVerified)})</span>`;
}

function renderThemeGrid() {
  const el = document.getElementById("theme-grid");
  if (!el) return;
  el.innerHTML = RESEARCH_THEMES.map(
    (t) => `<p><strong>${escapeHtml(t.title)}.</strong> ${escapeHtml(t.summary)}</p>`
  ).join("");
}

function renderAwards() {
  const el = document.getElementById("awards-list");
  if (!el) return;
  el.innerHTML = AWARDS.map((a) => `<li><strong>${escapeHtml(a.year)}</strong> — ${escapeHtml(a.text)}</li>`).join("");
}

function renderService() {
  const el = document.getElementById("service-list");
  if (el) el.innerHTML = SERVICE.map((s) => `<li>${escapeHtml(s.text)}</li>`).join("");
  const fundingEl = document.getElementById("funding-note");
  if (fundingEl) fundingEl.textContent = FUNDING_NOTE;
}

function renderCollaborators() {
  const el = document.getElementById("collaborators-list");
  if (!el) return;
  el.innerHTML = COLLABORATORS.map(
    (c) => `<li><strong>${escapeHtml(c.name)}</strong>${c.affiliation ? ` (${escapeHtml(c.affiliation)})` : ""} — ${escapeHtml(c.note)}</li>`
  ).join("");
}

function renderSponsors() {
  const el = document.getElementById("sponsors-grid");
  if (!el) return;
  el.innerHTML = SPONSOR_GROUPS.map(
    (g) => `
    <figure class="sponsor-figure">
      <img src="${escapeHtml(g.img)}" alt="${escapeHtml(g.label)} collaborators and sponsors">
      <figcaption>${escapeHtml(g.label)}</figcaption>
    </figure>`
  ).join("");
}

function renderBio() {
  const el = document.getElementById("bio");
  if (!el) return;
  el.innerHTML = BIO.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}

function renderResearchDetail() {
  const el = document.getElementById("research-detail");
  if (!el) return;
  el.innerHTML = RESEARCH_THEMES.map((t) => {
    const related = PUBLICATIONS.filter((p) => t.pubThemes.includes(p.theme)).slice(0, 4);
    const pubItems = related
      .map((p) => `<li>${p.year}. ${escapeHtml(p.title)} <span class="muted">— ${escapeHtml(p.venue)}</span></li>`)
      .join("");
    const subareas = t.subareas
      .map(
        (s) => `
        <h4>${escapeHtml(s.title)}</h4>
        <ul class="subarea-list">${s.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
      )
      .join("");
    return `
      <h2>${escapeHtml(t.title)}</h2>
      <p>${escapeHtml(t.summary)}</p>
      ${subareas}
      ${pubItems ? `<h4>Representative Publications</h4><ul class="pub-mini-list">${pubItems}</ul>` : ""}`;
  }).join("");
}

function formatCitation(p) {
  const parts = [];
  if (p.venue) parts.push(p.venue);
  if (p.volume) parts.push(p.volume + (p.issue ? `(${p.issue})` : ""));
  if (p.pages) parts.push(p.pages);
  parts.push(String(p.year));
  return parts.join(", ") + ".";
}

function renderPublications() {
  const el = document.getElementById("publications-list");
  if (!el) return;
  const years = [...new Set(PUBLICATIONS.map((p) => p.year))].sort((a, b) => b - a);
  el.innerHTML = years
    .map((year) => {
      const items = PUBLICATIONS.filter((p) => p.year === year)
        .map((p) => {
          const authorsLine = p.authors && p.authors.length ? `<span class="pub-authors">${escapeHtml(p.authors.join(", "))}.</span>` : "";
          const doiLine = p.doi ? ` <a href="https://doi.org/${escapeHtml(p.doi)}" target="_blank" rel="noopener">DOI</a>` : "";
          return `
        <li class="pub-entry">
          <span class="pub-title">${escapeHtml(p.title)}.</span>
          ${authorsLine}
          <span class="pub-cite">${escapeHtml(formatCitation(p))}</span>${doiLine}
        </li>`;
        })
        .join("");
      return `<h2 class="pub-year-heading">${year}</h2><ul class="pub-list">${items}</ul>`;
    })
    .join("");
}

function renderOpenProjects() {
  const el = document.getElementById("open-projects-list");
  if (!el) return;
  if (!OPEN_PROJECTS.length) {
    el.innerHTML = `<p class="muted">No projects currently advertised. Please email directly to discuss opportunities.</p>`;
    return;
  }
  el.innerHTML = OPEN_PROJECTS.map(
    (p) => `
    <div class="project-card">
      <p class="small muted">${escapeHtml(p.area)} &middot; ${escapeHtml(p.theme)}</p>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <p class="small"><strong>Supervisor:</strong> ${escapeHtml(p.supervisorTitle)}</p>
      ${p.note ? `<p class="note-line">${escapeHtml(p.note)}</p>` : ""}
      ${p.applyNow ? `<p><a class="apply-link" href="https://www.adelaide.edu.au/research/research-degrees/research-projects/" target="_blank" rel="noopener">Apply now &rarr;</a></p>` : ""}
    </div>`
  ).join("");
}

function renderTeam() {
  const piEl = document.getElementById("pi-card");
  if (piEl) {
    const pi = TEAM.pi;
    const avatar = pi.photo
      ? `<img src="${escapeHtml(pi.photo)}" alt="${escapeHtml(pi.name)}" class="avatar-photo">`
      : `<div class="avatar-box">photo</div>`;
    const links = pi.links.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`).join("");
    piEl.innerHTML = `
      <div class="pi-block">
        ${avatar}
        <div class="pi-text">
          <h3 class="muted" style="color:var(--ink)">${escapeHtml(pi.name)}</h3>
          <p class="muted">${escapeHtml(pi.title)}</p>
          <p>${escapeHtml(pi.bioShort)}</p>
          <p class="link-row">${links}</p>
        </div>
      </div>`;
  }

  const studentsEl = document.getElementById("students-grid");
  if (studentsEl) {
    if (TEAM.students.length > 0) {
      studentsEl.innerHTML = TEAM.students
        .map((s) => `<p class="member-entry"><strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.level)}. ${escapeHtml(s.topic)}</p>`)
        .join("");
    } else {
      studentsEl.innerHTML = `<p class="muted">No named students on the public record yet. See current project topics below, and get in touch via <a href="opportunities.html">Opportunities</a>.</p>`;
    }
  }

  const projectsEl = document.getElementById("current-projects-list");
  if (projectsEl) {
    projectsEl.innerHTML = CURRENT_PROJECTS.map((p) => `<li>${escapeHtml(p)}</li>`).join("");
  }

  const alumniEl = document.getElementById("alumni-list");
  if (alumniEl) {
    alumniEl.innerHTML =
      TEAM.alumni.length > 0
        ? TEAM.alumni.map((a) => `<li><strong>${escapeHtml(a.name)}</strong> (${escapeHtml(a.level)}, ${a.year}) — ${escapeHtml(a.destination)}</li>`).join("")
        : `<p class="muted">No alumni records yet.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFooterYear();
  renderFooterMeta();
  renderTagline();
  renderStats();
  renderThemeGrid();
  renderAwards();
  renderService();
  renderCollaborators();
  renderSponsors();
  renderBio();
  renderResearchDetail();
  renderPublications();
  renderOpenProjects();
  renderTeam();
});
