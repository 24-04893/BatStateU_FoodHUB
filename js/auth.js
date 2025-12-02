//Login and Authentication

// Map stall names to menu objects from global scope
let stallMenuMap = {};

// Initialize menu map from global menu variables
function initializeMenuMap() {
  stallMenuMap = {
    'Theatery': typeof theateryMenu !== 'undefined' ? theateryMenu : {},
    'Spot-G Food Hub': typeof spotgMenu !== 'undefined' ? spotgMenu : {},
    'Little Tokyo Takoyaki': typeof littletokyoMenu !== 'undefined' ? littletokyoMenu : {},
    'RC Beef Shawarma': typeof rcbeefMenu !== 'undefined' ? rcbeefMenu : {},
    'Juice Bar': typeof juicebarMenu !== 'undefined' ? juicebarMenu : {},
    'Chowking': typeof chowkingMenu !== 'undefined' ? chowkingMenu : {},
    'Fried Noodles Haus': typeof friednoodlesMenu !== 'undefined' ? friednoodlesMenu : {},
    'ITSNOK Binalot': typeof itsnokMenu !== 'undefined' ? itsnokMenu : {},
    "Gian's Buko Juice": typeof giansbukoMenu !== 'undefined' ? giansbukoMenu : {},
    "RR Sorella's": typeof rrsorelasMenu !== 'undefined' ? rrsorelasMenu : {},
    'Tender Juicy Hotdogs': typeof tenderjuicyMenu !== 'undefined' ? tenderjuicyMenu : {},
    'Potato Corner': typeof potatocornerMenu !== 'undefined' ? potatocornerMenu : {},
    "Julie's Bakeshop": typeof juliesbakeshopMenu !== 'undefined' ? juliesbakeshopMenu : {},
    'Waffle Time': typeof waffleTimeMenu !== 'undefined' ? waffleTimeMenu : {},
    'Cafe Aromatiko': typeof cafearmatikoMenu !== 'undefined' ? cafearmatikoMenu : {}
  };
}

function showLogin() {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('loginPage').classList.add('active');
}

function showAdminLogin() {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('adminLoginPage').classList.add('active');
}

function showStudentDashboard() {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('studentDashboard').classList.add('active');
  loadStalls();
}

function adminLogin(event) {
  event.preventDefault();
  const stallId = document.getElementById('adminStallSelect').value;
  const password = document.getElementById('adminPassword').value;

  if (!stallId) {
    showNotification('Please select a stall', 'error');
    return;
  }

  if (password === 'admin123') {
    localStorage.setItem('adminAuth', stallId);
    localStorage.setItem('currentStallId', stallId);
    showAdminDashboard();
  } else {
    showNotification('Invalid password. Use "admin123" for demo', 'error');
  }
}

function showAdminDashboard() {
  const stallId = localStorage.getItem('adminAuth');
  if (!stallId) {
    showAdminLogin();
    return;
  }
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('adminDashboard').classList.add('active');
  updateAdminDashboardHeader();
  loadAdminDashboardData();
}

function updateAdminDashboardHeader() {
  const stallId = localStorage.getItem('currentStallId');
  if (stallId) {
    const stall = stalls.find(s => s.id === parseInt(stallId));
    if (stall) {
      const stallNameElement = document.querySelector('#adminStallNameDisplay');
      if (stallNameElement) {
        stallNameElement.textContent = stall.name;
      }
    }
  }
}

function loadAdminDashboardData() {
  const stallId = localStorage.getItem('currentStallId');
  if (stallId) {
    const stall = stalls.find(s => s.id === parseInt(stallId));
    if (stall) {
      // Update stall image display
      const adminImg = document.getElementById('adminCurrentImage');
      if (adminImg) adminImg.src = stall.image || 'public/images/default-menu.png';
      document.getElementById('adminStallName').value = stall.name || '';
      document.getElementById('adminStallDescription').value = stall.description || '';
      const statusInput = document.querySelector(`input[name="stallStatus"][value="${stall.status}"]`);
      if (statusInput) statusInput.checked = true;
      // Populate contact information
      const phoneEl = document.getElementById('adminStallPhone');
      const emailEl = document.getElementById('adminStallEmail');
      const locationEl = document.getElementById('adminStallLocation');
      if (phoneEl) phoneEl.value = stall.phone || '';
      if (emailEl) emailEl.value = stall.email || '';
      if (locationEl) locationEl.value = stall.location || '';
    }
  }
}

