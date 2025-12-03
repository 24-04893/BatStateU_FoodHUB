// Stall data and listing functions

const stalls = [
  { id: 1, name: 'Cafe Aromatiko', menuCount: 48, description: 'Offers frappes, coffee, and milk tea', status: 'open', rating: 4.8, phone: '0910-000-0002', email: 'aromatiko@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/Cafearomatiko/cafearomatikologo.jpg' },
  { id: 2, name: 'Chowking', menuCount: 4, description: 'Filipino-Chinese fast-food meals', status: 'open', rating: 4.2, phone: '0910-000-0003', email: 'chowking@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/chowking/chowking logo.jpg' },
  { id: 3, name: 'Fried Noodles Haus', menuCount: 8, description: 'Specializes in fried noodles', status: 'open', rating: 4.1, phone: '0910-000-0004', email: 'friednoodles@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/friednoodles/friednoodleslogo.jpg' },
  { id: 4, name: "Gian's Buko Juice", menuCount: 4, description: 'Fresh buko juice and shakes', status: 'open', rating: 4.4, phone: '0910-000-0005', email: 'gianbuko@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/gianbukojuice/giansbukojuicelogo.jpg' },
  { id: 5, name: 'ITSNOK Binalot', menuCount: 6, description: 'Traditional wrapped rice meals', status: 'open', rating: 4.0, phone: '0910-000-0006', email: 'itsnok@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/ITSNOKBinalot/itsnoklogo.png' },
  { id: 6, name: 'Juice Bar', menuCount: 10, description: 'Juices and palamig drinks', status: 'open', rating: 4.3, phone: '0910-000-0007', email: 'juicebar@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/juicebar/juicebarlogo.png' },
  { id: 7, name: "Julie's Bakeshop", menuCount: 8, description: 'Fresh breads and pastries', status: 'open', rating: 4.2, phone: '0910-000-0008', email: 'julies@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/JuliesBakeshop/Julies Logo.jpg' },
  { id: 8, name: 'Little Tokyo Takoyaki', menuCount: 8, description: 'Japanese-style takoyaki', status: 'open', rating: 4.5, phone: '0910-000-0009', email: 'littletokyo@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/littletakoyako/LITTTLE TAKOYAKI LOGO.jpg' },
  { id: 9, name: 'Potato Corner', menuCount: 12, description: 'Flavored fries and snacks', status: 'open', rating: 4.0, phone: '0910-000-0010', email: 'potatocorner@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/potatocorner/potato corner logo.png' },
  { id: 10, name: 'RC Beef Shawarma', menuCount: 4, description: 'Shawarma rice and pita wraps', status: 'open', rating: 4.1, phone: '0910-000-0011', email: 'rcshawarma@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/rcbeefshawarma/rcbeefshawarmalogo.png' },
  { id: 11, name: "RR Sorella's", menuCount: 30, description: 'Pizza and Italian snacks', status: 'open', rating: 4.6, phone: '0910-000-0012', email: 'rrsorellas@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/RR Sorellas Homemade/RR SORELLAS HOMEMADE LOGO.jpg' },
  { id: 12, name: 'Spot-G Food Hub', menuCount: 24, description: 'Simple lutong-bahay meals.', status: 'open', rating: 4.0, phone: '0910-000-0013', email: 'spotg@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/spotg/spotglogo.png' },
  { id: 13, name: 'Tender Juicy Hotdogs', menuCount: 12, description: 'Hotdog sandwiches', status: 'open', rating: 4.1, phone: '0910-000-0014', email: 'tenderjuicy@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/tender juicy hotdogs/TENDER_JUICY_HOTDOG_logo.jpg'},
  { id: 14, name: 'Theatery', menuCount: 24, description: 'Filipino lutong-bahay meals', status: 'open', rating: 4.4, phone: '0910-000-0015', email: 'theatery@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/theatery/carinderia.jpg' },
  { id: 15, name: 'Waffle Time', menuCount: 11, description: 'Freshly cooked waffles', status: 'open', rating: 4.3, phone: '0910-000-0016', email: 'waffletime@foodhub.local', location: 'Located at Ground Floor, Albert Einstein Building', image: 'public/images/WaffleTime/waffle time logo.png' }
];

