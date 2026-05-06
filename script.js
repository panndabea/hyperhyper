/**
 * Hypertube API Docs — script.js
 * Plain Vanilla JS, no frameworks, no build tools.
 */

/* ============================================================
   ENDPOINT DATA
   ============================================================ */
const ENDPOINTS = [
  {
    method: "POST",
    path: "/oauth/token",
    description: "Obtain an OAuth2 Bearer token by supplying valid credentials. All subsequent authenticated requests must include this token in the Authorization header.",
    auth: false,
    requestExample: `POST /oauth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "john_doe",
  "password": "s3cr3t!"
}`,
    responseExample: `{
  "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.abc123",
  "token_type": "Bearer",
  "expires_in": 7200,
  "created_at": 1714987200
}`
  },
  {
    method: "GET",
    path: "/users",
    description: "Returns a paginated list of all registered users. Each entry contains only the public-facing fields: user ID and username.",
    auth: true,
    requestExample: `GET /users
Authorization: Bearer <access_token>`,
    responseExample: `[
  { "id": 1, "username": "john_doe" },
  { "id": 2, "username": "jane_smith" },
  { "id": 3, "username": "alice42" }
]`
  },
  {
    method: "GET",
    path: "/users/:id",
    description: "Returns public profile data for a specific user. Email addresses are kept private and not exposed to other users.",
    auth: true,
    requestExample: `GET /users/1
Authorization: Bearer <access_token>`,
    responseExample: `{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "profile_picture_url": "https://cdn.example.com/avatars/john_doe.jpg"
}`
  },
  {
    method: "PATCH",
    path: "/users/:id",
    description: "Update profile information for the authenticated user. All fields are optional; only provided fields are updated. Users can only update their own profile.",
    auth: true,
    requestExample: `PATCH /users/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "john_doe_v2",
  "email": "new_email@example.com",
  "password": "newP@ssw0rd",
  "profile_picture_url": "https://cdn.example.com/avatars/new.jpg"
}`,
    responseExample: `{
  "id": 1,
  "username": "john_doe_v2",
  "email": "new_email@example.com",
  "profile_picture_url": "https://cdn.example.com/avatars/new.jpg",
  "updated_at": "2024-05-06T10:00:00Z"
}`
  },
  {
    method: "GET",
    path: "/movies",
    description: "Returns the frontpage movie listing. Accessible without authentication. Includes top/popular movies with minimal metadata.",
    auth: false,
    requestExample: `GET /movies`,
    responseExample: `[
  { "id": 101, "name": "Inception" },
  { "id": 102, "name": "Interstellar" },
  { "id": 103, "name": "The Dark Knight" }
]`
  },
  {
    method: "GET",
    path: "/movies/:id",
    description: "Returns full details for a specific movie including IMDb rating, production year, duration, available subtitle languages, and comment count.",
    auth: false,
    requestExample: `GET /movies/101`,
    responseExample: `{
  "id": 101,
  "name": "Inception",
  "imdb_rating": 8.8,
  "production_year": 2010,
  "length_minutes": 148,
  "available_subtitles": ["en", "fr", "de", "es"],
  "comment_count": 42
}`
  },
  {
    method: "GET",
    path: "/comments",
    description: "Returns the most recent comments across all movies. Authenticated users only. Includes author username, date, comment content, and comment ID.",
    auth: true,
    requestExample: `GET /comments
Authorization: Bearer <access_token>`,
    responseExample: `[
  {
    "id": 7,
    "author": "alice42",
    "date": "2024-05-05T14:22:00Z",
    "content": "One of the best films ever made!"
  },
  {
    "id": 6,
    "author": "john_doe",
    "date": "2024-05-04T09:10:00Z",
    "content": "Great soundtrack."
  }
]`
  },
  {
    method: "GET",
    path: "/comments/:id",
    description: "Returns full details for a single comment by its ID. Requires authentication.",
    auth: true,
    requestExample: `GET /comments/7
Authorization: Bearer <access_token>`,
    responseExample: `{
  "id": 7,
  "content": "One of the best films ever made!",
  "author": "alice42",
  "date": "2024-05-05T14:22:00Z",
  "movie_id": 101
}`
  },
  {
    method: "PATCH",
    path: "/comments/:id",
    description: "Update an existing comment. Only the comment author may update their own comment.",
    auth: true,
    requestExample: `PATCH /comments/7
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comment": "Absolutely one of the best films ever made!",
  "username": "alice42"
}`,
    responseExample: `{
  "id": 7,
  "content": "Absolutely one of the best films ever made!",
  "author": "alice42",
  "date": "2024-05-05T14:22:00Z",
  "updated_at": "2024-05-06T08:00:00Z"
}`
  },
  {
    method: "DELETE",
    path: "/comments/:id",
    description: "Permanently delete a comment by ID. Only the comment author or an admin may delete a comment.",
    auth: true,
    requestExample: `DELETE /comments/7
Authorization: Bearer <access_token>`,
    responseExample: `{
  "message": "Comment 7 deleted successfully."
}`
  },
  {
    method: "POST",
    path: "/comments",
    description: "Create a new comment on a movie. The movie is identified by the movie_id field in the request body.",
    auth: true,
    requestExample: `POST /comments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comment": "Visually stunning and intellectually engaging.",
  "movie_id": 101
}`,
    responseExample: `{
  "id": 8,
  "content": "Visually stunning and intellectually engaging.",
  "author": "jane_smith",
  "date": "2024-05-06T10:30:00Z",
  "movie_id": 101
}`
  },
  {
    method: "POST",
    path: "/movies/:movie_id/comments",
    description: "Alternative route to create a comment on a specific movie. The movie is identified by the :movie_id path parameter.",
    auth: true,
    requestExample: `POST /movies/101/comments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comment": "A masterpiece of modern cinema.",
  "movie_id": 101
}`,
    responseExample: `{
  "id": 9,
  "content": "A masterpiece of modern cinema.",
  "author": "jane_smith",
  "date": "2024-05-06T10:35:00Z",
  "movie_id": 101
}`
  }
];