function showMenuManagement() {
  const stallId = localStorage.getItem('currentStallId');
  if (!stallId) {
    showNotification('Please login first', 'error');
    return;
  }
  document.getElementById('menuManagementModal').classList.add('active');
  loadMenuManagementData();
}

function closeMenuManagement() {
  document.getElementById('menuManagementModal').classList.remove('active');
}

function loadMenuManagementData() {
  const stallId = parseInt(localStorage.getItem('currentStallId'));
  const stall = stalls.find(s => s.id === stallId);
  if (!stall) return;
  currentMenuItems = generateCurrentMenuItems(stallId);
  renderMenuManagement();
  updateMenuStats();
}

// Resolve menu image path with stall-specific overrides
function getMenuItemImagePath(stallName, index, stallId) {
  const stallMenu = stallMenuMap[stallName];
  if (stallMenu && stallMenu.images && stallMenu.images[index - 1]) {
    return stallMenu.images[index - 1];
  }
  if (stallName === "Julie's Bakeshop") {
    return `public/images/julies_bakeshop/julies_${index}.svg`;
  }
  if (stallName === 'Tender Juicy Hotdogs' && (getMenuItemName(stallName, index) || '').toLowerCase().includes("chick")) {
    return 'public/images/tender juicy/tj-chickncheese.jpg';
  }
  return `public/images/menu${stallId}_${index}.jpg`;
}

function generateCurrentMenuItems(stallId) {
  const stall = stalls.find(s => s.id === stallId);
  const items = [];

  // Use persisted menu state if available, otherwise generate from defaults
  const states = window.menuStates || {};
  const saved = states[String(stallId)];
  if (saved && Array.isArray(saved) && saved.length > 0) {
    return saved.map((it, idx) => ({
      id: it.id !== undefined ? it.id : idx + 1,
      name: it.name || getMenuItemName(stall.name, idx + 1),
      description: it.description || getMenuItemDescription(stall.name, idx + 1),
      price: it.price !== undefined ? it.price : getMenuItemPrice(stall.name, idx + 1),
      available: typeof it.available === 'boolean' ? it.available : true,
      category: it.category || getMenuCategory(stall.name, idx + 1),
      image: it.image || getMenuItemImagePath(stall.name, idx + 1, stallId)
    }));
  }
  // Generate items from stall menus if no saved state
  for (let i = 1; i <= stall.menuCount; i++) {
    items.push({
      id: i,
      name: getMenuItemName(stall.name, i),
      description: getMenuItemDescription(stall.name, i),
      price: getMenuItemPrice(stall.name, i),
      available: true,
      category: getMenuCategory(stall.name, i),
      image: getMenuItemImagePath(stall.name, i, stallId)
    });
  }
  return items;
}

function getMenuItemName(stallName, index) {
  const stallMenu = stallMenuMap[stallName];
  if (stallMenu && stallMenu.names && stallMenu.names[index - 1]) {
    return stallMenu.names[index - 1];
  }
  return `${stallName} Item ${index}`;
}

function getMenuItemDescription(stallName, index) {
  const stallMenu = stallMenuMap[stallName];
  if (stallMenu && stallMenu.descriptions && stallMenu.descriptions[index - 1]) {
    return stallMenu.descriptions[index - 1];
  }
  return 'Delicious menu item';
}

function getMenuItemPrice(stallName, index) {
  const stallMenu = stallMenuMap[stallName];
  if (stallMenu && stallMenu.prices && stallMenu.prices[index - 1] !== undefined) {
    return stallMenu.prices[index - 1];
  }
  return 50;
}

function getMenuCategory(stallName, index) {
  const stallMenu = stallMenuMap[stallName];
  if (stallMenu && stallMenu.categories) {
    // Support both string (single category) and array (per-item category)
    if (typeof stallMenu.categories === 'string') {
      return stallMenu.categories;
    }
    if (Array.isArray(stallMenu.categories) && stallMenu.categories[index - 1]) {
      return stallMenu.categories[index - 1];
    }
  }
  return 'Main Dish';
}

