// Seating management and display

let generalSeating = Array(160).fill().map((_, i) => ({
  id: i + 1,
  tableId: Math.floor(i / 8) + 1,
  seatNumber: (i % 8) + 1,
  occupied: Math.random() < 0.225
}));

let privateSeating = Array(48).fill().map((_, i) => ({
  id: i + 1,
  tableId: Math.floor(i / 8) + 1,
  seatNumber: (i % 8) + 1,
  occupied: Math.random() < 0.125
}));

function showSeatingMap() {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('seatingMapPage').classList.add('active');
  renderGeneralSeating();
  updateSeatingStats();
}

function renderGeneralSeating() {
  const grid = document.getElementById('generalSeatingGrid');
  grid.innerHTML = '';
  for (let tableId = 1; tableId <= 20; tableId++) {
    const tableSeats = generalSeating.filter(seat => seat.tableId === tableId);
    const availableSeats = tableSeats.filter(seat => !seat.occupied).length;
    const occupiedSeats = tableSeats.filter(seat => seat.occupied).length;
    const isTableFull = availableSeats === 0;
    const tableCard = document.createElement('div');
    tableCard.className = `bg-white rounded-2xl border-2 p-4 ${isTableFull ? 'border-red-200' : 'border-green-200'}`;
    tableCard.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 ${isTableFull ? 'bg-red-500' : 'bg-green-500'} rounded-full flex items-center justify-center">
            <i class="ri-${isTableFull ? 'close' : 'check'}-fill text-white"></i>
          </div>
          <h3 class="font-bold text-gray-900">Table ${tableId}</h3>
        </div>
      </div>
      <p class="text-sm text-gray-600 mb-3">${availableSeats} / 8 seats</p>
      <div class="space-y-2">
        <button onclick="occupySeat(${tableId})" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 !rounded-button text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center ${isTableFull ? 'opacity-50 cursor-not-allowed' : ''}" ${isTableFull ? 'disabled' : ''}>
          <div class="w-4 h-4 flex items-center justify-center mr-2">
            <i class="ri-user-add-line"></i>
          </div>
          Occupy Seat
        </button>
        <button onclick="freeSeat(${tableId})" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 !rounded-button text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center ${occupiedSeats === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${occupiedSeats === 0 ? 'disabled' : ''}>
          <div class="w-4 h-4 flex items-center justify-center mr-2">
            <i class="ri-user-unfollow-line"></i>
          </div>
          Free Seat
        </button>
      </div>
    `;
    grid.appendChild(tableCard);
  }
}

function occupySeat(tableId) {
  const tableSeats = generalSeating.filter(seat => seat.tableId === tableId && !seat.occupied);
  if (tableSeats.length > 0) {
    tableSeats[0].occupied = true;
    renderGeneralSeating();
    updateSeatingStats();
  }
}

function freeSeat(tableId) {
  const tableSeats = generalSeating.filter(seat => seat.tableId === tableId && seat.occupied);
  if (tableSeats.length > 0) {
    tableSeats[0].occupied = false;
    renderGeneralSeating();
    updateSeatingStats();
  }
}

function renderPrivateSeating() {
  const grid = document.getElementById('privateSeatingGrid');
  grid.innerHTML = '';
  for (let tableId = 1; tableId <= 6; tableId++) {
    const tableSeats = privateSeating.filter(seat => seat.tableId === tableId);
    const availableSeats = tableSeats.filter(seat => !seat.occupied).length;
    const occupiedSeats = tableSeats.filter(seat => seat.occupied).length;
    const isTableFull = availableSeats === 0;
    const tableCard = document.createElement('div');
    tableCard.className = 'bg-green-50 rounded-2xl border-2 border-green-200 p-4';
    tableCard.innerHTML = `
      <div class="flex items-center space-x-2 mb-3">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <i class="ri-check-line text-white text-sm"></i>
        </div>
        <h3 class="font-bold text-gray-900">Table ${tableId}</h3>
      </div>
      <p class="text-sm text-gray-600 mb-3">${availableSeats} / 8 seats</p>
      <div class="space-y-2">
        <button onclick="occupyPrivateSeat(${tableId})" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 !rounded-button text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center ${isTableFull ? 'opacity-50 cursor-not-allowed' : ''}" ${isTableFull ? 'disabled' : ''}>
          <div class="w-4 h-4 flex items-center justify-center mr-2">
            <i class="ri-user-add-line"></i>
          </div>
          Occupy Seat
        </button>
        <button onclick="freePrivateSeat(${tableId})" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 !rounded-button text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center ${occupiedSeats === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${occupiedSeats === 0 ? 'disabled' : ''}>
          <div class="w-4 h-4 flex items-center justify-center mr-2">
            <i class="ri-user-unfollow-line"></i>
          </div>
          Free Seat
        </button>
      </div>
    `;
    grid.appendChild(tableCard);
  }
}

function toggleSeat(seatId, type) {
  const seatingArray = type === 'general' ? generalSeating : privateSeating;
  const seat = seatingArray.find(s => s.id === seatId);
  seat.occupied = !seat.occupied;
  if (type === 'general') {
    renderGeneralSeating();
  } else {
    renderPrivateSeating();
    updatePrivateSeatingStats();
  }
  updateSeatingStats();
}

function occupyPrivateSeat(tableId) {
  const tableSeats = privateSeating.filter(seat => seat.tableId === tableId && !seat.occupied);
  if (tableSeats.length > 0) {
    tableSeats[0].occupied = true;
    renderPrivateSeating();
    updatePrivateSeatingStats();
  }
}

function freePrivateSeat(tableId) {
  const tableSeats = privateSeating.filter(seat => seat.tableId === tableId && seat.occupied);
  if (tableSeats.length > 0) {
    tableSeats[0].occupied = false;
    renderPrivateSeating();
    updatePrivateSeatingStats();
  }
}

function updateSeatingStats() {
  const generalAvailable = generalSeating.filter(seat => !seat.occupied).length;
  const generalOccupied = generalSeating.filter(seat => seat.occupied).length;
  document.getElementById('generalAvailableSeats').textContent = generalAvailable;
  document.getElementById('generalOccupiedSeats').textContent = generalOccupied;
  document.getElementById('availableSeatsCount').textContent = generalAvailable;
}

function updatePrivateSeatingStats() {
  const privateAvailable = privateSeating.filter(seat => !seat.occupied).length;
  const privateOccupied = privateSeating.filter(seat => seat.occupied).length;
  document.getElementById('privateAvailableSeats').textContent = privateAvailable;
  document.getElementById('privateOccupiedSeats').textContent = privateOccupied;
}

function showPrivateSeating() {
  document.getElementById('privateSeatingModal').classList.add('active');
  renderPrivateSeating();
  updatePrivateSeatingStats();
}

function closePrivateSeating() {
  document.getElementById('privateSeatingModal').classList.remove('active');
}

// Export functions to global scope
window.showSeatingMap = showSeatingMap;
window.showPrivateSeating = showPrivateSeating;
window.closePrivateSeating = closePrivateSeating;
window.occupySeat = occupySeat;
window.freeSeat = freeSeat;
window.toggleSeat = toggleSeat;
window.occupyPrivateSeat = occupyPrivateSeat;
window.freePrivateSeat = freePrivateSeat;

