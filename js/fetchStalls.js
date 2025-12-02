// Fetch stalls and menu states from backend API
(function () {
  async function load() {
    try {
      const [res, stateRes] = await Promise.all([fetch('/api/stalls'), fetch('/api/menu-states')]);
      if (!res.ok) throw new Error('Failed to fetch stalls');
      const data = await res.json();
      const states = stateRes && stateRes.ok ? await stateRes.json() : {};
      // Overwrite global stalls and refresh UI
      window.stalls = data;
      window.menuStates = states || {};
      if (typeof loadStalls === 'function') loadStalls();
      // Update counts if present
      if (typeof updateStallCounts === 'function') updateStallCounts();
    } catch (err) {
      console.warn('Could not load stalls from API:', err);
    }
  }

  // Initialize after page load
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(load, 100);
  });
})();