function getMenuItemImageQuery(stallName, index) {
  const queries = {
    'Theatery': 'premium coffee latte art professional beverage photography',
    'Spot-G Food Hub': 'Filipino food dishes adobo steak fried chicken professional food photography',
    'Little Tokyo Takoyaki': 'authentic Japanese takoyaki street food traditional',
    'RC Beef Shawarma': 'beef shawarma seasoned meat pita wraps middle eastern street food',
    'Juice Bar': 'blue lemonade cucumber melon black gulaman red tea refreshing drinks',
    'Chowking': 'Filipino Chinese cuisine chao fan wonton noodles',
    'Fried Noodles Haus': 'asian noodles stir fry wok cooking',
    'ITSNOK Binalot': 'Filipino rice meal adobo binalot traditional',
    "Gian's Buko Juice": 'fresh coconut buko juice tropical beverage',
    "RR Sorella's": 'homemade pizza cheesy garlic pepperoni buffalo hawaiian gourmet pizza',
    'Tender Juicy Hotdogs': 'gourmet hotdog sausage grilled meat fast food',
    'Potato Corner': 'crispy french fries seasoned potatoes fast food',
    "Julie's Bakeshop": 'Filipino bakery bread pastries baked goods fresh',
    'Waffle Time': 'sweet waffles belgian waffle toppings dessert breakfast street food',
    'Cafe Aromatiko': 'premium coffee cafe gourmet food elegant setting'
  };
  return queries[stallName] || 'delicious restaurant food item professional food photography';
}

let currentMenuItems = [];

function renderMenuManagement() {
  const container = document.getElementById('menuItemsContainer');
  container.innerHTML = '';
  currentMenuItems.forEach((item, index) => {
    const menuCard = document.createElement('div');
    menuCard.className = 'bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary transition-colors';
    menuCard.innerHTML = `
      <div class="flex items-start space-x-6">
        <div class="relative">
          <div class="relative group cursor-pointer" onclick="changeMenuItemImage(${index})">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-16 rounded-lg object-cover object-top">
            <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <i class="ri-image-edit-line text-white ri-lg"></i>
            </div>
          </div>
          <div class="absolute -top-2 -right-2">
            <button onclick="removeMenuItem(${index})" class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <div class="w-4 h-4 flex items-center justify-center">
                <i class="ri-close-line text-xs"></i>
              </div>
            </button>
          </div>
        </div>
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input type="text" value="${item.name}" onchange="updateMenuItem(${index}, 'name', this.value)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            </div>
            <!-- Category selection removed from admin dashboard -->
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
              <input type="number" value="${item.price}" min="1" max="9999" onchange="updateMenuItem(${index}, 'price', parseInt(this.value))" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="flex space-x-2">
                <button type="button" onclick="updateMenuItem(${index}, 'available', true)" class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${item.available ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                  Available
                </button>
                <button type="button" onclick="updateMenuItem(${index}, 'available', false)" class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!item.available ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                  Sold Out
                </button>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows="4" value="${item.description}" onchange="updateMenuItem(${index}, 'description', this.value)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none">${item.description}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(menuCard);
  });
}

function updateMenuItem(index, field, value) {
  currentMenuItems[index][field] = value;
  updateMenuStats();
  
  if (field === 'available') {
    renderMenuManagement();
  }
}

function removeMenuItem(index) {
  showDeleteConfirmation(index);
}

function addNewMenuItem() {
  showAddMenuItemModal();
}

function showAddMenuItemModal() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'addMenuItemModal';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="header-gradient text-white p-6 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">Add New Menu Item</h2>
          <button onclick="closeAddMenuItemModal()" class="text-white hover:text-gray-200 transition-colors">
            <div class="w-6 h-6 flex items-center justify-center">
              <i class="ri-close-line ri-lg"></i>
            </div>
          </button>
        </div>
      </div>
      <div class="p-6">
        <form id="addMenuItemForm" class="space-y-6">
          <div class="text-center">
            <div class="relative inline-block">
              <div id="newItemImagePreview" class="w-32 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors" onclick="selectNewItemImage()">
                <div class="text-center">
                  <i class="ri-image-add-line text-gray-400 ri-2x mb-2"></i>
                  <p class="text-sm text-gray-500">Upload Image</p>
                </div>
              </div>
              <input type="file" id="newItemImageInput" accept="image/*" class="hidden" onchange="previewNewItemImage(event)">
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input type="text" id="newItemName" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter item name" required>
            </div>
            <!-- Category selection removed from add new menu item modal -->
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
              <input type="number" id="newItemPrice" min="1" max="9999" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="0" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="flex space-x-2">
                <button type="button" id="newItemAvailable" onclick="setNewItemStatus(true)" class="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-green-500 text-white">
                  Available
                </button>
                <button type="button" id="newItemSoldOut" onclick="setNewItemStatus(false)" class="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Sold Out
                </button>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea id="newItemDescription" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none" placeholder="Describe your menu item..." required></textarea>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" onclick="closeAddMenuItemModal()" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
              Cancel
            </button>
            <button type="submit" class="header-gradient text-white px-6 py-3 !rounded-button font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
              Add Menu Item
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

let newItemStatus = true;
let newItemImageSrc = '';

function setNewItemStatus(available) {
  newItemStatus = available;
  const availableBtn = document.getElementById('newItemAvailable');
  const soldOutBtn = document.getElementById('newItemSoldOut');
  if (available) {
    availableBtn.className = 'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-green-500 text-white';
    soldOutBtn.className = 'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300';
  } else {
    availableBtn.className = 'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300';
    soldOutBtn.className = 'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-red-500 text-white';
  }
}

function selectNewItemImage() {
  document.getElementById('newItemImageInput').click();
}

function previewNewItemImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      newItemImageSrc = e.target.result;
      const preview = document.getElementById('newItemImagePreview');
      preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-lg">`;
    };
    reader.readAsDataURL(file);
  }
}