/* ============================================================
   STATE
   ============================================================ */
let activeMethod = "ALL";
let searchQuery  = "";

/* ============================================================
   DOM HELPERS
   ============================================================ */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCard(ep, index) {
  const authLabel = ep.auth ? "Auth required" : "Public";
  const authClass = ep.auth ? "required" : "public";
  const cardId    = `card-${index}`;
  const reqId     = `req-${index}`;
  const resId     = `res-${index}`;

  return `
<article
  class="endpoint-card"
  id="${escapeHtml(cardId)}"
  data-method="${escapeHtml(ep.method)}"
>
  <button
    class="card-header"
    aria-expanded="false"
    aria-controls="details-${escapeHtml(String(index))}"
    id="header-${escapeHtml(String(index))}"
  >
    <span class="method-badge ${escapeHtml(ep.method)}">${escapeHtml(ep.method)}</span>
    <span class="card-path">${escapeHtml(ep.path)}</span>
    <span class="auth-badge ${escapeHtml(authClass)}">${escapeHtml(authLabel)}</span>
    <svg class="chevron" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  <p class="card-desc-inline">${escapeHtml(ep.description.split(".")[0])}.</p>

  <div
    class="card-details"
    id="details-${escapeHtml(String(index))}"
    role="region"
    aria-labelledby="header-${escapeHtml(String(index))}"
  >
    <div class="card-details-inner">

      <div class="detail-description">
        <strong>Description</strong>
        ${escapeHtml(ep.description)}
      </div>

      <div class="code-block-wrap">
        <span class="code-block-label">Example Request</span>
        <pre class="code-block" id="${escapeHtml(reqId)}">${escapeHtml(ep.requestExample)}</pre>
        <button class="copy-btn" data-target="${escapeHtml(reqId)}" aria-label="Copy request example">Copy</button>
      </div>

      <div class="code-block-wrap">
        <span class="code-block-label">Example Response</span>
        <pre class="code-block" id="${escapeHtml(resId)}">${escapeHtml(ep.responseExample)}</pre>
        <button class="copy-btn" data-target="${escapeHtml(resId)}" aria-label="Copy response example">Copy</button>
      </div>

    </div>
  </div>
</article>`;
}

/* ============================================================
   RENDER
   ============================================================ */
function renderEndpoints() {
  const list      = document.getElementById("endpoints");
  const emptyState = document.getElementById("empty-state");
  const countEl   = document.getElementById("visible-count");
  const query     = searchQuery.toLowerCase().trim();

  const filtered = ENDPOINTS.filter(ep => {
    const methodMatch = activeMethod === "ALL" || ep.method === activeMethod;
    const searchMatch = !query ||
      ep.path.toLowerCase().includes(query) ||
      ep.description.toLowerCase().includes(query);
    return methodMatch && searchMatch;
  });

  list.innerHTML = filtered.map((ep, i) => buildCard(ep, ENDPOINTS.indexOf(ep))).join("");

  // Update count
  countEl.textContent = String(filtered.length);

  // Show/hide empty state
  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    list.setAttribute("aria-label", "No endpoints found");
  } else {
    emptyState.classList.add("hidden");
    list.setAttribute("aria-label", "API endpoints");
  }
}

/* ============================================================
   TOGGLE CARD
   ============================================================ */
function toggleCard(cardEl) {
  const isOpen = cardEl.classList.contains("open");
  const btn    = cardEl.querySelector(".card-header");

  if (isOpen) {
    cardEl.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  } else {
    cardEl.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }
}

/* ============================================================
   COPY TO CLIPBOARD
   ============================================================ */
function copyCode(btn) {
  const targetId = btn.getAttribute("data-target");
  const pre = document.getElementById(targetId);
  if (!pre) return;

  const text = pre.textContent;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showCopied(btn));
  } else {
    // Fallback for non-secure contexts
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      showCopied(btn);
    } catch (_) {}
    document.body.removeChild(ta);
  }
}

function showCopied(btn) {
  const orig = btn.textContent;
  btn.textContent = "Copied!";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove("copied");
  }, 1800);
}

/* ============================================================
   EVENT DELEGATION
   ============================================================ */
function attachListeners() {
  const list = document.getElementById("endpoints");

  list.addEventListener("click", e => {
    // Copy button
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      e.stopPropagation();
      copyCode(copyBtn);
      return;
    }

    // Card header toggle
    const header = e.target.closest(".card-header");
    if (header) {
      const card = header.closest(".endpoint-card");
      if (card) toggleCard(card);
    }
  });

  // Keyboard support for card headers
  list.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const header = e.target.closest(".card-header");
      if (header) {
        e.preventDefault();
        const card = header.closest(".endpoint-card");
        if (card) toggleCard(card);
      }
    }
  });

  // Method filter buttons
  document.querySelectorAll(".method-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeMethod = btn.getAttribute("data-method");
      document.querySelectorAll(".method-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      renderEndpoints();
    });
  });

  // Search input
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderEndpoints();
  });

  // Reset button (empty state)
  document.getElementById("reset-btn").addEventListener("click", () => {
    searchQuery  = "";
    activeMethod = "ALL";
    searchInput.value = "";
    document.querySelectorAll(".method-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    document.querySelector('.method-btn[data-method="ALL"]').classList.add("active");
    document.querySelector('.method-btn[data-method="ALL"]').setAttribute("aria-pressed", "true");
    renderEndpoints();
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderEndpoints();
  attachListeners();
});
