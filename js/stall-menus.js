// Load stall menu objects from global scope

let stallMenuMap = {};

// Get menu object from global window scope
function loadMenuFromScript(variableName) {
  return typeof window[variableName] !== 'undefined' ? window[variableName] : null;
}

// Initialize menu map from global menu variables
function initializeStallMenuMap() {
  stallMenuMap = {
    'Theatery': loadMenuFromScript('theateryMenu'),
    'Spot-G Food Hub': loadMenuFromScript('spotgMenu'),
    'Little Tokyo Takoyaki': loadMenuFromScript('littletokyoMenu'),
    'RC Beef Shawarma': loadMenuFromScript('rcbeefMenu'),
    'Juice Bar': loadMenuFromScript('juicebarMenu'),
    'Chowking': loadMenuFromScript('chowkingMenu'),
    'Fried Noodles Haus': loadMenuFromScript('friednoodlesMenu'),
    'ITSNOK Binalot': loadMenuFromScript('itsnokMenu'),
    "Gian's Buko Juice": loadMenuFromScript('giansbukoMenu'),
    "RR Sorella's": loadMenuFromScript('rrsorelasMenu'),
    'Tender Juicy Hotdogs': loadMenuFromScript('tenderjuicyMenu'),
    'Potato Corner': loadMenuFromScript('potatocornerMenu'),
    "Julie's Bakeshop": loadMenuFromScript('juliesbakeshopMenu'),
    'Waffle Time': loadMenuFromScript('waffletimeMenu'),
    'Cafe Aromatiko': loadMenuFromScript('cafearmatikoMenu')
  };
}

// Export functions for global use
window.initializeStallMenuMap = initializeStallMenuMap;
window.getStallMenuMap = () => stallMenuMap;
