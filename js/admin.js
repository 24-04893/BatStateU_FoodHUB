// Admin dashboard tab management
function showAdminTab(tab) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.add('hidden'));
  if (tab === 'stalls') {
    document.getElementById('stallsTab').classList.add('active');
    document.getElementById('stallManagement').classList.remove('hidden');
    loadAdminStalls();
  } else {
    document.getElementById('seatingTab').classList.add('active');
    document.getElementById('seatingManagement').classList.remove('hidden');
    loadAdminSeating();
  }
}

function loadAdminData() {
  loadAdminStalls();
  loadAdminSeating();
}

function loadAdminStalls() {
  const tbody = document.getElementById('adminStallsList');
  const currentStallId = parseInt(localStorage.getItem('currentStallId'));
  tbody.innerHTML = '';
  const currentStall = stalls.find(s => s.id === currentStallId);
  // Update current stall image in dashboard
  const adminImg = document.getElementById('adminCurrentImage');
  if (adminImg) adminImg.src = currentStall ? (currentStall.image || 'public/images/default-menu.png') : 'public/images/default-menu.png';
  if (currentStall) {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50';
    row.innerHTML = `
      <td class="py-3 px-4">
        <div class="flex items-center space-x-3">
          <img src="${currentStall.image}" alt="${currentStall.name}" class="w-10 h-10 rounded-lg object-cover object-top">
          <span class="font-medium text-gray-900">${currentStall.name}</span>
          <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Your Stall</span>
        </div>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-1 rounded-full text-xs font-medium ${currentStall.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
          ${currentStall.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </td>
      <td class="py-3 px-4 text-gray-600">${currentStall.menuCount}</td>
      <td class="py-3 px-4">
        <div class="flex items-center space-x-1">
          <div class="flex text-yellow-400 text-sm">
            ${Array(5).fill().map((_, i) =>
              `<i class="ri-star-${i < Math.floor(currentStall.rating) ? 'fill' : 'line'}"></i>`
            ).join('')}
          </div>
          <span class="text-sm text-gray-600">${currentStall.rating}</span>
        </div>
      </td>
      <td class="py-3 px-4">
        <div class="flex items-center space-x-2">
          <button onclick="toggleStallStatus(${currentStall.id})" class="text-sm px-3 py-1 rounded-md ${currentStall.status === 'open' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors whitespace-nowrap">
            ${currentStall.status === 'open' ? 'Close' : 'Open'}
          </button>
          <button onclick="editStall(${currentStall.id})" class="text-gray-400 hover:text-primary transition-colors">
            <div class="w-5 h-5 flex items-center justify-center">
              <i class="ri-edit-line"></i>
            </div>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  }
}

function loadAdminSeating() {
  const generalAvailable = generalSeating.filter(seat => !seat.occupied).length;
  const generalOccupied = generalSeating.filter(seat => seat.occupied).length;
  const privateAvailable = privateSeating.filter(seat => !seat.occupied).length;
  const privateOccupied = privateSeating.filter(seat => seat.occupied).length;
  document.getElementById('adminGeneralAvailable').textContent = generalAvailable;
  document.getElementById('adminGeneralOccupied').textContent = generalOccupied;
  document.getElementById('adminPrivateAvailable').textContent = privateAvailable;
  document.getElementById('adminPrivateOccupied').textContent = privateOccupied;
}

function toggleStallStatus(stallId) {
  const stall = stalls.find(s => s.id === stallId);
  stall.status = stall.status === 'open' ? 'closed' : 'open';
  loadAdminStalls();
  updateStallCounts();
}

function editStall(stallId) {
  currentEditingStall = stallId;
  const stall = stalls.find(s => s.id === stallId);
  if (!stall) return;
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('stallEditPage').classList.add('active');
  loadStallEditData(stall);
}

function showEditTab(tab) {
  document.querySelectorAll('.edit-tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.edit-tab-content').forEach(content => content.classList.add('hidden'));
  if (tab === 'basic') {
    document.getElementById('basicTab').classList.add('active');
    document.getElementById('basicInfoTab').classList.remove('hidden');
  } else if (tab === 'menu') {
    document.getElementById('menuTab').classList.add('active');
    document.getElementById('menuManagementTab').classList.remove('hidden');
    loadMenuItems();
  } else if (tab === 'hours') {
    document.getElementById('hoursTab').classList.add('active');
    document.getElementById('operatingHoursTab').classList.remove('hidden');
  } else if (tab === 'settings') {
    document.getElementById('settingsTab').classList.add('active');
    document.getElementById('settingsTab').classList.remove('hidden');
  }
}

function loadStallEditData(stall) {
  document.getElementById('editStallName').value = stall.name;
  document.getElementById('editStallDescription').value = stall.description;
  document.getElementById('editStallPhone').value = stall.phone || '';
  document.getElementById('editStallLocation').value = stall.location || '';
  setStallStatus(stall.status);
  // Update stall image in edit view
  const adminImg = document.getElementById('adminCurrentImage');
  if (adminImg) adminImg.src = stall.image || 'public/images/default-menu.png';
}

function setStallStatus(status) {
  document.querySelectorAll('.status-button').forEach(btn => btn.classList.remove('active'));
  if (status === 'open') {
    document.getElementById('statusOpen').classList.add('active');
  } else {
    document.getElementById('statusClosed').classList.add('active');
  }
}

let menuItems = [];
let currentEditingStall = null;

function loadMenuItems() {
  if (!currentEditingStall) return;
  // Use generator that respects persisted menu states
  if (typeof generateCurrentMenuItems === 'function') {
    menuItems = generateCurrentMenuItems(currentEditingStall);
  } else {
    menuItems = generateMenuItems(currentEditingStall);
  }
  renderMenuItemsList();
}

function renderMenuItemsList() {
  const container = document.getElementById('menuItemsList');
  container.innerHTML = '';
  menuItems.forEach((item, index) => {
    const menuCard = document.createElement('div');
    menuCard.className = 'menu-item-card bg-gray-50 rounded-lg p-4 border-2 border-transparent hover:border-primary transition-colors';
    menuCard.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover object-top">
        <div class="flex-1">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
              <input type="text" value="${item.name}" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Price</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500 text-sm">₱</span>
                <input type="number" value="${item.price}" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <div class="flex space-x-1 bg-gray-100 p-1 rounded-md">
                <button type="button" class="flex-1 px-2 py-1 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${item.available ? 'bg-green-500 text-white' : 'text-gray-600'}">
                  Available
                </button>
                <button type="button" class="flex-1 px-2 py-1 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${!item.available ? 'bg-red-500 text-white' : 'text-gray-600'}">
                  Sold Out
                </button>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none">${item.description}</textarea>
          </div>
        </div>
        <button onclick="removeMenuItem(${index})" class="text-red-500 hover:text-red-700 transition-colors">
          <div class="w-6 h-6 flex items-center justify-center">
            <i class="ri-delete-bin-line"></i>
          </div>
        </button>
      </div>
    `;
    container.appendChild(menuCard);
  });
}

