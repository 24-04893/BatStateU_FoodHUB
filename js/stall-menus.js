// Stall detail page and menu display

function showStallDetail(stallId) {
  const stall = stalls.find(s => s.id === stallId);
  if (!stall) return;
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('stallDetailPage').classList.add('active');
  document.getElementById('stallDetailName').textContent = stall.name;
  document.getElementById('stallDetailDescription').textContent = stall.description;
  document.getElementById('stallStatusBadge').textContent = stall.status === 'open' ? 'Open' : 'Closed';
  document.getElementById('stallStatusBadge').className = `px-3 py-1 rounded-full text-sm font-medium ${stall.status === 'open' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
  const banner = document.getElementById('stallBanner');
  banner.style.backgroundImage = `url('${stall.image}')`;
  if (stall.name === 'Cafe Aromatiko') {
    document.getElementById('privateSeatingButton').classList.remove('hidden');
  } else {
    document.getElementById('privateSeatingButton').classList.add('hidden');
  }
  renderMenu(stallId);
}

function groupMenuItemsByBase(items) {
  const grouped = {};
  items.forEach(item => {
    
    let baseName = item.name;
    if (baseName.indexOf(' - ') !== -1) {
      baseName = baseName.split(' - ')[0];
    } else {
      
      baseName = baseName.replace(/\b\d+\s*oz\b/i, '').trim();
    }
    baseName = baseName.trim();

    if (!grouped[baseName]) {
      grouped[baseName] = {
        baseName,
        items: [],
        baseImage: item.image,
        baseDescription: item.description,
        category: item.category
      };
    }
    grouped[baseName].items.push(item);
  });
  
  const merged = {};
  Object.values(grouped).forEach(group => {
    const keyLower = group.baseName.toLowerCase();
    const altKey = keyLower.endsWith('s') ? keyLower.slice(0, -1) : keyLower + 's';
    
    let existingKey = null;
    if (merged[keyLower]) existingKey = keyLower;
    else if (merged[altKey]) existingKey = altKey;

    if (existingKey) {
      merged[existingKey].items = merged[existingKey].items.concat(group.items);
      
      if (group.baseName.length < merged[existingKey].baseName.length) {
        merged[existingKey].baseName = group.baseName;
        merged[existingKey].baseDescription = group.baseDescription;
        merged[existingKey].baseImage = group.baseImage;
      }
    } else {
      merged[keyLower] = Object.assign({}, group);
      
      merged[keyLower].baseName = group.baseName;
    }
  });

  return Object.values(merged);
}

function renderMenu(stallId) {
  const menuItems = generateMenuItems(stallId);
  const groupedItems = groupMenuItemsByBase(menuItems);
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  
  groupedItems.forEach((group, index) => {
    const menuCard = document.createElement('div');
    menuCard.className = 'bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow';
    menuCard.id = `menu-group-${index}`;
    
    const hasMultipleSizes = group.items.length > 1;
    let priceDisplay = '';
    
    if (hasMultipleSizes) {
      const prices = group.items.map(item => item.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      priceDisplay = `₱${minPrice} - ₱${maxPrice}`;
    } else {
      priceDisplay = `₱${group.items[0].price}`;
    }
    
    menuCard.innerHTML = `
      <img src="${group.baseImage}" alt="${group.baseName}" class="w-full h-56 object-cover object-top">
      <div class="p-4">
        <h4 class="font-semibold text-gray-900 mb-1">${group.baseName}</h4>
        <p class="text-gray-600 text-sm mb-2">${group.baseDescription}</p>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-primary">${priceDisplay}</span>
          <span class="text-xs px-2 py-1 rounded-full ${group.items[0].available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${group.items[0].available ? 'Available' : 'Sold Out'}
          </span>
        </div>
        ${hasMultipleSizes ? '<p class="text-xs text-gray-500 mt-2 text-center">Click to see sizes</p>' : ''}
      </div>
    `;
    
    if (hasMultipleSizes) {
      menuCard.addEventListener('click', () => {
        showSizeOptions(group, index);
      });
    }
    
    grid.appendChild(menuCard);
  });
}

function showSizeOptions(group, groupIndex) {
  const modalId = `size-modal-${groupIndex}`;
  let modal = document.getElementById(modalId);
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    document.body.appendChild(modal);
  }
  
  const flavorMap = {};
  group.items.forEach(item => {
  
    let rest = item.name.includes(' - ') ? item.name.split(' - ')[1] : item.name;
  
    const sizeMatch = rest.match(/(16|22)\s*oz/i);
    const size = sizeMatch ? sizeMatch[0] : '';
  
    const flavor = rest.replace(/(16|22)\s*oz/i, '').trim();
    if (!flavorMap[flavor]) flavorMap[flavor] = [];
    flavorMap[flavor].push({ size, price: item.price, available: item.available, originalName: item.name, description: item.description });
  });

  const flavorsHtml = Object.keys(flavorMap).map(flavor => {
    const variants = flavorMap[flavor];
    
    variants.sort((a,b) => (a.size.includes('16') ? -1 : 1));
    const variantsHtml = variants.map(v => `
      <div class="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-red-50 transition-colors">
        <div>
          <div class="font-medium text-gray-900">${flavor} ${v.size}</div>
          <div class="text-xs text-gray-600">${v.description || ''}</div>
        </div>
        <div class="text-right">
          <div class="text-lg font-bold text-primary">₱${v.price}</div>
          <div class="text-sm ${v.available ? 'text-green-700' : 'text-red-700'}">${v.available ? 'Available' : 'Sold Out'}</div>
        </div>
      </div>
    `).join('');
    return `
      <div class="space-y-2">
        <h4 class="text-md font-semibold text-gray-800">${flavor}</h4>
        ${variantsHtml}
      </div>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">${group.baseName}</h3>
        <button onclick="document.getElementById('${modalId}').remove()" class="text-gray-500 hover:text-gray-700">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
      <div class="p-4 space-y-4">
        ${flavorsHtml}
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function generateMenuItems(stallId) {
  // Use persisted menu state if available (saved by admin)
  if (typeof window.generateCurrentMenuItems === 'function') {
    return window.generateCurrentMenuItems(stallId);
  }

  const stall = stalls.find(s => s.id === stallId);
  const items = [];
  for (let i = 1; i <= stall.menuCount; i++) {
    items.push({
      id: i,
      name: getMenuItemName(stall.name, i),
      description: getMenuItemDescription(stall.name, i),
      price: getMenuItemPrice(stall.name, i),
      category: getMenuCategory(stall.name, i),
      available: true,
      image: getMenuItemImagePath(stall.name, i, stallId)
    });
  }
  return items;
}

let currentRating = 0;

function setRating(rating) {
  currentRating = rating;
  const stars = document.querySelectorAll('#ratingStars button');
  stars.forEach((star, index) => {
    const starIcon = star.querySelector('i');
    if (index < rating) {
      star.classList.remove('text-gray-300');
      star.classList.add('text-yellow-400');
      starIcon.classList.remove('ri-star-line');
      starIcon.classList.add('ri-star-fill');
    } else {
      star.classList.remove('text-yellow-400');
      star.classList.add('text-gray-300');
      starIcon.classList.remove('ri-star-fill');
      starIcon.classList.add('ri-star-line');
    }
  });
}


window.showStallDetail = showStallDetail;
window.setRating = setRating;
window.showSizeOptions = showSizeOptions;