function closeAddMenuItemModal() {
  const modal = document.getElementById('addMenuItemModal');
  if (modal) {
    document.body.removeChild(modal);
    newItemImageSrc = '';
    newItemStatus = true;
  }
}

function updateMenuStats() {
  const totalItems = currentMenuItems.length;
  const availableItems = currentMenuItems.filter(item => item.available).length;
  const soldOutItems = totalItems - availableItems;
  const avgPrice = totalItems > 0 ? Math.round(currentMenuItems.reduce((sum, item) => sum + item.price, 0) / totalItems) : 0;
  document.getElementById('totalMenuItems').textContent = totalItems;
  document.getElementById('availableMenuItems').textContent = availableItems;
  document.getElementById('soldOutMenuItems').textContent = soldOutItems;
  document.getElementById('avgMenuPrice').textContent = avgPrice;
}

function toggleMenuVisibility() {
  const toggle = document.getElementById('menuVisibilityToggle');
  const isChecked = toggle.checked;
  toggle.checked = !isChecked;
  const toggleBg = toggle.nextElementSibling;
  const toggleDot = toggleBg.nextElementSibling;
  if (!isChecked) {
    toggleBg.classList.remove('bg-primary');
    toggleBg.classList.add('bg-gray-300');
    toggleDot.style.transform = 'translateX(-16px)';
  } else {
    toggleBg.classList.remove('bg-gray-300');
    toggleBg.classList.add('bg-primary');
    toggleDot.style.transform = 'translateX(0)';
  }
}

function saveMenuChanges() {
  const stallId = parseInt(localStorage.getItem('currentStallId'));
  const stall = stalls.find(s => s.id === stallId);
  if (stall) {
    stall.menuCount = currentMenuItems.length;
  }
  // Save menu state to backend for persistent changes
  fetch(`/api/menu-states/${stallId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentMenuItems)
  }).then(res => {
    if (!res.ok) {
      return res.json().then(data => {
        throw new Error(data.error || `Server error: ${res.status}`);
      }).catch(e => {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      });
    }
    return res.json();
  }).then(() => {
    // Update local cache to reflect changes immediately
    window.menuStates = window.menuStates || {};
    window.menuStates[String(stallId)] = currentMenuItems;
    showNotification('Menu changes saved successfully!', 'success');
    setTimeout(() => {
      closeMenuManagement();
    }, 800);
    if (typeof loadStalls === 'function') loadStalls();
  }).catch(err => {
    console.error('Save error:', err);
    showNotification(`Failed to save menu changes: ${err.message}`, 'error');
  });
}

function changeMenuItemImage(index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        currentMenuItems[index].image = event.target.result;
        renderMenuManagement();
        showNotification('Image updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function changeItemImage(index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        currentMenuItems[index].image = event.target.result;
        renderMenuManagement();
        showNotification('Image updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function renderFilteredMenuItems(filteredItems) {
  const container = document.getElementById('menuItemsContainer');
  container.innerHTML = '';
  filteredItems.forEach((item, originalIndex) => {
    const index = currentMenuItems.findIndex(menuItem => menuItem.id === item.id);
    const menuCard = document.createElement('div');
    menuCard.className = 'bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary transition-colors';
    menuCard.innerHTML = `
      <div class="flex items-start space-x-6">
        <div class="relative">
          <div class="relative group cursor-pointer" onclick="changeMenuItemImage(${index})">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-16 rounded-lg object-cover object-top">
            <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <i class="ri-image-edit-line text-white ri-lg"></i>
            </div>
          </div>
          <div class="absolute -top-2 -right-2">
            <button onclick="removeMenuItem(${index})" class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <div class="w-4 h-4 flex items-center justify-center">
                <i class="ri-close-line text-xs"></i>
              </div>
            </button>
          </div>
        </div>
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input type="text" value="${item.name}" onchange="updateMenuItem(${index}, 'name', this.value)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select onchange="updateMenuItem(${index}, 'category', this.value)" class="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option value="Main Dish" ${item.category === 'Main Dish' ? 'selected' : ''}>Main Dish</option>
                <option value="Beverage" ${item.category === 'Beverage' ? 'selected' : ''}>Beverage</option>
                <option value="Snack" ${item.category === 'Snack' ? 'selected' : ''}>Snack</option>
                <option value="Dessert" ${item.category === 'Dessert' ? 'selected' : ''}>Dessert</option>
                <option value="Appetizer" ${item.category === 'Appetizer' ? 'selected' : ''}>Appetizer</option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
              <input type="number" value="${item.price}" min="1" max="9999" onchange="updateMenuItem(${index}, 'price', parseInt(this.value))" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="flex space-x-2">
                <button type="button" onclick="updateMenuItem(${index}, 'available', true)" class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${item.available ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                  Available
                </button>
                <button type="button" onclick="updateMenuItem(${index}, 'available', false)" class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!item.available ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                  Sold Out
                </button>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows="4" value="${item.description}" onchange="updateMenuItem(${index}, 'description', this.value)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none">${item.description}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(menuCard);
  });
}

