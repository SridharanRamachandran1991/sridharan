/**
 * ECOMMERCE-CHURN.JS - JavaScript specific to ecommerce-churn.html
 * Handles Tableau visualization initialization and resizing for the churn analysis page
 */

(function() {
  'use strict';

  const TABLEAU_SCRIPT_URL = 'https://public.tableau.com/javascripts/api/viz_v1.js';
  const MOBILE_BREAKPOINT = 768;
  const DESKTOP_ASPECT_RATIO = 0.6;
  const MOBILE_ASPECT_RATIO = 0.9;
  const MIN_HEIGHT = 400;

  /**
   * Resize a Tableau visualization to fit its container
   * @param {string} vizId - The ID of the visualization container
   */
  function resizeTableauViz(vizId) {
    const divElement = document.getElementById(vizId);
    if (!divElement) return;

    const vizElement = divElement.querySelector('iframe.tableauViz') || 
                      divElement.getElementsByTagName('iframe')[0] ||
                      divElement.getElementsByTagName('object')[0];
    
    if (!vizElement) return;

    // Make sure element is visible
    vizElement.style.display = 'block';
    
    // Get container width with fallbacks
    let containerWidth = divElement.offsetWidth;
    if (containerWidth === 0) {
      const parent = divElement.parentElement;
      if (parent) {
        containerWidth = parent.offsetWidth;
      }
    }
    
    if (containerWidth === 0) {
      containerWidth = window.innerWidth - 100; // Account for padding
    }

    // Calculate aspect ratio and height
    const aspectRatio = window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO;
    let calculatedHeight = containerWidth * aspectRatio;
    
    if (calculatedHeight < MIN_HEIGHT) {
      calculatedHeight = MIN_HEIGHT;
    }

    // Apply styles
    vizElement.style.width = '100%';
    vizElement.style.height = calculatedHeight + 'px';
    vizElement.style.maxWidth = '100%';
    vizElement.style.minHeight = MIN_HEIGHT + 'px';
  }

  /**
   * Load Tableau script if not already loaded
   * @returns {Promise} Promise that resolves when script is loaded
   */
  function loadTableauScript() {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${TABLEAU_SCRIPT_URL}"]`)) {
        resolve();
        return;
      }

      const scriptElement = document.createElement('script');
      scriptElement.src = TABLEAU_SCRIPT_URL;
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.body.appendChild(scriptElement);
    });
  }

  /**
   * Initialize a Tableau visualization
   * @param {string} vizId - The ID of the visualization container
   */
  function initializeTableauViz(vizId) {
    const divElement = document.getElementById(vizId);
    if (!divElement) return;

    const vizElement = divElement.querySelector('iframe.tableauViz') || 
                      divElement.getElementsByTagName('iframe')[0] ||
                      divElement.getElementsByTagName('object')[0];
    if (!vizElement) return;

    resizeTableauViz(vizId);

    loadTableauScript().then(() => {
      setTimeout(() => {
        resizeTableauViz(vizId);
      }, 500);
    }).catch(() => {
      console.error('Failed to load Tableau script');
    });
  }

  /**
   * Initialize Tableau visualizations for tab-based layouts
   * @param {Object} tabVizMap - Map of tab pane IDs to visualization IDs
   * @param {string} defaultVizId - Default visualization to initialize on page load
   */
  function initTabTableauViz(tabVizMap, defaultVizId) {
    // Initialize default visualization on page load
    if (defaultVizId) {
      setTimeout(() => {
        initializeTableauViz(defaultVizId);
      }, 500);
    }

    // Handle tab switches
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach((button) => {
      button.addEventListener('shown.bs.tab', (event) => {
        const targetPaneId = event.target.getAttribute('data-bs-target');
        const paneId = targetPaneId ? targetPaneId.replace('#', '') : '';
        const vizId = tabVizMap[paneId];
        
        if (!vizId) return;

        // Make visualization visible
        const divElement = document.getElementById(vizId);
        if (divElement) {
          const vizElement = divElement.querySelector('iframe.tableauViz') || 
                            divElement.getElementsByTagName('iframe')[0] ||
                            divElement.getElementsByTagName('object')[0];
          if (vizElement) {
            vizElement.style.display = 'block';
          }
        }
        
        // Initialize Tableau when tab becomes visible
        setTimeout(() => {
          initializeTableauViz(vizId);
        }, 100);
        
        // Resize at multiple intervals to catch Tableau API loading
        const resizeIntervals = [400, 800, 1500];
        resizeIntervals.forEach((delay) => {
          setTimeout(() => {
            resizeTableauViz(vizId);
          }, delay);
        });
      });
    });

    // Handle window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        Object.values(tabVizMap).forEach((vizId) => {
          resizeTableauViz(vizId);
        });
      }, 250);
    });
  }

  // Export functions to global scope
  window.resizeTableauViz = resizeTableauViz;
  window.initializeTableauViz = initializeTableauViz;
  window.initTabTableauViz = initTabTableauViz;

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    const tabVizMap = {
      'pane-geography': 'viz1767031657381',
      'pane-delivery': 'viz1767205629728',
      'pane-reviews': 'viz1767206310675'
    };
    initTabTableauViz(tabVizMap, 'viz1767031657381');
  });
})();

