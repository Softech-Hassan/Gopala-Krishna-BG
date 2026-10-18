const sections = [
  {
    id: "A",
    title: "Section A",
    items: [
      { id: "AA", title: "Description about AA", description: "This is the description for section AA. Replace this sample text with your own content." },
      { id: "AB", title: "Description about AB", description: "This is the description for section AB. Add information, links, or instructions relevant to this topic." },
      { id: "AC", title: "Description about AC", description: "This is the description for section AC. Keep your content clear and easy to scan." }
    ]
  },
  {
    id: "B",
    title: "Section B",
    items: [
      { id: "BA", title: "Description about BA", description: "This is the description for section BA. Replace this sample text with your own content." },
      { id: "BB", title: "Description about BB", description: "This is the description for section BB. Add information, links, or instructions relevant to this topic." },
      { id: "BC", title: "Description about BC", description: "This is the description for section BC. Keep your content clear and easy to scan." }
    ]
  },
  {
    id: "C",
    title: "Section C",
    items: [
      { id: "CA", title: "Description about CA", description: "This is the description for section CA." },
      { id: "CB", title: "Description about CB", description: "This is the description for section CB." },
      { id: "CC", title: "Description about CC", description: "This is the description for section CC." }
    ]
  },
  {
    id: "D",
    title: "Section D",
    items: [
      { id: "DA", title: "Description about DA", description: "This is the description for section DA." },
      { id: "DB", title: "Description about DB", description: "This is the description for section DB." },
      { id: "DC", title: "Description about DC", description: "This is the description for section DC." }
    ]
  },
  {
    id: "E",
    title: "Section E",
    items: [
      { id: "EA", title: "Description about EA", description: "This is the description for section EA." },
      { id: "EB", title: "Description about EB", description: "This is the description for section EB." },
      { id: "EC", title: "Description about EC", description: "This is the description for section EC." }
    ]
  }
];

let activeSection = "A";
let activeItem = null;
let searchTerm = "";

const sideNav = document.querySelector("#sideNav");
const topTabs = document.querySelector("#topTabs");
const contentList = document.querySelector("#contentList");
const pageTitle = document.querySelector("#pageTitle");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const emptyState = document.querySelector("#emptyState");
const resetSearch = document.querySelector("#resetSearch");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function getActiveSection() {
  return sections.find(section => section.id === activeSection) || sections[0];
}

function renderNavigation() {
  sideNav.innerHTML = sections.map(section => {
    const isActive = section.id === activeSection;
    const showChildren = isActive;
    const matchingItems = section.items.filter(item => matchesSearch(item, section));
    const visibleChildren = searchTerm ? matchingItems : section.items;

    return `
      <div class="nav-group">
        <button class="nav-button ${isActive ? "active" : ""}"
          type="button" data-section="${section.id}"
          aria-expanded="${showChildren}" aria-current="${isActive ? "page" : "false"}">
          <span class="nav-letter">${section.id}</span>
          <span>${escapeHTML(section.title)}</span>
        </button>
        ${showChildren ? `
          <div class="subnav">
            ${visibleChildren.map(item => `
              <button class="subnav-button ${activeItem === item.id ? "active" : ""}"
                type="button" data-item="${item.id}">
                ${item.id}
              </button>
            `).join("")}
          </div>` : ""}
      </div>`;
  }).join("");

  topTabs.innerHTML = sections.map(section => `
    <button class="tab-button ${section.id === activeSection ? "active" : ""}"
      type="button" data-section="${section.id}"
      aria-pressed="${section.id === activeSection}">
      ${section.id}
    </button>
  `).join("");
}

function matchesSearch(item, section) {
  if (!searchTerm) return true;
  const haystack = `${section.id} ${section.title} ${item.id} ${item.title} ${item.description}`.toLowerCase();
  return haystack.includes(searchTerm);
}

function renderContent() {
  const section = getActiveSection();
  const visibleItems = section.items.filter(item => matchesSearch(item, section));
  const filteredItems = activeItem
    ? visibleItems.filter(item => item.id === activeItem)
    : visibleItems;

  pageTitle.textContent = section.title;
  resultCount.textContent = `${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"}`;
  contentList.innerHTML = filteredItems.map(item => `
    <article class="content-card" id="content-${item.id}">
      <div class="content-badge">${item.id}</div>
      <div>
        <h2>${escapeHTML(item.title)}</h2>
        <p>${escapeHTML(item.description)}</p>
        <span class="detail-line" aria-hidden="true"></span>
        <p>Section code: ${item.id} · Category: ${section.id}</p>
      </div>
    </article>
  `).join("");

  const hasResults = filteredItems.length > 0;
  emptyState.hidden = hasResults;
  contentList.hidden = !hasResults;
}

function render() {
  renderNavigation();
  renderContent();
  clearSearch.hidden = !searchInput.value;
}

function selectSection(sectionId) {
  if (!sections.some(section => section.id === sectionId)) return;
  activeSection = sectionId;
  activeItem = null;
  render();
}

function selectItem(itemId) {
  const section = getActiveSection();
  if (!section.items.some(item => item.id === itemId)) return;
  activeItem = activeItem === itemId ? null : itemId;
  render();
}

sideNav.addEventListener("click", event => {
  const sectionButton = event.target.closest("[data-section]");
  const itemButton = event.target.closest("[data-item]");
  if (itemButton) {
    selectItem(itemButton.dataset.item);
  } else if (sectionButton) {
    selectSection(sectionButton.dataset.section);
  }
});

topTabs.addEventListener("click", event => {
  const tab = event.target.closest("[data-section]");
  if (tab) selectSection(tab.dataset.section);
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  activeItem = null;
  render();
});

function resetSearchField() {
  searchInput.value = "";
  searchTerm = "";
  activeItem = null;
  render();
  searchInput.focus();
}
clearSearch.addEventListener("click", resetSearchField);
resetSearch.addEventListener("click", resetSearchField);

document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    resetSearchField();
  }
});

render();