function uploadStallImage() {
  showNotification('Image upload feature will be available soon!', 'info');
}

function saveAllChanges() {
  const stallId = localStorage.getItem('currentStallId');
  if (stallId) {
    const stall = stalls.find(s => s.id === parseInt(stallId));
    if (stall) {
      stall.name = document.getElementById('adminStallName').value;
      stall.description = document.getElementById('adminStallDescription').value;
      stall.status = document.querySelector('input[name="stallStatus"]:checked').value;
    }
  }
  showNotification('All changes saved successfully!', 'success');
  updateStallCounts();
}

function logout() {
  localStorage.removeItem('adminAuth');
  showLogin();
}

// Initialize menu search and add menu item form
document.addEventListener('DOMContentLoaded', function() {
  const menuSearchInput = document.getElementById('menuSearchInput');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const filteredItems = currentMenuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
      renderFilteredMenuItems(filteredItems);
    });
  }
  
  // Handle menu item form submission
  document.addEventListener('submit', function(e) {
    if (e.target.id === 'addMenuItemForm') {
      e.preventDefault();
      const name = document.getElementById('newItemName').value;
      const category = document.getElementById('newItemCategory').value;
      const price = parseInt(document.getElementById('newItemPrice').value);
      const description = document.getElementById('newItemDescription').value;

      if (!name || !price || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      const stallId = parseInt(localStorage.getItem('currentStallId'));
      const defaultImage = 'public/images/default-menu.png';
      const newItem = {
        id: Date.now(),
        name: name,
        description: description,
        price: price,
        available: newItemStatus,
        category: category,
        image: newItemImageSrc || defaultImage
      };
      
      currentMenuItems.push(newItem);
      renderMenuManagement();
      updateMenuStats();
      closeAddMenuItemModal();
      showNotification('Menu item added successfully!', 'success');
    }
  });
});

// Export functions to global scope for onclick handlers
// About Modal Functions
function showAbout() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAbout() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside content
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeAbout();
      }
    });
  }
});

window.showAbout = showAbout;
window.closeAbout = closeAbout;
window.showLogin = showLogin;
window.showAdminLogin = showAdminLogin;
window.showStudentDashboard = showStudentDashboard;
window.showAdminDashboard = showAdminDashboard;
window.adminLogin = adminLogin;
window.logout = logout;
window.getMenuItemName = getMenuItemName;
window.getMenuItemDescription = getMenuItemDescription;
window.getMenuItemPrice = getMenuItemPrice;
window.getMenuCategory = getMenuCategory;
window.getMenuItemImagePath = getMenuItemImagePath;
window.generateCurrentMenuItems = generateCurrentMenuItems;
window.initializeMenuMap = initializeMenuMap;
