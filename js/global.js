/**
 * GLOBAL.JS - Shared JavaScript functions used across all pages
 * Handles common functionality like navbar behavior
 */

(function() {
  'use strict';

  /**
   * Initialize navbar close-on-outside-click functionality
   * This function is shared across all pages
   */
  function initNavbarClose() {
    const navbar = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (!navbar || !navbarToggler) return;

    document.addEventListener('click', function(event) {
      const isClickInsideNav = navbar.contains(event.target);
      const isClickOnToggler = navbarToggler.contains(event.target);
      const isNavbarOpen = navbar.classList.contains('show');
      
      if (isNavbarOpen && !isClickInsideNav && !isClickOnToggler) {
        const bsCollapse = new bootstrap.Collapse(navbar, {
          toggle: false
        });
        bsCollapse.hide();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarClose);
  } else {
    initNavbarClose();
  }
})();