let showOpenOnly = false;
let searchTerm = '';

function getFilteredStalls() {
  const term = searchTerm.trim().toLowerCase();
  let list = showOpenOnly ? stalls.filter(s => s.status === 'open') : stalls.slice();
  if (term.length > 0) {
    list = list.filter(s => {
      // match stall name or description first
      if (s.name.toLowerCase().includes(term) || (s.description || '').toLowerCase().includes(term)) return true;

      // best-effort: try to find a matching menu variable for this stall and search its items
      function resolveMenuVar(stall) {
        const candidates = [];
        // candidate from stall name (remove non-alphanumerics)
        const nameSlug = (stall.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (nameSlug) candidates.push(nameSlug + 'Menu');

        // candidate from image folder name if available
        try {
          const parts = (stall.image || '').split('/');
          const idx = parts.indexOf('images');
          if (idx >= 0 && parts.length > idx + 1) {
            const folder = parts[idx + 1] || '';
            const folderSlug = folder.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (folderSlug) candidates.push(folderSlug + 'Menu');
          }
        } catch (e) {}

        // also try a few variations (drop repeated letters issues)
        if (nameSlug.includes('sorellas')) {
          candidates.push(nameSlug.replace('sorellas', 'sorelas') + 'Menu');
        }

        for (const v of candidates) {
          try {
            // try globalThis first
            if (typeof globalThis !== 'undefined' && globalThis[v]) return globalThis[v];
            // fallback to eval if available
            try {
              const val = eval(v);
              if (val) return val;
            } catch (e) {}
          } catch (e) {}
        }
        return null;
      }

      const menuObj = resolveMenuVar(s);
      if (menuObj) {
        // check names and descriptions arrays
        const names = Array.isArray(menuObj.names) ? menuObj.names : [];
        const descs = Array.isArray(menuObj.descriptions) ? menuObj.descriptions : [];
        for (const n of names) {
          if ((n || '').toLowerCase().includes(term)) return true;
        }
        for (const d of descs) {
          if ((d || '').toLowerCase().includes(term)) return true;
        }
      }

      return false;
    });
  }
  return list;
}

function loadStalls() {
  const grid = document.getElementById('stallsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  const list = getFilteredStalls();

  list.forEach(stall => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-pointer';
    card.innerHTML = `
      <div class="flex flex-col h-full" onclick="showStallDetail(${stall.id})">
        <div class="h-40 w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img src="${stall.image}" alt="${stall.name}" class="w-full h-full object-cover object-center">
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900">${stall.name}</h3>
          <p class="text-sm text-gray-600 truncate">${stall.description}</p>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-sm text-gray-700">${stall.menuCount} items</span>
          <span class="px-3 py-1 rounded-full text-xs font-medium ${stall.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${stall.status === 'open' ? 'Open' : 'Closed'}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  updateStallCounts();
}

function toggleOpenOnly() {
  showOpenOnly = !showOpenOnly;
  loadStalls();
}

function updateStallCounts() {
  const openCountEl = document.getElementById('openStallsCount');
  if (openCountEl) {
    const openCount = stalls.filter(s => s.status === 'open').length;
    openCountEl.textContent = openCount;
  }
  // If there is an element with id totalStallsCount, update it
  const totalEl = document.getElementById('totalStallsCount');
  if (totalEl) totalEl.textContent = stalls.length;
}

// Initialize on load if the page is already present
document.addEventListener('DOMContentLoaded', () => {
  // Attach search handler if search input exists
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchTerm = e.target.value || '';
      loadStalls();
    });
  }

  loadStalls();
});

// Export functions to global scope
window.loadStalls = loadStalls;
window.toggleOpenOnly = toggleOpenOnly;
window.stalls = stalls;