function addMenuItem() {
  const newItem = {
    id: Date.now(),
    name: 'New Menu Item',
    description: 'Delicious new item from our kitchen',
    price: '50',
    available: true,
    image: 'public/images/default-menu.png'
  };
  menuItems.push(newItem);
  renderMenuItemsList();
}

function removeMenuItem(index) {
  showDeleteConfirmation(index);
}

function showDeleteConfirmation(index) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'deleteConfirmationModal';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
      <div class="p-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class="ri-delete-bin-line text-red-500 ri-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Delete Menu Item</h3>
            <p class="text-gray-600">Are you sure you want to delete this menu item?</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button onclick="closeDeleteConfirmation()" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            Cancel
          </button>
          <button onclick="confirmDeleteMenuItem(${index})" class="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap">
            Delete
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeDeleteConfirmation() {
  const modal = document.getElementById('deleteConfirmationModal');
  if (modal) {
    document.body.removeChild(modal);
  }
}

function confirmDeleteMenuItem(index) {
  currentMenuItems.splice(index, 1);
  renderMenuManagement();
  updateMenuStats();
  closeDeleteConfirmation();
  showNotification('Menu item deleted successfully!', 'success');
}

function saveStallChanges() {
  if (!currentEditingStall) return;
  const stall = stalls.find(s => s.id === currentEditingStall);
  if (!stall) return;
  stall.name = document.getElementById('editStallName').value;
  stall.description = document.getElementById('editStallDescription').value;
  stall.status = document.getElementById('statusOpen').classList.contains('active') ? 'open' : 'closed';
  showNotification('Stall information updated successfully!', 'success');
  setTimeout(() => {
    showAdminDashboard();
  }, 1500);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  let bgClass = 'bg-red-500 text-white';
  let iconClass = 'error-warning';
  if (type === 'success') {
    bgClass = 'bg-green-500 text-white';
    iconClass = 'check';
  } else if (type === 'info') {
    bgClass = 'bg-blue-500 text-white';
    iconClass = 'information';
  }
  notification.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${bgClass}`;
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="w-6 h-6 flex items-center justify-center">
        <i class="ri-${iconClass}-line"></i>
      </div>
      <span class="font-medium">${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.remove('translate-x-full'), 100);
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

// Export functions to global scope
window.showAdminTab = showAdminTab;
window.loadAdminData = loadAdminData;
window.loadAdminDashboardData = loadAdminDashboardData;
window.showEditTab = showEditTab;
window.setStallStatus = setStallStatus;
window.editStall = editStall;
window.toggleStallStatus = toggleStallStatus;
window.loadMenuItems = loadMenuItems;
window.showMenuManagement = showMenuManagement;
window.closeMenuManagement = closeMenuManagement;
window.addMenuItem = addMenuItem;
window.removeMenuItem = removeMenuItem;
window.showDeleteConfirmation = showDeleteConfirmation;
window.closeDeleteConfirmation = closeDeleteConfirmation;
window.confirmDeleteMenuItem = confirmDeleteMenuItem;
window.updateMenuItem = updateMenuItem;
window.changeMenuItemImage = changeMenuItemImage;
window.saveAllChanges = saveAllChanges;
window.uploadStallImage = uploadStallImage;
window.updateAdminDashboardHeader = updateAdminDashboardHeader;
window.showNotification = showNotification;

