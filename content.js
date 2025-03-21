// Store the original styles so we can revert if needed
let originalStyles = {};

// Apply our UI enhancements
function applyEnhancements() {
  // Add body class for easier styling
  document.body.classList.add('jobcan-enhanced');
  
  // Core enhancements
  fixDuplicateSidemenus();
  enhanceSidemenuBehavior();
  setupHeaderVisibility();
  enhanceManagerNameDisplay();
  enhanceUserDisplay(); // Add new enhancement
  setupFlipClock();
  convertManHourModalToSidePanel();
  enhanceModalTitle();
  enhanceManHourSelectLists();
  simplifyTableHeaders();
  enhanceCollapseInfo();
  setupScreenshotButton();
  addFormScreenshotButton();
  monitorUnmatchTime();
  foldSignInRightContainer(); // Add the new function call here
  
  // Check if enhancements are enabled
  chrome.storage.sync.get(['enableEnhancer'], function(result) {
    const enabled = result.enableEnhancer !== false; // Default to true if undefined
    
    if (enabled) {
      document.body.classList.add('jobcan-enhanced');
      fixDuplicateSidemenus();
      enhanceSidemenuBehavior();
      setupHeaderVisibility();
      enhanceManagerNameDisplay();
      setupFlipClock();
      convertManHourModalToSidePanel();
      enhanceModalTitle();
      enhanceManHourSelectLists();
      simplifyTableHeaders();
      enhanceCollapseInfo();
      setupScreenshotButton();
      addFormScreenshotButton();
      monitorUnmatchTime();
      foldSignInRightContainer(); // Add the new function call here
      
      // Add background image to login page
      const loginContainer = document.querySelector('.login-page-container');
      if (loginContainer) {
        // Remove any existing SVG background
        loginContainer.style.background = 'none';
        
        // Initialize wave animation on the login page
        // The script checks if it exists already to avoid duplicates
        if (!document.querySelector('#wave-animation-script')) {
          // First, create a script element to load wave.js
          const scriptElement = document.createElement('script');
          scriptElement.id = 'wave-animation-script';
          scriptElement.src = chrome.runtime.getURL('wave.js');
          
          // Add script to the page
          document.head.appendChild(scriptElement);
          
          // Make sure all input fields pass through mouse events to the canvas
          loginContainer.addEventListener('click', function(e) {
            // Create a custom event to propagate clicks to the canvas
            const canvasElement = document.querySelector('canvas');
            if (canvasElement) {
              const rect = canvasElement.getBoundingClientRect();
              const clickEvent = new MouseEvent('click', {
                clientX: e.clientX - rect.left,
                clientY: e.clientY - rect.top,
                bubbles: true,
                cancelable: true
              });
              canvasElement.dispatchEvent(clickEvent);
            }
          });
        }
        
        // Remove all styling from the form container
        const signInForm = loginContainer.querySelector('.sign-in-left-container');
        if (signInForm) {
          signInForm.style.backgroundColor = 'transparent';
          signInForm.style.borderRadius = '0';
          signInForm.style.boxShadow = 'none';
          signInForm.style.padding = '0';
          signInForm.style.position = 'relative';
          signInForm.style.zIndex = '1';
          
          // Make only the form inputs have a white background for readability
          const formControls = signInForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
          formControls.forEach(input => {
            input.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            
            // Make sure input fields are above the canvas
            input.style.position = 'relative';
            input.style.zIndex = '2';
          });
        }
      }
    } else {
      document.body.classList.remove('jobcan-enhanced');
    }
  });
  
  // Fix settings icon
  fixSettingsIcon();
}

// Fix duplicate sidemenus issue
function fixDuplicateSidemenus() {
  // Get all sidemenus
  const sidemenus = document.querySelectorAll('#sidemenu, .sidemenu');
  
  if (sidemenus.length > 1) {
    // Keep only the first visible sidemenu
    let visibleFound = false;
    
    sidemenus.forEach((menu, index) => {
      // Skip the first one if it's visible
      if (index === 0 && getComputedStyle(menu).display !== 'none') {
        visibleFound = true;
        return;
      }
      
      // For subsequent menus, hide them if we already found a visible one
      // or if this one is visible and we haven't found a visible one yet
      if (visibleFound) {
        menu.style.display = 'none';
      } else if (getComputedStyle(menu).display !== 'none') {
        visibleFound = true;
      }
    });
  }
  
  // Handle menu toggle buttons
  const menuToggleButtons = document.querySelectorAll('[data-toggle="sidemenu"], .menu-toggle, .sidebar-toggle');
  
  menuToggleButtons.forEach(button => {
    // Remove existing event listeners by cloning
    const newButton = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(newButton, button);
      
      // Add our own event listener
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        fixDuplicateSidemenus();
        
        // Re-check after a short delay (for animation completion)
        setTimeout(fixDuplicateSidemenus, 300);
      });
          }
        });
      }
      
// Enhance sidemenu behavior to close when mouse moves outside
function enhanceSidemenuBehavior() {
  // Hide close buttons first
  const closeButtons = document.querySelectorAll('.sidemenu-close, .jbc-sidemenu-close, [onclick*="closeSidemenu"]');
  closeButtons.forEach(button => {
    if (button) {
      button.style.display = 'none';
    }
  });

  // Find sidemenu
  const sidemenu = document.querySelector('#sidemenu, .sidemenu, .jbc-sidemenu');
  
  // Make the entire sidemenu-closed div clickable
  const closedSideMenu = document.querySelector('#sidemenu-closed, .jbc-sidemenu-closed');
  if (closedSideMenu && !closedSideMenu.hasAttribute('onclick')) {
    closedSideMenu.setAttribute('onclick', 'openSidemenu()');
    closedSideMenu.style.cursor = 'pointer';
  }
  
  if (sidemenu) {
    // Add mouseenter event to ensure we track when mouse is within the menu
    sidemenu.addEventListener('mouseenter', function() {
      sidemenu.dataset.mouseInside = 'true';
    });
    
    // Add mouseleave event to close sidemenu when mouse leaves
    sidemenu.addEventListener('mouseleave', function() {
      sidemenu.dataset.mouseInside = 'false';
      
      // Check if closeSidemenu function exists
      if (typeof closeSidemenu === 'function') {
        // Add a small delay to prevent accidental closings
        setTimeout(() => {
          // Only close if mouse is still outside
          if (sidemenu.dataset.mouseInside !== 'true') {
            closeSidemenu();
          }
        }, 300);
      }
    });
    
    // Alternative method if closeSidemenu is not directly accessible
    document.addEventListener('mousemove', function(e) {
      // If sidemenu is visible
      if (sidemenu.style.display !== 'none' && sidemenu.dataset.mouseInside !== 'true') {
        // Get sidemenu bounds
        const rect = sidemenu.getBoundingClientRect();
        
        // Check if mouse is far from sidemenu (at least 50px away)
        const isFarFromMenu = 
          e.clientX < rect.left - 50 || 
          e.clientX > rect.right + 50 || 
          e.clientY < rect.top - 50 || 
          e.clientY > rect.bottom + 50;
        
        if (isFarFromMenu && typeof closeSidemenu === 'function') {
          closeSidemenu();
        } else if (isFarFromMenu) {
          // Fallback if closeSidemenu doesn't exist
          const closeTrigger = document.querySelector('[onclick*="closeSidemenu"]');
          if (closeTrigger) {
            closeTrigger.click();
          }
        }
      }
    });
  }
}

// Enhance header visibility behavior
function setupHeaderVisibility() {
  // Get the jbcid-header element
  const header = document.querySelector('.jbcid-header');
  if (!header) return;
  
  // Remove the trigger area if it exists
  const existingTrigger = document.querySelector('.jbcid-header-trigger');
  if (existingTrigger && existingTrigger.parentNode) {
    existingTrigger.parentNode.removeChild(existingTrigger);
  }
  
  // Make header always visible
  header.style.transition = 'top 0.3s ease';
  header.style.top = '0';
  header.classList.add('visible');
  
  // Remove background and box shadow
  header.style.backgroundColor = 'transparent';
  header.style.boxShadow = 'none';
  
  // Hide the logo/navbar-header
  const navbarHeader = header.querySelector('.jbcid-navbar-header');
  if (navbarHeader) {
    navbarHeader.style.display = 'none';
  }
  
  // Style the left navbar menu as a toggle tab in the center
  const navbarMenu = header.querySelector('.jbcid-navbar-menu.jbcid-navbar-left');
  if (navbarMenu) {
    // Style the container
    navbarMenu.style.position = 'absolute';
    navbarMenu.style.left = '50%';
    navbarMenu.style.transform = 'translateX(-50%)';
    navbarMenu.style.top = '0';
    navbarMenu.style.backgroundColor = '#fff';
    navbarMenu.style.borderRadius = '0 0 16px 16px';  // Increased border radius
    navbarMenu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';  // Enhanced shadow
    navbarMenu.style.padding = '8px 8px';  // Increased padding
    navbarMenu.style.border = '1px solid rgba(228, 230, 235, 0.6)';  // Subtle border
    navbarMenu.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';  // Smooth animation
    
    // Style the navigation items
    const navItems = navbarMenu.querySelectorAll('ul.nav li a');
    navItems.forEach(item => {
      item.style.padding = '6px 14px';  // Increased padding
      item.style.margin = '0 6px';  // Increased margin
      item.style.fontSize = '14px';  // Slightly larger font
      item.style.borderRadius = '8px';  // Increased border radius
      item.style.transition = 'all 0.3s ease';  // Smoother transition
      item.style.fontWeight = '500';  // Medium weight for all items
      item.style.display = 'flex';  // For better alignment
      item.style.alignItems = 'center';  // Center contents
      item.style.justifyContent = 'center';  // Center text
      item.style.minWidth = '75px';  // Set minimum width
      item.style.height = '24px';  // Set height
      item.style.borderRight = 'none';  // Remove border-right
      
      // Add subtle grey background for non-active items
      if (!item.classList.contains('active')) {
        item.style.backgroundColor = 'rgba(240, 240, 240, 0.4)';  // Subtle grey background
      }
      
      // Style active items
      if (item.classList.contains('active')) {
        item.style.backgroundColor = 'var(--primary-light, #e6f2ff)';
        item.style.color = 'var(--primary-color, #0078ff)';
        item.style.fontWeight = '600';
        item.style.boxShadow = '0 2px 4px rgba(0, 120, 255, 0.15)';  // Add subtle shadow to active item
        
        // Check if an indicator already exists before creating a new one
        const existingIndicator = item.querySelector('.active-indicator');
        if (!existingIndicator) {
          // Create and add an active indicator dot
          const indicator = document.createElement('span');
          indicator.className = 'active-indicator';
          indicator.style.display = 'inline-block';
          indicator.style.width = '4px';
          indicator.style.height = '4px';
          indicator.style.backgroundColor = 'var(--primary-color, #0078ff)';
          indicator.style.borderRadius = '50%';
          indicator.style.marginLeft = '6px';
          indicator.style.opacity = '0.8';
          indicator.style.position = 'relative';
          indicator.style.top = '-1px';
          item.appendChild(indicator);
        }
      } else {
        item.style.color = 'var(--secondary-color, #6c757d)';
        // Remove indicator if it exists and item is not active
        const existingIndicator = item.querySelector('.active-indicator');
        if (existingIndicator) {
          item.removeChild(existingIndicator);
        }
      }
      
      // Add hover effect
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
          item.style.backgroundColor = 'rgba(230, 230, 230, 0.8)';  // Slightly darker grey on hover
          item.style.transform = 'translateY(-1px)';  // Subtle lift effect
          item.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';  // Subtle shadow on hover
        }
      });
      
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          item.style.backgroundColor = 'rgba(240, 240, 240, 0.4)';  // Return to subtle grey background
          item.style.transform = 'translateY(0)';  // Reset transform
          item.style.boxShadow = 'none';  // Remove shadow
        }
      });
    });
    
    // Fix the nav container styling
    const navContainer = navbarMenu.querySelector('ul.nav');
    if (navContainer) {
      navContainer.style.display = 'flex';
      navContainer.style.padding = '0';
      navContainer.style.margin = '0';
      navContainer.style.listStyle = 'none';
    }
  }
  
  // Remove any existing event listeners that might hide the header
  header.onmouseenter = null;
  header.onmouseleave = null;
  
  // Adjust the content area to account for the always-visible header
  const contentsArea = document.querySelector('.contentsArea');
  if (contentsArea) {
    contentsArea.style.marginTop = '24px';
  }
  
  const mainContent = document.querySelector('#main-content');
  if (mainContent) {
    mainContent.style.marginTop = '24px';
  }
}

// Enhance the manager name dropdown and add settings icon
function enhanceManagerNameDisplay() {
  const managerNameEl = document.querySelector('#manager-name');
  if (!managerNameEl) return;
  
  // Check if we've already enhanced this element
  if (managerNameEl.dataset.enhanced === 'true') return;
  managerNameEl.dataset.enhanced = 'true';
  
  // Extract the staff settings link
  const staffSettingsLink = managerNameEl.querySelector('.dropdown-item[href="/employee/edit-info/"]');
  if (!staffSettingsLink) return;
  
  // Create settings icon button with modern styling
  const settingsButton = document.createElement('a');
  settingsButton.href = '/employee/edit-info/';
  settingsButton.className = 'staff-settings-btn';
  settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>`;
  settingsButton.title = '設定';
  
  // Add the button next to manager name
  managerNameEl.appendChild(settingsButton);
  
  // Fix the toggle dropdown behavior with modern styling
  const dropdownToggle = managerNameEl.querySelector('.dropdown-toggle');
  const dropdownMenu = managerNameEl.querySelector('.dropdown-menu');
  
  if (dropdownToggle && dropdownMenu) {
    // Add modern styling to dropdown menu
    dropdownMenu.style.borderRadius = '0.5rem';
    dropdownMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
    dropdownMenu.style.border = '1px solid #E9ECEF';
    dropdownMenu.style.padding = '0.5rem 0';
    
    // Style dropdown items
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.style.padding = '0.5rem 1rem';
      item.style.transition = 'background-color 150ms ease';
    });
    
    // Override the default dropdown behavior
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle the dropdown visibility
      if (managerNameEl.classList.contains('show')) {
        managerNameEl.classList.remove('show');
        dropdownMenu.style.display = 'none';
      } else {
        managerNameEl.classList.add('show');
        dropdownMenu.style.display = 'block';
      }
    }); 
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!managerNameEl.contains(e.target) && managerNameEl.classList.contains('show')) {
        managerNameEl.classList.remove('show');
        dropdownMenu.style.display = 'none';
      }
    });
  }
}

// Make user name and staff code display horizontally in dropdown toggle
function enhanceUserDisplay() {
  // Find all dropdown toggle elements with user information
  const userToggleElements = document.querySelectorAll('a.dropdown-toggle[id="rollover-menu-link"]');
  
  userToggleElements.forEach(toggle => {
    // Skip if already enhanced
    if (toggle.dataset.enhanced === 'true') return;
    toggle.dataset.enhanced = 'true';
    
    // Remove the ::after pseudo-element
    toggle.style.position = 'relative';
    
    // Use a style tag to target the ::after pseudo-element
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      a#rollover-menu-link.d-block.dropdown-toggle::after {
        display: none !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    // Get the content of the toggle
    const content = toggle.innerHTML;
    
    // Check if it contains a <br> and a div with staff code
    if (content.includes('<br>') && content.includes('スタッフコード')) {
      // Extract the name and staff code parts
      const parts = content.split('<br>');
      const name = parts[0].trim();
      const staffCodeDiv = parts[1].trim();
      
      // Create a wrapper for horizontal layout
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '8px'; // Space between name and code
      
      // Create name element
      const nameElement = document.createElement('span');
      nameElement.innerHTML = name;
      
      // Extract staff code content from div
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = staffCodeDiv;
      const staffCodeElement = document.createElement('span');
      staffCodeElement.style.fontSize = '10px';
      staffCodeElement.innerHTML = tempDiv.firstChild.innerHTML;
      
      // Append elements to wrapper
      wrapper.appendChild(nameElement);
      wrapper.appendChild(staffCodeElement);
      
      // Replace toggle content
      toggle.innerHTML = '';
      toggle.appendChild(wrapper);
    }
  });
}

// Create and setup the flip clock animation
function setupFlipClock() {
  // Find clock elements
  const clockElements = document.querySelectorAll('#clock, #display-time, .display-2 > div:not(.flip-clock-container)');
  
  clockElements.forEach(clockElement => {
    // Skip if already enhanced
    if (clockElement.dataset.enhanced === 'true') return;
    clockElement.dataset.enhanced = 'true';
    
    // Get parent element
    const parentElement = clockElement.parentElement;
    if (!parentElement) return;
    
    // Create flip clock container with improved styling
    const flipClockContainer = document.createElement('div');
    flipClockContainer.className = 'flip-clock-container';
    flipClockContainer.style.display = 'flex';
    flipClockContainer.style.flexDirection = 'column';
    flipClockContainer.style.alignItems = 'center';
    flipClockContainer.style.justifyContent = 'center';
    flipClockContainer.style.margin = 'var(--space-lg) 0';
    flipClockContainer.style.padding = 'var(--space-md)';
    flipClockContainer.style.background = 'var(--color-surface, #ffffff)';
    flipClockContainer.style.borderRadius = '16px';
    flipClockContainer.style.boxShadow = 'var(--shadow-sm)';
    flipClockContainer.style.position = 'relative';
    flipClockContainer.style.transition = 'all 0.3s ease';
    
    // Add hover effect
    flipClockContainer.addEventListener('mouseenter', () => {
      flipClockContainer.style.transform = 'translateY(-5px)';
      flipClockContainer.style.boxShadow = 'var(--shadow-md, 0 8px 16px rgba(0,0,0,0.15))';
    });
    
    flipClockContainer.addEventListener('mouseleave', () => {
      flipClockContainer.style.transform = 'translateY(0)';
      flipClockContainer.style.boxShadow = 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.1))';
    });
    
    // Create a clock digits container to prevent settings from being deleted
    const clockDigitsContainer = document.createElement('div');
    clockDigitsContainer.className = 'flip-clock-digits-container';
    clockDigitsContainer.style.display = 'flex';
    clockDigitsContainer.style.alignItems = 'center';
    clockDigitsContainer.style.justifyContent = 'center';
    flipClockContainer.appendChild(clockDigitsContainer);
    
    // Create progress bar container - now a proper child of the container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'work-progress-container';
    progressContainer.style.width = '100%'; // Match the effective width of clock digits
    progressContainer.style.maxWidth = '58%'; // Max width to look consistent with larger clocks
    progressContainer.style.marginTop = '20px';
    progressContainer.style.position = 'relative';
    progressContainer.style.height = '32px';
    progressContainer.style.borderRadius = '8px';
    progressContainer.style.padding = '4px';
    progressContainer.style.background = 'rgba(240, 242, 245, 0.4)';
    progressContainer.style.backdropFilter = 'blur(4px)';
    progressContainer.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.7)';
    progressContainer.style.transition = 'all 0.2s ease';
    
    // Create progress track with improved styling
    const progressTrack = document.createElement('div');
    progressTrack.className = 'work-progress-track';
    progressTrack.style.height = '8px';
    progressTrack.style.width = '100%';
    progressTrack.style.backgroundColor = 'rgba(220, 224, 228, 0.7)';
    progressTrack.style.borderRadius = '6px';
    progressTrack.style.overflow = 'hidden';
    progressTrack.style.position = 'relative';
    progressTrack.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.07)';
    progressTrack.style.marginTop = '2px';
    
    // Create progress fill with improved styling
    const progressFill = document.createElement('div');
    progressFill.className = 'work-progress-fill';
    progressFill.style.height = '100%';
    progressFill.style.width = '0%';
    progressFill.style.backgroundColor = 'var(--color-primary)';
    progressFill.style.position = 'absolute';
    progressFill.style.left = '0';
    progressFill.style.top = '0';
    progressFill.style.transition = 'width 0.5s ease, background-color 0.5s ease, box-shadow 0.5s ease';
    progressFill.style.boxShadow = '0 0 8px rgba(0, 102, 221, 0.3)';
    progressFill.style.borderRadius = '6px';
    progressTrack.appendChild(progressFill);
    
    // Add time scale markers (quarters of the workday)
    const createTimeMarker = (percent, time) => {
      const marker = document.createElement('div');
      marker.className = 'time-scale-marker';
      marker.style.position = 'absolute';
      marker.style.top = '-1px';
      marker.style.left = `${percent}%`;
      marker.style.width = '1px';
      marker.style.height = '4px';
      marker.style.backgroundColor = 'rgba(120, 130, 140, 0.3)';
      marker.title = time;
      return marker;
    };
    
    // Add scale markers for important times (quarter intervals)
    progressTrack.appendChild(createTimeMarker(0, '10:00'));
    progressTrack.appendChild(createTimeMarker(25, '12:15'));
    progressTrack.appendChild(createTimeMarker(50, '14:30'));
    progressTrack.appendChild(createTimeMarker(75, '16:45'));
    progressTrack.appendChild(createTimeMarker(100, '19:00'));
    
    // Create time markers with improved styling
    const startMarker = document.createElement('div');
    startMarker.className = 'work-progress-marker start-marker';
    startMarker.textContent = '10:00';
    startMarker.style.position = 'absolute';
    startMarker.style.left = '0';
    startMarker.style.top = '-12px';
    startMarker.style.fontSize = '9px';
    startMarker.style.fontWeight = '500';
    startMarker.style.color = 'var(--color-text-secondary)';
    
    const endMarker = document.createElement('div');
    endMarker.className = 'work-progress-marker end-marker';
    endMarker.textContent = '19:00';
    endMarker.style.position = 'absolute';
    endMarker.style.right = '0';
    endMarker.style.top = '-12px';
    endMarker.style.fontSize = '9px';
    endMarker.style.fontWeight = '500';
    endMarker.style.color = 'var(--color-text-secondary)';
    
    // Create time percentage with improved styling
    const percentageIndicator = document.createElement('div');
    percentageIndicator.className = 'work-progress-percentage';
    percentageIndicator.style.width = '100%';
    percentageIndicator.style.position = 'absolute';
    percentageIndicator.style.bottom = '4px';
    percentageIndicator.style.left = '0';
    percentageIndicator.style.textAlign = 'center';
    percentageIndicator.style.fontSize = '11px';
    percentageIndicator.style.fontWeight = 'bold';
    percentageIndicator.style.color = 'var(--color-text-secondary)';
    percentageIndicator.style.padding = '1px 0';
    percentageIndicator.style.lineHeight = '1.2';
    percentageIndicator.style.whiteSpace = 'nowrap';
    percentageIndicator.style.overflow = 'hidden';
    percentageIndicator.style.textOverflow = 'ellipsis';
    
    // Add hover effect to container
    progressContainer.addEventListener('mouseenter', () => {
      progressContainer.style.background = 'rgba(245, 247, 250, 0.6)';
      progressTrack.style.height = '10px';
      progressTrack.style.marginTop = '1px';
      progressTrack.style.transition = 'all 0.2s ease';
    });
    
    progressContainer.addEventListener('mouseleave', () => {
      progressContainer.style.background = 'rgba(240, 242, 245, 0.4)';
      progressTrack.style.height = '8px';
      progressTrack.style.marginTop = '2px';
    });
    
    // Add interactive tooltip
    const timeTooltip = document.createElement('div');
    timeTooltip.className = 'time-tooltip';
    timeTooltip.style.position = 'absolute';
    timeTooltip.style.top = '-30px';
    timeTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timeTooltip.style.color = 'white';
    timeTooltip.style.padding = '2px 6px';
    timeTooltip.style.borderRadius = '4px';
    timeTooltip.style.fontSize = '10px';
    timeTooltip.style.fontWeight = 'bold';
    timeTooltip.style.pointerEvents = 'none';
    timeTooltip.style.opacity = '0';
    timeTooltip.style.transition = 'opacity 0.2s ease';
    timeTooltip.style.zIndex = '10';
    timeTooltip.style.transform = 'translateX(-50%)';
    timeTooltip.style.whiteSpace = 'nowrap';
    progressTrack.appendChild(timeTooltip);
    
    // Add interactive hover to show time
    progressTrack.addEventListener('mousemove', (e) => {
      // Calculate percent position in the track
      const rect = progressTrack.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      
      // Convert percent to time
      const totalMins = (19 - 10) * 60; // 10:00 to 19:00 in minutes
      const mins = Math.floor((percent / 100) * totalMins);
      const hours = 10 + Math.floor(mins / 60);
      const minutes = mins % 60;
      const timeString = `${hours}:${minutes.toString().padStart(2, '0')}`;
      
      // Position and show tooltip
      timeTooltip.style.left = `${percent}%`;
      timeTooltip.textContent = timeString;
      timeTooltip.style.opacity = '1';
    });
    
    progressTrack.addEventListener('mouseleave', () => {
      timeTooltip.style.opacity = '0';
    });
    
    // Add all progress elements to container
    progressContainer.appendChild(startMarker);
    progressContainer.appendChild(endMarker);
    progressContainer.appendChild(progressTrack);
    progressContainer.appendChild(percentageIndicator);
    
    // Check if progress bar should be shown (default to true)
    chrome.storage.sync.get(['showProgressBar'], function(result) {
      const showProgressBar = result.showProgressBar !== false; // Default to true
      progressContainer.style.display = showProgressBar ? 'block' : 'none';
    });
    
    // Add progress container to flip clock container
    flipClockContainer.appendChild(progressContainer);
    
    // Get initial time
    const initialTime = clockElement.textContent.trim();
    
    // Setup flip clock with initial time
    setupFlipClockDigits(clockDigitsContainer, initialTime);
    
    // Insert flip clock after the original clock element
    parentElement.appendChild(flipClockContainer);
    
    // Start updating the clock every second
    updateFlipClock(flipClockContainer, clockElement);
    
    // Start updating progress bar every minute
    updateWorkProgressBar(flipClockContainer);
    setInterval(() => updateWorkProgressBar(flipClockContainer), 60000);
  });
}

// Update flip clock every second
function updateFlipClock(container, clockElement) {
  // Set interval for updating
  const updateInterval = setInterval(() => {
    // Check if container still exists
    if (!document.body.contains(container)) {
      clearInterval(updateInterval);
    return;
  }
  
    // Get current time from the clock element
    const currentTime = clockElement.textContent.trim();
    
    // Get the digits container
    const digitsContainer = container.querySelector('.flip-clock-digits-container');
    if (!digitsContainer) return;
    
    // Handle default style display differently
    const defaultDisplay = digitsContainer.querySelector('.default-time-display');
    if (defaultDisplay) {
      // Get time parts
      const parts = currentTime.split(':');
      const [hours, minutes] = parts;
      
      // Get hour/minute span and update it
      const hoursMinutes = defaultDisplay.querySelector('span:first-child');
      if (hoursMinutes) {
        hoursMinutes.textContent = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      
      // Get seconds span and update it
      if (parts.length > 2) {
        const seconds = parts[2] || '00';
        const secondsEl = defaultDisplay.querySelector('span[data-position="seconds"]');
        if (secondsEl) {
          secondsEl.textContent = seconds.padStart(2, '0');
        }
      }
      
      // Update colors based on working status
      updateFlipClockColors(container);
      return;
    }
    
    // We're using flip digits - handle as before
    // Get all digit elements
    const digitElements = digitsContainer.querySelectorAll('.flip-clock-digit');
    
    // Normalize time format
    const normalizedTime = normalizeTimeFormat(currentTime);
    
    // Update each digit if needed
    for (let i = 0; i < normalizedTime.length; i++) {
      const char = normalizedTime[i];
      if (char === ':') continue;
      
      // Find corresponding digit element
      const index = i - Math.floor(i/3); // Adjust for colons
      const digitElement = digitElements[index];
      
      if (!digitElement) continue;
      
      // Check if digit needs to be updated
      if (digitElement.dataset.digit !== char) {
        // Update the digit
        digitElement.dataset.digit = char;
        
        // Get the flip card
        const flipCard = digitElement.querySelector('.flip-card');
        if (!flipCard) continue;
        
        // Update front and back sides
        const front = flipCard.querySelector('.flip-card-front');
        const back = flipCard.querySelector('.flip-card-back');
        
        if (front && back) {
          front.textContent = char;
          back.textContent = char;
          
          // Perform flip animation
          flipCard.style.transform = 'rotateX(180deg)';
          
          // Reset flip after animation
          setTimeout(() => {
            flipCard.style.transition = 'none';
            flipCard.style.transform = 'rotateX(0deg)';
            setTimeout(() => {
              flipCard.style.transition = 'transform 250ms ease';
            }, 50);
          }, 250);
        }
      }
    }
    
    // Update colors based on working status
    updateFlipClockColors(container);
  }, 1000);
}

// Function to update the work progress bar
function updateWorkProgressBar(container) {
  const progressContainer = container.querySelector('.work-progress-container');
  if (!progressContainer) return;
  
  const progressTrack = progressContainer.querySelector('.work-progress-track');
  const progressFill = progressContainer.querySelector('.work-progress-fill');
  const percentageIndicator = progressContainer.querySelector('.work-progress-percentage');
  
  // Define work hours
  const workStartHour = 10; // 10:00
  const workEndHour = 19;   // 19:00
  const workTotalMinutes = (workEndHour - workStartHour) * 60; // 9 hours = 540 minutes
  
  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  
  // Add current time indicator
  let timeIndicator = progressContainer.querySelector('.current-time-indicator');
  if (!timeIndicator) {
    timeIndicator = document.createElement('div');
    timeIndicator.className = 'current-time-indicator';
    timeIndicator.style.position = 'absolute';
    timeIndicator.style.top = '2px';
    timeIndicator.style.width = '3px';
    timeIndicator.style.height = '12px';
    timeIndicator.style.backgroundColor = '#FF5722';
    timeIndicator.style.zIndex = '2';
    timeIndicator.style.boxShadow = '0 0 4px rgba(255, 87, 34, 0.6)';
    timeIndicator.style.borderRadius = '1.5px';
    timeIndicator.style.transform = 'translateX(-50%)';
    
    const timeLabel = document.createElement('div');
    timeLabel.className = 'current-time-label';
    timeLabel.style.position = 'absolute';
    timeLabel.style.top = '-15px';
    timeLabel.style.fontSize = '10px';
    timeLabel.style.fontWeight = 'bold';
    timeLabel.style.color = '#FF5722';
    timeLabel.style.transform = 'translateX(-50%)';
    timeLabel.style.whiteSpace = 'nowrap';
    timeLabel.style.textShadow = '0 0 2px rgba(255, 255, 255, 0.8)';
    
    timeIndicator.appendChild(timeLabel);
    progressTrack.appendChild(timeIndicator);
  }
  
  // Calculate percentage for time indicator position relative to 24h day
  const currentMinuteOfDay = currentHour * 60 + currentMinute;
  const workdayStart = workStartHour * 60;
  const workdayEnd = workEndHour * 60;
  
  // Calculate where to put the time indicator on the track
  let dailyPercentage;
  if (currentMinuteOfDay < workdayStart) {
    dailyPercentage = 0; // Before workday starts, pin to beginning
  } else if (currentMinuteOfDay > workdayEnd) {
    dailyPercentage = 100; // After workday ends, pin to end
  } else {
    // During workday, calculate the accurate position
    dailyPercentage = ((currentMinuteOfDay - workdayStart) / workTotalMinutes) * 100;
  }
  
  timeIndicator.style.left = `${dailyPercentage}%`;
  
  const timeLabel = timeIndicator.querySelector('.current-time-label');
  timeLabel.textContent = currentTimeStr;
  
  // Update indicator visibility based on whether we're within ±3 hours of the workday
  const isNearWorkday = currentMinuteOfDay >= (workdayStart - 180) && 
                         currentMinuteOfDay <= (workdayEnd + 180);
  timeIndicator.style.opacity = isNearWorkday ? '1' : '0.5';
  
  // Calculate progress
  let progress = 0;
  let progressText = '';
  
  if (currentHour < workStartHour) {
    // Before work hours
    const minutesUntilStart = workdayStart - currentMinuteOfDay;
    const hoursUntil = Math.floor(minutesUntilStart / 60);
    const minsUntil = minutesUntilStart % 60;
    
    progress = 0;
    progressText = `出勤時間まではあと ${currentTimeStr} • ${hoursUntil}h ${minsUntil}m `;
    
    // Update visual cues
    progressFill.style.backgroundColor = 'rgba(120, 130, 140, 0.4)';
    progressFill.style.boxShadow = 'none';
    
  } else if (currentHour >= workEndHour) {
    // After work hours
    const minutesAfterEnd = currentMinuteOfDay - workdayEnd;
    const hoursAfter = Math.floor(minutesAfterEnd / 60);
    const minsAfter = minutesAfterEnd % 60;
    
    progress = 100;
    progressText = `${currentTimeStr} • 定時は (${hoursAfter}h ${minsAfter}m 前)`;
    
    // Update visual cues for completed workday
    progressFill.style.backgroundColor = '#28A745'; // Green when complete
    progressFill.style.boxShadow = '0 0 8px rgba(40, 167, 69, 0.3)';
    
  } else {
    // During work hours
    const minutesSinceStart = currentMinuteOfDay - workdayStart;
    progress = Math.min(100, (minutesSinceStart / workTotalMinutes) * 100);
    
    // Calculate time remaining
    const minutesRemaining = workTotalMinutes - minutesSinceStart;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const minsRemaining = minutesRemaining % 60;
    
    // Calculate percentage with more precision
    const percentage = progress.toFixed(1);
    
    progressText = `${currentTimeStr} • ${percentage}% 経過 • 残り： ${hoursRemaining}h ${minsRemaining}m `;
    
    // Update color based on progress
    if (progress >= 90) {
      progressFill.style.backgroundColor = '#28A745'; // Green when almost complete
      progressFill.style.boxShadow = '0 0 8px rgba(40, 167, 69, 0.3)';
    } else if (progress >= 75) {
      progressFill.style.backgroundColor = '#17a2b8'; // Teal for good progress
      progressFill.style.boxShadow = '0 0 8px rgba(23, 162, 184, 0.3)';
    } else if (progress >= 50) {
      progressFill.style.backgroundColor = '#FFC107'; // Yellow for halfway
      progressFill.style.boxShadow = '0 0 8px rgba(255, 193, 7, 0.3)';
    } else if (progress >= 25) {
      progressFill.style.backgroundColor = '#fd7e14'; // Orange for getting started
      progressFill.style.boxShadow = '0 0 8px rgba(253, 126, 20, 0.3)';
    } else {
      progressFill.style.backgroundColor = 'var(--color-primary)'; // Default blue
      progressFill.style.boxShadow = '0 0 8px rgba(0, 102, 221, 0.3)';
    }
  }
  
  // Animate the progress bar smoothly
  progressFill.style.width = `${progress}%`;
  
  // Update the text indicator
  percentageIndicator.textContent = progressText;
  
  // Visual pulse effect for time indicator
  if (!timeIndicator.dataset.animating) {
    timeIndicator.dataset.animating = 'true';
    
    // Add subtle pulse animation
    const pulseAnimation = () => {
      timeIndicator.animate(
        [
          { boxShadow: '0 0 4px rgba(255, 87, 34, 0.6)' },
          { boxShadow: '0 0 8px rgba(255, 87, 34, 0.8)' },
          { boxShadow: '0 0 4px rgba(255, 87, 34, 0.6)' }
        ],
        {
          duration: 2000,
          iterations: Infinity
        }
      );
    };
    
    pulseAnimation();
  }
}

// Setup the flip clock digits
function setupFlipClockDigits(container, timeString) {
  // Clear existing content
  container.innerHTML = '';
  
  // Normalize time format - ensure it's HH:MM:SS
  const normalizedTime = normalizeTimeFormat(timeString);
  
  // Get current clock style setting
  chrome.storage.sync.get(['clockStyle'], function(result) {
    const clockStyle = result.clockStyle || 'gradient';
    
    // If clockStyle is 'default', create a simple time display without flip digits
    if (clockStyle === 'default') {
      createDefaultTimeDisplay(container, normalizedTime);
      return;
    }
    
    // Otherwise, create digit elements for each character in the time
  for (let i = 0; i < normalizedTime.length; i++) {
    const char = normalizedTime[i];
    
    if (char === ':') {
      // Create colon element with vertical centering
      const colonElement = document.createElement('div');
      colonElement.className = 'colon';
      colonElement.textContent = ':';
      colonElement.style.display = 'flex';
      colonElement.style.alignItems = 'center';
      colonElement.style.justifyContent = 'center';
      colonElement.style.fontSize = '3rem';
      colonElement.style.width = '30px';
      colonElement.style.height = '120px';
      colonElement.style.color = 'var(--color-primary)';
      colonElement.style.fontWeight = 'bold';
      
      // Set position data for seconds toggle
      if (i >= 5) { // Second colon is for seconds
        colonElement.dataset.position = 'seconds-colon';
      }
      
      container.appendChild(colonElement);
    } else {
      // Create digit element with position info
      const digitElement = createFlipDigit(char);
      
      // Set position data for seconds toggle
      if (i >= 6) { // Positions 6-7 are seconds
        digitElement.dataset.position = 'seconds';
      }
      
      // Store index for easier reference
      digitElement.dataset.index = i;
      
      container.appendChild(digitElement);
    }
  }
  });
  
  // Apply any saved settings
  setTimeout(() => applyClockSettings(container.parentElement), 0);
}

// Create a default time display without flip cards
function createDefaultTimeDisplay(container, timeString) {
  const displayElement = document.createElement('div');
  displayElement.className = 'default-time-display';
  displayElement.style.display = 'flex';
  displayElement.style.alignItems = 'center';
  displayElement.style.justifyContent = 'center';
  displayElement.style.fontSize = '3.5rem';
  displayElement.style.fontWeight = 'bold';
  displayElement.style.color = 'var(--color-primary-dark, #0047AB)';
  displayElement.style.fontFamily = 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)';
  displayElement.style.padding = '10px 15px';
  displayElement.style.borderRadius = '8px';
  displayElement.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(240,240,240,0.5))';
  displayElement.style.textShadow = '0 1px 0 rgba(255,255,255,0.8)';
  displayElement.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.1)';
  
  // Create time parts for seconds toggling
  const parts = timeString.split(':');
  const hoursMinutes = document.createElement('span');
  hoursMinutes.textContent = `${parts[0]}:${parts[1]}`;
  displayElement.appendChild(hoursMinutes);
  
  if (parts.length > 2) {
    const colonSeconds = document.createElement('span');
    colonSeconds.textContent = ':';
    colonSeconds.dataset.position = 'seconds-colon';
    displayElement.appendChild(colonSeconds);
    
    const seconds = document.createElement('span');
    seconds.textContent = parts[2];
    seconds.dataset.position = 'seconds';
    displayElement.appendChild(seconds);
  }
  
  container.appendChild(displayElement);
}

// Create a single flip digit element with modern styling
function createFlipDigit(digit) {
  const digitElement = document.createElement('div');
  digitElement.className = 'flip-clock-digit';
  digitElement.dataset.digit = digit;
  
  const flipCard = document.createElement('div');
  flipCard.className = 'flip-card';
  
  const flipCardFront = document.createElement('div');
  flipCardFront.className = 'flip-card-front';
  flipCardFront.textContent = digit;
  
  const flipCardBack = document.createElement('div');
  flipCardBack.className = 'flip-card-back';
  flipCardBack.textContent = digit;
  
  // Default color - will be updated by updateFlipClockColors
  const cardColor = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)';
  
  // Add modern styling directly - 2x larger with gradient
  digitElement.style.position = 'relative';
  digitElement.style.width = '80px'; // 2x larger (was 40px)
  digitElement.style.height = '120px'; // 2x larger (was 60px)
  digitElement.style.margin = '0 4px'; // Scale up margins too
  digitElement.style.perspective = '800px';
  
  flipCard.style.position = 'relative';
  flipCard.style.width = '100%';
  flipCard.style.height = '100%';
  flipCard.style.transformStyle = 'preserve-3d';
  flipCard.style.transition = 'transform 250ms ease';
  
  // Apply common styles to front and back
  flipCardFront.style.position = 'absolute';
  flipCardFront.style.width = '100%';
  flipCardFront.style.height = '100%';
  flipCardFront.style.backfaceVisibility = 'hidden';
  flipCardFront.style.display = 'flex';
  flipCardFront.style.alignItems = 'center';
  flipCardFront.style.justifyContent = 'center';
  flipCardFront.style.background = cardColor;
  flipCardFront.style.color = 'white';
  flipCardFront.style.fontSize = '3.5rem';
  flipCardFront.style.fontWeight = 'bold';
  flipCardFront.style.borderRadius = '8px';
  flipCardFront.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  
  flipCardBack.style.position = 'absolute';
  flipCardBack.style.width = '100%';
  flipCardBack.style.height = '100%';
  flipCardBack.style.backfaceVisibility = 'hidden';
  flipCardBack.style.display = 'flex';
  flipCardBack.style.alignItems = 'center';
  flipCardBack.style.justifyContent = 'center';
  flipCardBack.style.background = cardColor;
  flipCardBack.style.color = 'white';
  flipCardBack.style.fontSize = '3.5rem';
  flipCardBack.style.fontWeight = 'bold';
  flipCardBack.style.transform = 'rotateX(180deg)';
  flipCardBack.style.borderRadius = '8px';
  flipCardBack.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  
  // Append elements
  flipCard.appendChild(flipCardFront);
  flipCard.appendChild(flipCardBack);
  digitElement.appendChild(flipCard);
  
  return digitElement;
}

// Update the flip clock
function updateFlipClock(container, clockElement) {
  // Set up a MutationObserver to watch for status changes
  const workingStatusObserver = new MutationObserver((mutations) => {
    updateFlipClockColors(container);
  });
  
  // Find and observe the working status element
  const workingStatus = document.getElementById('working_status');
  if (workingStatus) {
    workingStatusObserver.observe(workingStatus, { 
      childList: true, 
      characterData: true, 
      subtree: true 
    });
    
    // Also observe parent in case element gets replaced
    if (workingStatus.parentElement) {
      workingStatusObserver.observe(workingStatus.parentElement, { 
        childList: true 
      });
    }
  }
  
  // Initial color update
  updateFlipClockColors(container);
  
  setInterval(() => {
    // Get current time from the original clock element
    const newTime = clockElement.textContent.trim();
    const normalizedNewTime = normalizeTimeFormat(newTime);
    
    // Find the digits container
    const digitsContainer = container.querySelector('.flip-clock-digits-container');
    if (!digitsContainer) return;
    
    // Get existing digits
    const digitElements = digitsContainer.querySelectorAll('.flip-clock-digit');
    
    // Update each digit as needed
    let digitIndex = 0;
    for (let i = 0; i < normalizedNewTime.length; i++) {
      const char = normalizedNewTime[i];
      
      if (char !== ':') {
        const digitElement = digitElements[digitIndex];
        if (!digitElement) continue;
        
        const currentDigit = digitElement.dataset.digit;
        
        // If digit has changed, animate it
        if (currentDigit !== char) {
          // Update digit data attribute
          digitElement.dataset.digit = char;
          
          // Get the flip card
          const flipCard = digitElement.querySelector('.flip-card');
          
          // Update the back face with the new digit
          const flipCardBack = flipCard.querySelector('.flip-card-back');
          flipCardBack.textContent = char;
          
          // Animate the flip
          flipCard.classList.remove('flipping');
          // Trigger reflow
          void flipCard.offsetWidth;
          flipCard.classList.add('flipping');
          
          // After animation completes, reset the card and update front face
          setTimeout(() => {
            flipCard.classList.remove('flipping');
            const flipCardFront = flipCard.querySelector('.flip-card-front');
            flipCardFront.textContent = char;
            // Reset transform
            flipCard.style.transform = 'rotateX(0deg)';
          }, 600);
        }
        
        digitIndex++;
      }
    }
  }, 1000);
}

// New function to determine working status colors and update the clock
function updateFlipClockColors(container) {
  // Get current working status
  const workingStatus = document.getElementById('working_status');
  let cardColor = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)';
  let colonColor = 'var(--color-primary)';
  
  if (workingStatus) {
    const statusText = workingStatus.textContent.trim().toLowerCase();
    if (statusText.includes('勤務中') || statusText.includes('working')) {
      // Working - blue gradient
      cardColor = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)';
      colonColor = '#06F';
    } else if (statusText.includes('退室中') || statusText.includes('未出勤') || statusText.includes('Not Arrived')) {
      // Left - grey gradient
      cardColor = 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
      colonColor = '#6c757d';
    }
  }
  
  // Find the digits container
  const digitsContainer = container.querySelector('.flip-clock-digits-container');
  if (!digitsContainer) return;
  
  // Update digit colors
  const digitElements = digitsContainer.querySelectorAll('.flip-clock-digit');
  digitElements.forEach(digit => {
    const front = digit.querySelector('.flip-card-front');
    const back = digit.querySelector('.flip-card-back');
    
    if (front) front.style.background = cardColor;
    if (back) back.style.background = cardColor;
  });
  
  // Update colon colors
  const colonElements = digitsContainer.querySelectorAll('.colon');
  colonElements.forEach(colon => {
    colon.style.color = colonColor;
  });
}

// Normalize time format to ensure it's HH:MM:SS
function normalizeTimeFormat(timeString) {
  // If it's already in correct format, return it
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // Handle other formats
  const parts = timeString.split(':');
  
  // For HH:MM format, add seconds
  if (parts.length === 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
  }
  
  // For other unexpected formats, return a default time
  return '00:00:00';
}

// Handle messages from popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggleEnhancer') {
    if (message.enabled) {
      document.body.classList.add('jobcan-enhanced');
      fixDuplicateSidemenus();
      enhanceSidemenuBehavior();
      setupHeaderVisibility();
      enhanceManagerNameDisplay();
      setupFlipClock();
    } else {
      document.body.classList.remove('jobcan-enhanced');
    }
  } else if (message.action === 'toggleDarkMode') {
    // Dark mode is a future feature
    console.log('Dark mode toggled:', message.enabled);
  } else if (message.action === 'updateClockSettings') {
    // Check if clock style has changed
    if (message.clockStyle !== undefined) {
      updateClockStyle(message.clockStyle);
    } else {
      // Apply the updated settings
      applyClockSettings();
    }
    
    // Update progress bars if setting changed
    if (message.showProgressBar !== undefined) {
      document.querySelectorAll('.work-progress-container').forEach(container => {
        container.style.display = message.showProgressBar ? 'block' : 'none';
      });
    }
  }
});

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  applyEnhancements();
});

// Apply enhancements even if the page is already loaded
applyEnhancements();

// Re-apply enhancements when the page changes (for SPA support)
const observer = new MutationObserver(function(mutations) {
  // Delay to let the DOM settle
  setTimeout(applyEnhancements, 100);
});

// Start observing the DOM for changes
observer.observe(document.body, { 
  childList: true,
  subtree: true
});

// Jobcan has multiple screens, so listen for URL changes too
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    applyEnhancements();
  }
}).observe(document, {subtree: true, childList: true});

// Convert the man-hour modal to a side panel with date navigation
function convertManHourModalToSidePanel() {
  // Wait for the modal to be in the DOM
  const checkForModal = setInterval(() => {
    const modal = document.getElementById('man-hour-manage-modal');
    if (modal) {
      clearInterval(checkForModal);
      
      // Check if we've already enhanced this modal
      if (modal.dataset.enhanced === 'true') return;
      modal.dataset.enhanced = 'true';
      
      // Get the modal header or create one if it doesn't exist
      let modalHeader = modal.querySelector('.modal-header');
      if (!modalHeader) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          modalHeader = document.createElement('div');
          modalHeader.className = 'modal-header';
          
          // Get the title from the form
          const titleElem = modal.querySelector('form h3, form h4, form .h3, form .h4');
          if (titleElem) {
            const title = document.createElement('h4');
            title.className = 'modal-title';
            title.innerHTML = titleElem.innerHTML;
            modalHeader.appendChild(title);
            titleElem.style.display = 'none';
          }
          
          // Create close button
          const closeBtn = document.createElement('button');
          closeBtn.type = 'button';
          closeBtn.className = 'close';
          closeBtn.setAttribute('data-dismiss', 'modal');
          closeBtn.setAttribute('aria-label', 'Close');
          closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
          modalHeader.appendChild(closeBtn);
          
          // Insert at the top of modal content
          if (modalContent.firstChild) {
            modalContent.insertBefore(modalHeader, modalContent.firstChild);
      } else {
            modalContent.appendChild(modalHeader);
          }
        }
      }
      
      // Create date selector navigation controls
      if (modalHeader) {
        // Find the date input or hidden date field
        const dateInput = modal.querySelector('input[name="time"], input[name="date"], input[type="date"]');
        const dateText = modal.querySelector('.modal-body h3, .modal-body h4, .modal-title');
        let currentDateText = '';
        
        if (dateText) {
          currentDateText = dateText.textContent.trim();
        }
        
        if (dateInput || currentDateText) {
          // Create date selector container
          const dateSelector = document.createElement('div');
          dateSelector.className = 'date-selector';
          
          // Previous day button
          const prevDayBtn = document.createElement('button');
          prevDayBtn.type = 'button';
          prevDayBtn.className = 'date-nav-btn prev-day';
          prevDayBtn.innerHTML = '&laquo; 前日';
          prevDayBtn.addEventListener('click', () => {
            navigateToAdjacentDay(-1);
          });
          
          // Current date display
          const currentDate = document.createElement('span');
          currentDate.className = 'current-date';
          currentDate.textContent = currentDateText;
          
          // Next day button
          const nextDayBtn = document.createElement('button');
          nextDayBtn.type = 'button';
          nextDayBtn.className = 'date-nav-btn next-day';
          nextDayBtn.innerHTML = '翌日 &raquo;';
          nextDayBtn.addEventListener('click', () => {
            navigateToAdjacentDay(1);
          });
          
          // Add all elements to the date selector
          dateSelector.appendChild(prevDayBtn);
          dateSelector.appendChild(currentDate);
          dateSelector.appendChild(nextDayBtn);
          
          // Add date selector to modal header or body
          if (modalHeader.querySelector('.date-selector')) {
            // Already exists, skip
          } else {
            modalHeader.appendChild(dateSelector);
          }
          
          // Function to navigate to adjacent day
          function navigateToAdjacentDay(dayOffset) {
            if (dateInput && dateInput.value) {
              // If we have a timestamp input
              if (dateInput.name === 'time') {
                const timestamp = parseInt(dateInput.value, 10);
                const date = new Date(timestamp * 1000);
                date.setDate(date.getDate() + dayOffset);
                dateInput.value = Math.floor(date.getTime() / 1000);
                
                // Submit the form or trigger navigation
                const form = dateInput.closest('form');
                if (form) {
                  // Look for a date navigation submit button
                  const dateNavBtn = form.querySelector('button[name="date_nav"], input[name="date_nav"]');
                  if (dateNavBtn) {
                    dateNavBtn.click();
                  } else {
                    // Try to find any submit button that might navigate
                    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                    if (submitBtn) {
                      submitBtn.click();
                    } else {
                      form.submit();
                    }
                  }
                }
              }
              // For regular date inputs
              else {
                try {
                  const date = new Date(dateInput.value);
                  date.setDate(date.getDate() + dayOffset);
                  
                  // Format date as YYYY-MM-DD
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  dateInput.value = `${year}-${month}-${day}`;
                  
                  // Submit form or trigger change event
                  dateInput.dispatchEvent(new Event('change', { bubbles: true }));
                  const form = dateInput.closest('form');
                  if (form) {
                    form.submit();
                  }
                } catch (e) {
                  console.error('Error navigating date:', e);
                }
              }
            } 
            // If we don't have a date input, try to find navigation links
            else {
              const prevLink = dayOffset < 0 ? 
                document.querySelector('a[href*="prev"], a[href*="previous"], a.prev, a.previous') : 
                document.querySelector('a[href*="next"], a.next');
              
              if (prevLink) {
                prevLink.click();
              }
            }
          }
        }
      }
    }
  }, 500); // Check every 500ms
}

// Enhance modal title by extracting and reformatting time and date
function enhanceModalTitle() {
  // Wait for the modal title to be in the DOM
  const checkForModalTitle = setInterval(() => {
    const modalTitle = document.getElementById('edit-menu-title');
    if (modalTitle) {
      clearInterval(checkForModalTitle);
      
      // Check if we've already enhanced this title
      if (modalTitle.dataset.enhanced === 'true') return;
      modalTitle.dataset.enhanced = 'true';
      
      // Original title text format: "2025年03月11日(火)実労働時間＝08:51"
      const titleText = modalTitle.textContent;
      
      // Extract date components using regex
      const dateMatch = titleText.match(/(\d{4})年(\d{2})月(\d{2})日\((.)\)/);
      if (!dateMatch) return;
      
      const year = dateMatch[1];
      const month = dateMatch[2];
      const day = dateMatch[3];
      const weekday = dateMatch[4]; // 曜日 (day of week)
      
      // Extract time component
      const timeMatch = titleText.match(/実労働時間＝(\d{2}):(\d{2})/);
      const hours = timeMatch ? timeMatch[1] : '00';
      const minutes = timeMatch ? timeMatch[2] : '00';
      
      // Format date as YYYY/MM/DD(曜日)
      const formattedDate = `${year}/${month}/${day}(${weekday})`;
      
      // Format time as HH:MM
      const formattedTime = `${hours}:${minutes}`;
      
      // Create new container for the formatted display
      const titleContainer = document.createElement('div');
      titleContainer.className = 'enhanced-title-container';
      
      // Create time element
      const timeElement = document.createElement('div');
      timeElement.className = 'enhanced-title-time';
      timeElement.textContent = formattedTime;
      timeElement.dataset.time = formattedTime;
      
      // Create date element
      const dateElement = document.createElement('div');
      dateElement.className = 'enhanced-title-date';
      dateElement.textContent = formattedDate;
      
      // Add elements to container
      titleContainer.appendChild(timeElement);
      titleContainer.appendChild(dateElement);
      
      // Replace the original content
      modalTitle.innerHTML = '';
      modalTitle.appendChild(titleContainer);
      
      // Add the hidden input if it was in the original title
      const hiddenTimeMatch = titleText.match(/value="(\d+)"/);
      if (hiddenTimeMatch) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'hiddenTime';
        hiddenInput.value = hiddenTimeMatch[1];
        modalTitle.appendChild(hiddenInput);
      }
    }
  }, 500); // Check every 500ms
}

// Enhance the select dropdown lists in the man-hour modal with modern styling
function enhanceManHourSelectLists() {
  // Observe DOM changes to detect when new rows are added
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Look for newly added select elements
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const selects = node.querySelectorAll('select');
            selects.forEach(select => {
              if (!select.dataset.enhanced) {
                enhanceSelectElement(select);
              }
            });
          }
        });
      }
    }
  });
  
  // Start observing for select elements
  const checkForTable = setInterval(() => {
    const tableBody = document.querySelector('.man-hour-table-edit');
    if (tableBody) {
      clearInterval(checkForTable);
      
      // Enhance existing selects
      const selects = tableBody.querySelectorAll('select');
      selects.forEach(select => {
        if (!select.dataset.enhanced) {
          enhanceSelectElement(select);
        }
      });
      
      // Observe for future changes
      observer.observe(tableBody, {
        childList: true,
        subtree: true
      });
      
      // Also observe the table for row additions via the addRecord() function
      observer.observe(tableBody.parentElement, {
        childList: true
      });
    }
  }, 500);
  
  // Function to check if the man-hour modal is closing and close any open sidepanels
  const modalObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const modal = document.getElementById('man-hour-manage-modal');
        if (modal && !modal.classList.contains('show')) {
          // Modal is being closed, close the sidepanel if it exists
          const sidepanel = document.querySelector('.select-sidepanel');
          if (sidepanel) {
            sidepanel.classList.remove('open');
            setTimeout(() => {
              sidepanel.remove();
            }, 300); // Wait for the transition to complete
          }
        }
      }
    }
  });
    
  // Start observing the modal
  const checkForModal = setInterval(() => {
    const modal = document.getElementById('man-hour-manage-modal');
    if (modal) {
      clearInterval(checkForModal);
      modalObserver.observe(modal, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }, 500);
}

// Enhance a single select element with custom dropdown functionality and modern styling
function enhanceSelectElement(selectElement) {
  // Mark this element as enhanced
  selectElement.dataset.enhanced = 'true';
  
  // Determine if this is a project or task select based on context
  const isProject = selectElement.id?.includes('project') || 
                    selectElement.name?.includes('project') || 
                    selectElement.closest('td')?.previousElementSibling?.textContent.includes('No');
  
  const isTask = selectElement.id?.includes('task') || 
                 selectElement.name?.includes('task') || 
                 !isProject;
  
  // Create the custom select button with modern styling
  const customSelect = document.createElement('div');
  customSelect.className = 'custom-select-wrapper';
  if (isProject) {
    customSelect.classList.add('project-select');
  } else if (isTask) {
    customSelect.classList.add('task-select');
  }
  
  // Apply modern styling directly
  customSelect.style.position = 'relative';
  customSelect.style.display = 'flex';
  customSelect.style.alignItems = 'center';
  customSelect.style.border = '1px solid #DEE2E6';
  customSelect.style.borderRadius = '0.25rem';
  customSelect.style.backgroundColor = '#f9f9f9';
  customSelect.style.padding = '0.25rem 0.5rem';
  customSelect.style.cursor = 'pointer';
  customSelect.style.transition = 'border-color 150ms ease, box-shadow 150ms ease';
  
  // Create the select display that shows the current selection
  const selectDisplay = document.createElement('div');
  selectDisplay.className = 'select-display';
  selectDisplay.style.flexGrow = '1';
  selectDisplay.style.padding = '0.25rem';
  selectDisplay.style.overflow = 'hidden';
  selectDisplay.style.textOverflow = 'ellipsis';
  selectDisplay.style.whiteSpace = 'nowrap';
  
  // Set initial display text
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  selectDisplay.textContent = selectedOption ? selectedOption.text : isProject ? '(プロジェクト選択)' : '(タスク選択)';
  if (selectedOption && selectedOption.text.trim() === '' || selectedOption && selectedOption.text.includes('選択')) {
    selectDisplay.classList.add('placeholder');
    selectDisplay.style.color = '#6C757D';
  }
  
  // Add dropdown button with modern styling
  const dropdownBtn = document.createElement('span');
  dropdownBtn.className = 'dropdown-btn';
  dropdownBtn.innerHTML = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  dropdownBtn.style.display = 'flex';
  dropdownBtn.style.alignItems = 'center';
  dropdownBtn.style.marginLeft = '0.5rem';
  dropdownBtn.style.color = '#6C757D';
  
  customSelect.appendChild(selectDisplay);
  customSelect.appendChild(dropdownBtn);
  
  // Create sidepanel container with modern styling
  function createSidepanel() {
    // Remove any existing sidepanels
    const existingSidepanel = document.querySelector('.select-sidepanel');
    if (existingSidepanel) {
      existingSidepanel.remove();
    }
    
    // Create a new sidepanel
    const sidepanel = document.createElement('div');
    sidepanel.className = 'select-sidepanel';
    if (isProject) {
      sidepanel.classList.add('project-panel');
    } else if (isTask) {
      sidepanel.classList.add('task-panel');
    }
    
    // Create header for the sidepanel
    const panelHeader = document.createElement('div');
    panelHeader.className = 'sidepanel-header';
    
    const panelTitle = document.createElement('h3');
    panelTitle.textContent = isProject ? 'プロジェクト選択' : 'タスク選択';
    
    panelHeader.appendChild(panelTitle);
    sidepanel.appendChild(panelHeader);
    
    // Add tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    
    // Generate tab categories from option text
    const categories = generateCategories(selectElement);
    
    // Create "All" tab first
    const allTab = document.createElement('div');
    allTab.className = 'tab active';
    allTab.dataset.category = 'all';
    allTab.textContent = 'すべて';
    tabsContainer.appendChild(allTab);
    
    // Create tabs for each category
    categories.forEach(category => {
      const tab = document.createElement('div');
      tab.className = 'tab';
      tab.dataset.category = category.id;
      tab.textContent = category.name;
      tabsContainer.appendChild(tab);
    });
    
    sidepanel.appendChild(tabsContainer);
    
    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // Create options list
    const optionsList = document.createElement('ul');
    optionsList.className = 'options-list';
    
    // Add "no options" message if needed
    if (selectElement.options.length <= 1 || (selectElement.options.length === 1 && selectElement.options[0].value === '')) {
      const noOptions = document.createElement('li');
      noOptions.className = 'no-options';
      noOptions.textContent = isProject ? 'プロジェクトがありません' : 'タスクがありません';
      optionsList.appendChild(noOptions);
        } else {
      // Add all options to the list and assign categories
      for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        
        // Skip empty options or those with no value
        if (!option.value && i > 0) continue;
        
        const optionItem = document.createElement('li');
        optionItem.className = 'option-item';
        optionItem.dataset.value = option.value;
        optionItem.textContent = option.text;
        
        // Assign categories to this option
        const optionCategories = assignOptionToCategories(option.text, categories);
        optionItem.dataset.categories = optionCategories.join(',');
        
        if (option.selected) {
          optionItem.classList.add('selected');
        }
        
        // Handle option selection
        optionItem.addEventListener('click', () => {
          // Update the actual select element
          selectElement.value = option.value;
          
          // Trigger change event on the original select
          const event = new Event('change', { bubbles: true });
          selectElement.dispatchEvent(event);
          
          // Update the display
          selectDisplay.textContent = option.text;
          selectDisplay.classList.remove('placeholder');
          
          // Update the selected item in the list
          const allOptions = optionsList.querySelectorAll('.option-item');
          allOptions.forEach(opt => opt.classList.remove('selected'));
          optionItem.classList.add('selected');
          
          // Don't close the panel, let the user make multiple selections
        });
        
        optionsList.appendChild(optionItem);
      }
    }
    
    optionsContainer.appendChild(optionsList);
    sidepanel.appendChild(optionsContainer);
    
    // Add tab click event listeners
    const tabs = tabsContainer.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Filter options based on selected tab
        const selectedCategory = tab.dataset.category;
        const options = optionsList.querySelectorAll('.option-item');
        
        options.forEach(option => {
          if (selectedCategory === 'all') {
            option.style.display = '';
          } else {
            const optionCategories = option.dataset.categories ? option.dataset.categories.split(',') : [];
            if (optionCategories.includes(selectedCategory)) {
              option.style.display = '';
            } else {
              option.style.display = 'none';
            }
          }
        });
      });
    });
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sidepanel-close';
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    closeBtn.addEventListener('click', () => {
      sidepanel.classList.remove('open');
      setTimeout(() => {
        sidepanel.remove();
      }, 300); // Wait for the transition to complete
    });
    panelHeader.appendChild(closeBtn);
    
    // Add to document body
    document.body.appendChild(sidepanel);
    
    // Position next to the modal
    const modal = document.getElementById('man-hour-manage-modal');
    if (modal) {
      // Calculate position (to the left of the modal)
      const modalRect = modal.getBoundingClientRect();
      sidepanel.style.top = `${modalRect.top}px`;
      sidepanel.style.left = `${modalRect.left - 400}px`; // 400px is the width of the sidepanel
    }
    
    // Show the sidepanel with animation
    setTimeout(() => {
      sidepanel.classList.add('open');
    }, 50);
    
    return sidepanel;
  }
  
  // Handle click on custom select
  customSelect.addEventListener('click', (e) => {
    createSidepanel();
    e.stopPropagation();
  });
  
  // Add hover effect
  customSelect.addEventListener('mouseenter', () => {
    customSelect.style.borderColor = '#4D94E9';
    customSelect.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
  });
  
  customSelect.addEventListener('mouseleave', () => {
    customSelect.style.borderColor = '#DEE2E6';
    customSelect.style.boxShadow = 'none';
  });
  
  // Hide the original select
  selectElement.style.display = 'none';
  
  // Insert the custom select after the original
  selectElement.parentNode.insertBefore(customSelect, selectElement.nextSibling);
}

// Generate categories based on option text patterns
function generateCategories(selectElement) {
  // Count word frequency across all options
  const wordCounts = {};
  const allWords = [];
  
  // Collect all significant words from options
  for (let i = 0; i < selectElement.options.length; i++) {
    const option = selectElement.options[i];
    if (!option.value && i > 0) continue;
    
    // Split by common delimiters and filter out short words
    const words = option.text.split(/[\/\s,、・【】]/g).filter(word => 
      word.length >= 2 && !/^\d+$/.test(word) && !['選択', '未分類'].includes(word)
    );
    
    words.forEach(word => {
      if (!wordCounts[word]) {
        wordCounts[word] = 0;
        allWords.push(word);
      }
      wordCounts[word]++;
    });
  }
  
  // Sort words by frequency
  allWords.sort((a, b) => wordCounts[b] - wordCounts[a]);
  
  // Take the top 10 most frequent words as categories, if they appear at least 2 times
  const categories = allWords
    .filter(word => wordCounts[word] >= 2)
    .slice(0, 10)
    .map((word, index) => ({
      id: `cat_${index}`,
      name: word,
      word: word
    }));
  
  return categories;
}

// Assign an option to categories based on its text
function assignOptionToCategories(optionText, categories) {
  const assignedCategories = [];
  
  categories.forEach(category => {
    if (optionText.includes(category.word)) {
      assignedCategories.push(category.id);
    }
  });
  
  return assignedCategories;
}

// Simplify table headers
function simplifyTableHeaders() {
  // Find man-hour table headers
  const observer = new MutationObserver((mutations) => {
    const headers = document.querySelectorAll('th');
    headers.forEach(header => {
      // Check if this is the 工数(時間) header and hasn't been modified yet
      if (header.textContent === '工数(時間)' && !header.dataset.simplified) {
        header.textContent = '工数';
        header.dataset.simplified = 'true';
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also run immediately
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (header.textContent === '工数(時間)' && !header.dataset.simplified) {
      header.textContent = '工数';
      header.dataset.simplified = 'true';
    }
  });
}

// Enhance the collapseInfo section to make it more compact and user-friendly
function enhanceCollapseInfo() {
  const observer = new MutationObserver(() => {
    const collapseInfo = document.getElementById('collapseInfo');
    if (collapseInfo && !collapseInfo.dataset.enhanced) {
      collapseInfo.dataset.enhanced = 'true';
      
      // Find all tables within the collapseInfo section
      const tables = collapseInfo.querySelectorAll('table');
      
      tables.forEach(table => {
        let hasHiddenRows = false;
        const rows = table.querySelectorAll('tr');
        
        // Check each row to see if it contains zero values
        rows.forEach(row => {
          const valueCell = row.querySelector('td');
          if (valueCell) {
            const value = valueCell.textContent.trim();
            
            // Check if the value is zero or contains only zeros
            if (value === '0' || value === '0.0' || value === '0 日' || value === '0 回' || 
                value === '0時間' || value === '0分' || /^0+$/.test(value.replace(/[^0-9]/g, ''))) {
              // Mark this row to be hidden
              row.classList.add('zero-value-row');
              hasHiddenRows = true;
            }
          }
        });
        
        // If we found rows to hide, add a "Show All" button to the card header
        if (hasHiddenRows) {
          // Find the parent card and its header
          const cardBody = table.closest('.card-body, .jbc-card-body');
          if (!cardBody) return;
          
          const card = cardBody.closest('.card, .jbc-card');
          if (!card) return;
          
          const cardHeader = card.querySelector('.card-header, .jbc-card-header');
          if (!cardHeader) return;
          
          // Hide zero value rows initially
          const zeroValueRows = table.querySelectorAll('.zero-value-row');
          zeroValueRows.forEach(row => {
            row.style.display = 'none';
          });
          
          // Create the toggle button
          const toggleButton = document.createElement('button');
          toggleButton.className = 'toggle-zero-values-btn';
          toggleButton.textContent = '全項目を表示';
          toggleButton.setAttribute('type', 'button');
          
          // Toggle button click handler
          toggleButton.addEventListener('click', () => {
            const isShowing = toggleButton.classList.contains('showing');
            
            if (isShowing) {
              // Hide the zero-value rows
              zeroValueRows.forEach(row => {
                row.style.display = 'none';
              });
              toggleButton.textContent = '全項目を表示';
              toggleButton.classList.remove('showing');
            } else {
              // Show the zero-value rows
              zeroValueRows.forEach(row => {
                row.style.display = 'table-row';
              });
              toggleButton.textContent = '必要項目のみ表示';
              toggleButton.classList.add('showing');
            }
          });
          
          // Add button to card header
          cardHeader.appendChild(toggleButton);
        }
      });
      
      // Make the cards more compact
      const cards = collapseInfo.querySelectorAll('.card, .jbc-card');
      cards.forEach(card => {
        card.classList.add('compact-card');
      });
    }
  });
  
  // Start observing the DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also run immediately if collapseInfo already exists
  const collapseInfo = document.getElementById('collapseInfo');
  if (collapseInfo && !collapseInfo.dataset.enhanced) {
    collapseInfo.dataset.enhanced = 'true';
    
    // Find all tables within the collapseInfo section
    const tables = collapseInfo.querySelectorAll('table');
    
    tables.forEach(table => {
      let hasHiddenRows = false;
      const rows = table.querySelectorAll('tr');
      
      // Check each row to see if it contains zero values
      rows.forEach(row => {
        const valueCell = row.querySelector('td');
        if (valueCell) {
          const value = valueCell.textContent.trim();
          
          // Check if the value is zero or contains only zeros
          if (value === '0' || value === '0.0' || value === '0 日' || value === '0 回' || 
              value === '0時間' || value === '0分' || /^0+$/.test(value.replace(/[^0-9]/g, ''))) {
            // Mark this row to be hidden
            row.classList.add('zero-value-row');
            hasHiddenRows = true;
          }
        }
      });
      
      // If we found rows to hide, add a "Show All" button to the card header
      if (hasHiddenRows) {
        // Find the parent card and its header
        const cardBody = table.closest('.card-body, .jbc-card-body');
        if (!cardBody) return;
        
        const card = cardBody.closest('.card, .jbc-card');
        if (!card) return;
        
        const cardHeader = card.querySelector('.card-header, .jbc-card-header');
        if (!cardHeader) return;
        
        // Hide zero value rows initially
        const zeroValueRows = table.querySelectorAll('.zero-value-row');
        zeroValueRows.forEach(row => {
          row.style.display = 'none';
        });
        
        // Create the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-zero-values-btn';
        toggleButton.textContent = '全項目を表示';
        toggleButton.setAttribute('type', 'button');
        
        // Toggle button click handler
        toggleButton.addEventListener('click', () => {
          const isShowing = toggleButton.classList.contains('showing');
          
          if (isShowing) {
            // Hide the zero-value rows
            zeroValueRows.forEach(row => {
              row.style.display = 'none';
            });
            toggleButton.textContent = '全項目を表示';
            toggleButton.classList.remove('showing');
          } else {
            // Show the zero-value rows
            zeroValueRows.forEach(row => {
              row.style.display = 'table-row';
            });
            toggleButton.textContent = '必要項目のみ表示';
            toggleButton.classList.add('showing');
          }
        });
        
        // Add button to card header
        cardHeader.appendChild(toggleButton);
      }
    });
    
    // Make the cards more compact
    const cards = collapseInfo.querySelectorAll('.card, .jbc-card');
    cards.forEach(card => {
      card.classList.add('compact-card');
    });
  }
}

// Add screenshot capture functionality
function setupScreenshotButton() {
  // Check if button already exists
  if (document.getElementById('screenshot-capture-btn')) {
    return;
  }

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'screenshot-capture-btn';
  buttonContainer.style.position = 'fixed';
  buttonContainer.style.bottom = '20px';
  buttonContainer.style.right = '20px';
  buttonContainer.style.zIndex = '9999';
  buttonContainer.style.cursor = 'pointer';
  buttonContainer.style.background = '#4285f4';
  buttonContainer.style.color = '#fff';
  buttonContainer.style.borderRadius = '50%';
  buttonContainer.style.width = '50px';
  buttonContainer.style.height = '50px';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.alignItems = 'center';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  buttonContainer.style.transition = 'all 0.3s ease';
  buttonContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
  
  // Add tooltip
  buttonContainer.title = 'Capture screenshot';
  
  // Add hover effect
  buttonContainer.onmouseover = function() {
    this.style.transform = 'scale(1.1)';
  };
  buttonContainer.onmouseout = function() {
    this.style.transform = 'scale(1)';
  };
  
  // Add click handler
  buttonContainer.addEventListener('click', initScreenshotCapture);
  
  // Append to body
  document.body.appendChild(buttonContainer);
}

// Initialize screenshot capture
function initScreenshotCapture() {
  // Store scroll position when starting the capture
  const startScrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const startScrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Create overlay for area selection
  const overlay = document.createElement('div');
  overlay.id = 'screenshot-selection-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '2147483646';
  overlay.style.cursor = 'crosshair';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  document.body.appendChild(overlay);
  
  // Create selection area
  const selection = document.createElement('div');
  selection.id = 'screenshot-selection';
  selection.style.position = 'absolute';
  selection.style.border = '2px dashed #fff';
  selection.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
  selection.style.display = 'none';
  
  // Add span for bottom corners (used by CSS)
  const span = document.createElement('span');
  selection.appendChild(span);
  
  overlay.appendChild(selection);
  
  // Variables to track selection
  let startX, startY, isSelecting = false;
  let currentX, currentY;
  
  // Handle mouse down event
  overlay.addEventListener('mousedown', function(e) {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    
    // Position the selection div at the starting point
    selection.style.left = `${startX}px`;
    selection.style.top = `${startY}px`;
    selection.style.width = '0';
    selection.style.height = '0';
    selection.style.display = 'block';
  });
  
  // Handle mouse move event
  overlay.addEventListener('mousemove', function(e) {
    if (!isSelecting) return;
    
    currentX = e.clientX;
    currentY = e.clientY;
    
    // Calculate width and height of selection
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    
    // Determine position based on direction of drag
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    
    // Update selection div dimensions
    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
  });
  
  // Handle mouse up event
  overlay.addEventListener('mouseup', function() {
    if (!isSelecting) return;
    isSelecting = false;
    
    // Check if selection has a reasonable size
    const width = parseInt(selection.style.width);
    const height = parseInt(selection.style.height);
    
    if (width > 10 && height > 10) {
      // Get the area coordinates
      const area = {
        x: parseInt(selection.style.left),
        y: parseInt(selection.style.top),
        w: width,
        h: height,
        scrollX: startScrollX,
        scrollY: startScrollY
      };
      
      // Capture the selected area
      captureScreenshot(area);
    }
    
    // Remove the overlay
    document.body.removeChild(overlay);
  });
  
  // Cancel selection on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.parentNode) {
      document.body.removeChild(overlay);
    }
  }, { once: true });
}

// Capture screenshot of the selected area
function captureScreenshot(area) {
  // Remove the selection overlay before capturing to avoid it being in the screenshot
  const overlay = document.getElementById('screenshot-selection-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  // Get the current scroll position (may have changed since selection started)
  const currentScrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Use html2canvas to capture the screen
  html2canvas(document.body, {
    useCORS: true,
    allowTaint: true,
    foreignObjectRendering: true,
    scale: window.devicePixelRatio,
    // Let html2canvas handle scrolling correctly
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight
  }).then(canvas => {
    // Crop to the selected area
    const croppedCanvas = document.createElement('canvas');
    const ctx = croppedCanvas.getContext('2d');
    
    croppedCanvas.width = area.w;
    croppedCanvas.height = area.h;
    
    // Determine if we're capturing fixed elements or scrollable content
    // Selection was made in viewport coordinates (clientX/Y), which is relative to the current viewport
    // For fixed elements (position:fixed), don't add scroll offset
    // For normal elements, need to account for scroll position
    
    // Get element at center of selection to determine if it's fixed
    const centerX = area.x + (area.w / 2);
    const centerY = area.y + (area.h / 2);
    const elementAtCenter = document.elementFromPoint(centerX, centerY);
    
    // Check if element or its parents have position:fixed
    let isFixed = false;
    let el = elementAtCenter;
    while (el && !isFixed) {
      const position = window.getComputedStyle(el).getPropertyValue('position');
      if (position === 'fixed') {
        isFixed = true;
      }
      el = el.parentElement;
    }
    
    // Calculate crop coordinates based on element type
    let cropX, cropY;
    
    if (isFixed) {
      // For fixed elements, use viewport coordinates directly
      cropX = area.x * window.devicePixelRatio;
      cropY = area.y * window.devicePixelRatio;
    } else {
      // For normal elements, add the scroll position at the time of selection
      cropX = (area.x + area.scrollX) * window.devicePixelRatio;
      cropY = (area.y + area.scrollY) * window.devicePixelRatio;
    }
    
    // Draw the selected portion of the original canvas onto the cropped canvas
    ctx.drawImage(
      canvas, 
      cropX, 
      cropY, 
      area.w * window.devicePixelRatio, 
      area.h * window.devicePixelRatio,
      0, 0, area.w, area.h
    );
    
    // Convert to data URL
    const imageData = croppedCanvas.toDataURL('image/png');
    
    // Copy to clipboard immediately
    croppedCanvas.toBlob(function(blob) {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(
          () => {
            showNotification('スクリーンショットがコピーされました。');
          },
          (err) => {
            console.error('Could not copy to clipboard: ', err);
            showNotification('Could not copy to clipboard. See console for details.');
          }
        );
      } catch (err) {
        console.error('ClipboardItem not supported or other clipboard error: ', err);
        showNotification('Copy to clipboard not supported in this browser.');
      }
    });

    // Show preview with download option
    showScreenshotPreview(imageData);
  });
}

// Show screenshot preview with download option
function showScreenshotPreview(imageData) {
  // Remove existing preview if any
  const existingPreview = document.getElementById('screenshot-preview-container');
  if (existingPreview) {
    existingPreview.remove();
  }
  
  // Create preview container
  const previewContainer = document.createElement('div');
  previewContainer.id = 'screenshot-preview-container';
  
  // Create preview wrapper (for positioning the close button)
  const previewWrapper = document.createElement('div');
  previewWrapper.className = 'preview-wrapper';
  previewWrapper.style.position = 'relative';
  
  // Create image preview
  const previewImage = document.createElement('img');
  previewImage.src = imageData;
  previewImage.alt = 'Screenshot preview';
  previewImage.className = 'screenshot-preview-image';
  
  // Add click event listener to preview image (changed from double-click)
  previewImage.addEventListener('click', () => {
    showFullSizeImage(imageData);
  });
  
  // Create preview close button
  const previewCloseBtn = document.createElement('button');
  previewCloseBtn.className = 'sidepanel-close';
  previewCloseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  previewCloseBtn.title = 'Close preview';
  previewCloseBtn.style.position = 'absolute';
  previewCloseBtn.style.top = '5px';
  previewCloseBtn.style.right = '5px';
  
  // Close button click handler
  previewCloseBtn.addEventListener('click', () => {
    previewContainer.classList.add('closing');
    setTimeout(() => {
      if (previewContainer.parentNode) {
        previewContainer.parentNode.removeChild(previewContainer);
      }
    }, 300);
  });
  
  // Add image and close button to wrapper
  previewWrapper.appendChild(previewImage);
  previewWrapper.appendChild(previewCloseBtn);
  
  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'screenshot-preview-controls';
  
  // Create download button
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'screenshot-preview-btn download-btn';
  downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 保存';
  
  // Download button click handler
  downloadBtn.addEventListener('click', () => {
    // Create filename with timestamp
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `screenshot-${timestamp}.png`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    link.click();
    
    // Show success notification
    showNotification('Screenshot downloaded');
  });
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'screenshot-preview-btn close-btn';
  closeBtn.innerHTML = 'Close';
  
  // Close button click handler
  closeBtn.addEventListener('click', () => {
    previewContainer.classList.add('closing');
    setTimeout(() => {
      if (previewContainer.parentNode) {
        previewContainer.parentNode.removeChild(previewContainer);
      }
    }, 300);
  });
  
  // Add controls to container
  controlsContainer.appendChild(downloadBtn);
  controlsContainer.appendChild(closeBtn);
  
  // Add wrapper and controls to preview container
  previewContainer.appendChild(previewWrapper);
  previewContainer.appendChild(controlsContainer);
  
  // Add preview to body
  document.body.appendChild(previewContainer);
  
  // Position preview above the capture button
  const captureBtn = document.getElementById('screenshot-capture-btn');
  if (captureBtn) {
    const captureBtnRect = captureBtn.getBoundingClientRect();
    
    // Calculate the right position to align with the capture button
    const right = window.innerWidth - captureBtnRect.right;
    previewContainer.style.right = `${right}px`;
    
    // Calculate the bottom position to be above the capture button
    const bottom = window.innerHeight - captureBtnRect.top + 10;
    previewContainer.style.bottom = `${bottom}px`;
  }
  
  // Animate opening
  setTimeout(() => {
    previewContainer.classList.add('open');
  }, 10);
}

// Show full-size image in modal overlay
function showFullSizeImage(imageData) {
  // Remove existing modal if any
  const existingModal = document.getElementById('screenshot-fullsize-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'screenshot-fullsize-modal';
  
  // Create full-size image
  const fullImage = document.createElement('img');
  fullImage.src = imageData;
  fullImage.alt = 'Full size screenshot';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  closeBtn.title = 'Close fullscreen view';
  
  // Create a small hint for keyboard shortcut
  const hint = document.createElement('div');
  hint.className = 'fullsize-hint';
  hint.textContent = 'ESCキーで戻る';
  
  // Close button click handler
  closeBtn.addEventListener('click', () => {
    closeModal();
  });
  
  // Click outside the image to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close modal function
  function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      // Remove the keydown event listener when modal is closed
      document.removeEventListener('keydown', handleKeyDown);
    }, 300);
  }
  
  // Keyboard support - close on Escape key
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyDown);
  
  // Add elements to modal
  modal.appendChild(fullImage);
  modal.appendChild(closeBtn);
  modal.appendChild(hint);
  
  // Add modal to body
  document.body.appendChild(modal);
  
  // Animate opening
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
}

// Show notification after screenshot is taken
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'screenshot-notification';
  notification.textContent = message;
  
  // Style the notification
  notification.style.position = 'fixed';
  notification.style.bottom = '24px';
  notification.style.left = '20px'; // Changed from right to left
  notification.style.backgroundColor = '#4285f4';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.zIndex = '9999';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  // Add to document
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add form screenshot button to modal footer
function addFormScreenshotButton() {
  // Observer to watch for modal footers
  const observer = new MutationObserver((mutations) => {
    // Look for modal footers
    const modalFooters = document.querySelectorAll('.modal-footer, .jbc-modal-footer');
    modalFooters.forEach(footer => {
      // Check if we haven't already enhanced this footer
      if (footer.dataset.enhanced === 'true') return;
      footer.dataset.enhanced = 'true';
      
      // Check if this footer has a save button
      const saveButton = footer.querySelector('#save, button[type="submit"], input[type="submit"]');
      if (!saveButton) return;
      
      // Create screenshot button
      const screenshotBtn = document.createElement('button');
      screenshotBtn.type = 'button';
      screenshotBtn.className = 'btn jbc-btn-secondary form-screenshot-btn';
      screenshotBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> キャプチャ';
      
      // Add click event to capture the form content
      screenshotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find the form element
        const modal = footer.closest('.modal, .modal-content, .jbc-modal');
        let formElement;
        
        if (modal) {
          formElement = modal.querySelector('form');
        }
        
        if (!formElement) {
          formElement = document.getElementById('save-form');
        }
        
        if (!formElement) {
          const forms = document.querySelectorAll('form');
          for (const form of forms) {
            if (form.querySelector('[type="submit"], #save')) {
              formElement = form;
              break;
            }
          }
        }
        
        // Capture screenshot of the form element
        if (formElement) {
          captureElementScreenshot(formElement);
        } else {
          showNotification('フォームの要素が見つかりません');
        }
      });
      
      // Insert screenshot button before save button
      saveButton.parentNode.insertBefore(screenshotBtn, saveButton);
    });
  });
  
  // Start observing for modal footers
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also run immediately for existing modal footers
  const modalFooters = document.querySelectorAll('.modal-footer, .jbc-modal-footer');
  modalFooters.forEach(footer => {
    if (!footer.dataset.enhanced) {
      footer.dataset.enhanced = 'true';
      
      // Check if this footer has a save button
      const saveButton = footer.querySelector('#save, button[type="submit"], input[type="submit"]');
      if (!saveButton) return;
      
      // Create screenshot button
      const screenshotBtn = document.createElement('button');
      screenshotBtn.type = 'button';
      screenshotBtn.className = 'btn jbc-btn-secondary form-screenshot-btn';
      screenshotBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> キャプチャ';
      
      // Add click event to capture the form content
      screenshotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find the form element
        const modal = footer.closest('.modal, .modal-content, .jbc-modal');
        let formElement;
        
        if (modal) {
          formElement = modal.querySelector('form');
        }
        
        if (!formElement) {
          formElement = document.getElementById('save-form');
        }
        
        if (!formElement) {
          const forms = document.querySelectorAll('form');
          for (const form of forms) {
            if (form.querySelector('[type="submit"], #save')) {
              formElement = form;
              break;
            }
          }
        }
        
        // Capture screenshot of the form element
        if (formElement) {
          captureElementScreenshot(formElement);
        } else {
          showNotification('フォームの要素が見つかりません');
        }
      });
      
      // Insert screenshot button before save button
      saveButton.parentNode.insertBefore(screenshotBtn, saveButton);
    }
  });
}

// Capture screenshot of a specific element
function captureElementScreenshot(element) {
  // First, update content and styling to prepare for capture
  const clonedElement = element.cloneNode(true);
  
  // Apply a temporary container to measure actual content height
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.visibility = 'hidden';
  tempContainer.style.width = element.offsetWidth + 'px';
  tempContainer.style.background = '#FFFFFF';
  document.body.appendChild(tempContainer);
  tempContainer.appendChild(clonedElement);
  
  // Clean up and enhance the content before measuring
  cleanupAndEnhanceContent(clonedElement);
  
  // Find all visible content and calculate actual content height
  const visibleElements = clonedElement.querySelectorAll('*');
  let minTop = Infinity;
  let maxBottom = 0;
  
  visibleElements.forEach(el => {
    // Skip hidden elements
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    
    const rect = el.getBoundingClientRect();
    if (rect.height > 0 && rect.width > 0) {
      minTop = Math.min(minTop, rect.top);
      maxBottom = Math.max(maxBottom, rect.bottom);
    }
  });
  
  // Calculate actual height needed
  const actualHeight = maxBottom - minTop;
  
  // Clean up the temporary measurement container
  document.body.removeChild(tempContainer);
  
  // Create the final container for the capture
  const captureContainer = document.createElement('div');
  captureContainer.style.position = 'absolute';
  captureContainer.style.left = '-9999px';
  captureContainer.style.top = '0';
  captureContainer.style.width = element.offsetWidth + 'px';
  captureContainer.style.height = 'auto'; // Auto height to hug content
  captureContainer.style.background = '#FFFFFF';
  captureContainer.style.overflow = 'hidden';
  document.body.appendChild(captureContainer);
  
  // Create a new clone for actual capture
  const finalElement = element.cloneNode(true);
  captureContainer.appendChild(finalElement);
  
  // Enhance the content
  cleanupAndEnhanceContent(finalElement);
  
  // Create a loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '50%';
  loadingIndicator.style.left = '50%';
  loadingIndicator.style.transform = 'translate(-50%, -50%)';
  loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  loadingIndicator.style.color = 'white';
  loadingIndicator.style.padding = '10px 20px';
  loadingIndicator.style.borderRadius = '5px';
  loadingIndicator.style.zIndex = '9999999';
  loadingIndicator.textContent = 'キャプチャ中...';
  document.body.appendChild(loadingIndicator);
  
  // Use html2canvas for capture
  html2canvas(finalElement, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFFFFF',
    scale: window.devicePixelRatio,
    height: actualHeight > 0 ? actualHeight : null, // Use actual height if calculated
    windowHeight: actualHeight > 0 ? actualHeight : null,
    logging: false,
    onclone: function(clonedDoc) {
      // Additional last-minute adjustments if needed
      const clonedElement = clonedDoc.body.querySelector('*');
      if (clonedElement) {
        // Ensure the cloned element fits snugly
        clonedElement.style.height = 'auto';
        clonedElement.style.overflow = 'visible';
      }
    }
  }).then(canvas => {
    // Remove temporary elements
    document.body.removeChild(captureContainer);
    document.body.removeChild(loadingIndicator);
    
    // Convert to data URL
    const imageData = canvas.toDataURL('image/png');
    
    // Copy to clipboard
    canvas.toBlob(function(blob) {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(
          () => {
            showNotification('スクリーンショットがコピーされました。');
          },
          (err) => {
            console.error('Could not copy to clipboard: ', err);
            showNotification('Could not copy to clipboard. See console for details.');
          }
        );
      } catch (err) {
        console.error('ClipboardItem not supported or other clipboard error: ', err);
        showNotification('Copy to clipboard not supported in this browser.');
      }
    });
    
    // Show preview with download option
    showScreenshotPreview(imageData);
  })
  .catch(error => {
    console.error('Screenshot capture failed:', error);
    document.body.removeChild(captureContainer);
    document.body.removeChild(loadingIndicator);
    showNotification('キャプチャに失敗しました');
  });
}

// Function to clean up and enhance form content before capture
function cleanupAndEnhanceContent(element) {
  // Set solid white background
  element.style.backgroundColor = '#FFFFFF';
  
  // Remove any padding or margin at the bottom of the form
  if (element.tagName === 'FORM') {
    element.style.marginBottom = '0';
    element.style.paddingBottom = '0';
  }
  
  // Find the last row or element in the form and remove any bottom margin/padding
  const formRows = element.querySelectorAll('tr, .form-group, .row');
  if (formRows.length > 0) {
    const lastRow = formRows[formRows.length - 1];
    lastRow.style.marginBottom = '0';
    lastRow.style.paddingBottom = '0';
  }
  
  // 1. Remove modal footer with buttons
  const modalFooter = element.querySelector('.modal-footer, .jbc-modal-footer');
  if (modalFooter) {
    modalFooter.remove();
  }
  
  // 2. Remove template selection dropdown - More comprehensive selectors
  const templateSelectors = [
    '.template-select', 
    '[name="template_id"]', 
    'select[id*="template"]', 
    '.kantan-input-config', 
    '#template_group_input',
    '.template-dropdown',
    '.select-template',
    'select[name*="template"]',
    'div[id*="template"]',
    'tr:has(select[name*="template"])',
    'tr:has(td:contains("工数かんたん入力設定"))',
    '.form-group:has(label:contains("テンプレート"))',
    '.template-container'
  ];
  
  // Try to find template elements using the selectors
  for (const selector of templateSelectors) {
    try {
      const templateElements = element.querySelectorAll(selector);
      templateElements.forEach(el => {
        const row = el.closest('tr, .form-group, .row');
        if (row) {
          row.remove();
        } else {
          el.remove();
        }
      });
    } catch (e) {
      // Some complex CSS selectors might not be supported, ignore errors
      console.log('Selector error:', e);
    }
  }
  
  // Also specifically look for text content containing template-related keywords
  const allRows = element.querySelectorAll('tr, .form-group, .row');
  allRows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes('テンプレート') || 
        text.includes('かんたん入力') || 
        text.includes('template') || 
        text.includes('工数かんたん入力設定')) {
      row.remove();
    }
  });
  
  // 3. Remove close button (×)
  const closeButtons = element.querySelectorAll('.close, [data-dismiss="modal"], button.sidepanel-close');
  closeButtons.forEach(btn => btn.remove());
  
  // 4. Find and enhance the table
  const table = element.querySelector('table');
  if (table) {
    // Set table styles
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.backgroundColor = '#FFFFFF';
    table.style.borderRadius = '8px';
    table.style.overflow = 'hidden';
    
    // Find the column index for "追加・削除" column
    let actionColumnIndex = -1;
    const headerCells = table.querySelectorAll('thead th, tr:first-child th');
    headerCells.forEach((cell, index) => {
      if (cell.textContent.includes('追加') || 
          cell.textContent.includes('削除') || 
          cell.innerHTML.includes('plus') || 
          cell.innerHTML.includes('minus') ||
          cell.innerHTML.includes('trash')) {
        actionColumnIndex = index;
      }
      
      // Style header cells
      cell.style.padding = '10px';
      cell.style.borderBottom = '2px solid #E0E0E0';
      cell.style.textAlign = 'left';
      cell.style.fontSize = '14px';
      
      // Highlight specific columns
      if (cell.textContent.includes('プロジェクト')) {
        cell.style.fontWeight = 'bold';
        cell.style.maxWidth = '220px';
      } else if (cell.textContent.includes('タスク')) {
        cell.style.fontWeight = 'bold';
        cell.style.maxWidth = '100px';
      } else if (cell.textContent.includes('工数')) {
        cell.style.fontWeight = 'bold';
      }
    });
    
    // Process all rows
    const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
    rows.forEach(row => {
      // Remove rows with no data
      let hasData = false;
      const inputElements = row.querySelectorAll('input, select, textarea');
      inputElements.forEach(input => {
        if (input.value && input.value.trim() !== '') {
          hasData = true;
        }
        
        // Check custom dropdown content too
        const nextElement = input.nextElementSibling;
        if (nextElement && nextElement.classList.contains('custom-select-wrapper')) {
          const selectDisplay = nextElement.querySelector('.select-display');
          if (selectDisplay && selectDisplay.textContent && 
              selectDisplay.textContent.trim() !== '' && 
              !selectDisplay.textContent.includes('(未選択)') && 
              !selectDisplay.textContent.includes('選択)')) {
            hasData = true;
          }
        }
      });
      
      // Also check for text content in cells
      const dataCells = row.querySelectorAll('td');
      dataCells.forEach(cell => {
        if (cell.textContent.trim() !== '' && 
            !cell.querySelector('button, .btn') && 
            !cell.innerHTML.includes('plus') && 
            !cell.innerHTML.includes('minus') &&
            !cell.innerHTML.includes('trash')) {
          hasData = true;
        }
        
        // Check if this is a "new" row, which should always be kept
        if (cell.textContent.includes('new')) {
          hasData = true;
        }
      });
      
      // Special handling for new rows - check if this row has "new" in any of its content
      if (row.textContent.includes('new')) {
        hasData = true;
      }
      
      if (!hasData) {
        row.remove();
        return;
      }
      
      // Process each cell in the row
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        // Remove action column cells
        if (cellIndex === actionColumnIndex) {
          cell.remove();
          return;
        }
        
        // Style data cells
        cell.style.padding = '8px 10px';
        cell.style.borderBottom = '1px solid #E0E0E0';
        cell.style.fontSize = '14px';
        
        // Process interactive elements in cells
        convertInteractiveElements(cell);
      });
    });
    
    // If we identified an action column, remove it completely from the table
    if (actionColumnIndex >= 0) {
      // Remove the header cell
      if (headerCells[actionColumnIndex]) {
        headerCells[actionColumnIndex].remove();
      }
      
      // Adjust colspan of any cells that might span across all columns
      const fullRowCells = table.querySelectorAll('td[colspan], th[colspan]');
      fullRowCells.forEach(cell => {
        const currentColspan = parseInt(cell.getAttribute('colspan'), 10);
        if (!isNaN(currentColspan) && currentColspan > 1) {
          cell.setAttribute('colspan', (currentColspan - 1).toString());
        }
      });
    }
  }
  
  // 5. Enhance title container - Handle more container types
  const possibleTitleSelectors = [
    '#edit-menu-title', 
    '.enhanced-title-container', 
    '.modal-title',
    '.jbc-modal-title',
    'h4.title',
    '.sidepanel-header h4',
    '.man-hour-title',
    '.modal-header h4',
    '.modal-header h3',
    '.panel-heading'
  ];
  
  // Try each selector until we find a title container
  let titleContainer = null;
  for (const selector of possibleTitleSelectors) {
    titleContainer = element.querySelector(selector);
    if (titleContainer) break;
  }
  
  // If we still don't have a title container, try to find one based on content
  if (!titleContainer) {
    const allHeadings = element.querySelectorAll('h3, h4, .header, .title');
    for (const heading of allHeadings) {
      if (heading.textContent.includes('日') && 
         (heading.textContent.includes('年') || heading.textContent.includes('月'))) {
        titleContainer = heading;
        break;
      }
    }
  }
  
  if (titleContainer) {
    enhanceTitle(titleContainer);
  }
}

// Function to convert interactive elements to plain text
function convertInteractiveElements(container) {
  // Convert select elements to plain text
  const selects = container.querySelectorAll('select');
  selects.forEach(select => {
    const selectedOption = select.options[select.selectedIndex];
    let text = selectedOption ? selectedOption.text : '';
    
    // Check if there's a custom-select-wrapper next to this select
    const customSelect = select.nextElementSibling;
    if (customSelect && customSelect.classList.contains('custom-select-wrapper')) {
      // Get text from the select display instead (it might have more up-to-date value)
      const selectDisplay = customSelect.querySelector('.select-display');
      if (selectDisplay && selectDisplay.textContent && 
          selectDisplay.textContent.trim() !== '' && 
          !selectDisplay.textContent.includes('(未選択)') && 
          !selectDisplay.textContent.includes('選択)')) {
        text = selectDisplay.textContent;
      }
      // Remove the custom-select-wrapper after getting its value
      customSelect.remove();
    }
    
    if (text && text.trim() !== '') {
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      textSpan.style.padding = '2px 0';
      textSpan.style.display = 'block';
      
      // Handle project cell specifically
      if (select.name && (select.name.includes('project') || select.id && select.id.includes('project'))) {
        textSpan.style.fontWeight = '500';
        textSpan.style.maxWidth = '220px';
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap';
      }
      
      // Handle task cell specifically
      if (select.name && (select.name.includes('task') || select.id && select.id.includes('task'))) {
        textSpan.style.maxWidth = '110px';
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap';
      }
      
      select.parentNode.insertBefore(textSpan, select);
    }
    
    select.style.display = 'none';
  });
  
  // Also handle any custom-select-wrappers that don't have a select element
  const standaloneCustomSelects = container.querySelectorAll('.custom-select-wrapper');
  standaloneCustomSelects.forEach(customSelect => {
    const selectDisplay = customSelect.querySelector('.select-display');
    if (selectDisplay && selectDisplay.textContent && 
        selectDisplay.textContent.trim() !== '' && 
        !selectDisplay.textContent.includes('(未選択)') && 
        !selectDisplay.textContent.includes('選択)')) {
      
      const text = selectDisplay.textContent;
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      textSpan.style.padding = '2px 0';
      textSpan.style.display = 'block';
      
      // Apply specific styling based on the custom select class
      if (customSelect.classList.contains('project-select')) {
        textSpan.style.fontWeight = '500';
        textSpan.style.maxWidth = '220px';
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap';
      } else if (customSelect.classList.contains('task-select')) {
        textSpan.style.maxWidth = '110px';
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap';
      }
      
      customSelect.parentNode.insertBefore(textSpan, customSelect);
    }
    
    customSelect.style.display = 'none';
  });
  
  // Convert input elements to plain text
  const inputs = container.querySelectorAll('input:not([type="hidden"])');
  inputs.forEach(input => {
    if (input.type === 'text' || input.type === 'number') {
      const text = input.value;
      if (text) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        textSpan.style.padding = '2px 0';
        textSpan.style.display = 'block';
        
        // Special formatting for time/number inputs
        if (input.name && (input.name.includes('time') || input.name.includes('hour'))) {
          textSpan.style.fontWeight = '500';
        }
        
        input.parentNode.insertBefore(textSpan, input);
      }
      input.style.display = 'none';
    }
  });
  
  // Hide buttons
  const buttons = container.querySelectorAll('button, .btn, [type="button"], [type="submit"]');
  buttons.forEach(button => {
    button.style.display = 'none';
  });
  
  // Hide custom dropdown elements that haven't been processed yet
  const customDropdowns = container.querySelectorAll('.dropdown-btn');
  customDropdowns.forEach(dropdown => {
    dropdown.style.display = 'none';
  });
}

// Function to enhance the title presentation
function enhanceTitle(titleContainer) {
  // Extract date and time info if this is the original title element
  let timeText = '';
  let dateText = '';
  
  if (titleContainer.classList.contains('enhanced-title-container')) {
    // Already enhanced, get data from children
    const timeElement = titleContainer.querySelector('.enhanced-title-time');
    const dateElement = titleContainer.querySelector('.enhanced-title-date');
    
    if (timeElement) timeText = timeElement.textContent.trim();
    if (dateElement) dateText = dateElement.textContent.trim();
  } else {
    // Extract from original title text
    const titleText = titleContainer.textContent.trim();
    
    // Extract date components using regex
    const dateMatch = titleText.match(/(\d{4})年(\d{2})月(\d{2})日\((.)\)/);
    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2];
      const day = dateMatch[3];
      const weekday = dateMatch[4]; // 曜日 (day of week)
      
      // Format date as YYYY/MM/DD(曜日)
      dateText = `${year}/${month}/${day}(${weekday})`;
    }
    
    // Extract time component - try different patterns
    const timePatterns = [
      /実労働時間＝(\d{2}):(\d{2})/,
      /労働時間.*?(\d{1,2}):(\d{2})/,
      /(\d{1,2}):(\d{2}).*?時間/,
      /(\d{1,2}):(\d{2})/
    ];
    
    for (const pattern of timePatterns) {
      const timeMatch = titleText.match(pattern);
      if (timeMatch) {
        const hours = timeMatch[1].padStart(2, '0');
        const minutes = timeMatch[2];
        timeText = `${hours}:${minutes}`;
        break;
      }
    }
  }
  
  // Clone the original title container before modifying it (to preserve original text)
  const originalTitle = titleContainer.cloneNode(true);
  originalTitle.style.display = 'none';
  titleContainer.parentNode.insertBefore(originalTitle, titleContainer);
  
  // Clear existing content
  titleContainer.innerHTML = '';
  titleContainer.style.width = '100%';
  
  // Create new container with horizontal layout
  const newTitleContainer = document.createElement('div');
  newTitleContainer.style.display = 'flex';
  newTitleContainer.style.alignItems = 'center';
  newTitleContainer.style.justifyContent = 'center';
  newTitleContainer.style.padding = '10px';
  newTitleContainer.style.backgroundColor = '#FFFFFF';
  newTitleContainer.style.margin = '0'; // Removed bottom margin
  
  // If we couldn't extract time/date, use the original title text
  if (!timeText && !dateText) {
    const originalText = originalTitle.textContent.trim();
    if (originalText) {
      const titleSpan = document.createElement('div');
      titleSpan.textContent = originalText;
      titleSpan.style.fontSize = '16px';
      titleSpan.style.fontWeight = 'bold';
      titleSpan.style.color = '#333333';
      newTitleContainer.appendChild(titleSpan);
    }
  } else {
    // Create time element
    if (timeText) {
      const timeElement = document.createElement('div');
      timeElement.textContent = timeText;
      timeElement.style.fontSize = '24px';
      timeElement.style.fontWeight = 'bold';
      timeElement.style.color = '#4285f4';
      timeElement.style.margin = '0 10px';
      newTitleContainer.appendChild(timeElement);
    }
    
    // Create date element
    if (dateText) {
      const dateElement = document.createElement('div');
      dateElement.textContent = dateText;
      dateElement.style.fontSize = '14px';
      dateElement.style.color = '#5f6368';
      dateElement.style.margin = '0 10px';
      newTitleContainer.appendChild(dateElement);
    }
  }
  
  // Add the new container to the original title container
  titleContainer.appendChild(newTitleContainer);
}

// Monitor and preserve the un-match-time element visibility
function monitorUnmatchTime() {
  // Find the un-match-time element
  const unmatchTimeElement = document.getElementById('un-match-time');
  if (!unmatchTimeElement) return;

  // Store the original content and state
  let originalContent = unmatchTimeElement.innerHTML;
  let isUnmatched = originalContent.trim() !== '';

  // Apply enhanced styling
  if (isUnmatched) {
    unmatchTimeElement.classList.add('enhanced-warning');
  }

  // Function to check and restore content if needed
  const checkAndRestoreContent = () => {
    // If it was unmatched before and now empty, restore it
    if (isUnmatched && unmatchTimeElement.innerHTML.trim() === '') {
      unmatchTimeElement.innerHTML = originalContent;
    }
    // If it has new content, update our reference
    else if (unmatchTimeElement.innerHTML.trim() !== '' && unmatchTimeElement.innerHTML !== originalContent) {
      originalContent = unmatchTimeElement.innerHTML;
      isUnmatched = true;
      unmatchTimeElement.classList.add('enhanced-warning');
    }
  };

  // Monitor inputs and changes
  document.addEventListener('change', (event) => {
    if (event.target && 
       (event.target.name && (event.target.name.includes('man-hour') || event.target.name.includes('manhour')) ||
        event.target.classList.contains('man-hour-input'))) {
      // When man-hour input changes, check if we need to restore the warning
      setTimeout(checkAndRestoreContent, 100);
    }
  });

  // Monitor form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form && (form.action.includes('man-hour') || form.action.includes('manhour'))) {
      // After form submission, restore the warning if needed
      setTimeout(checkAndRestoreContent, 500);
    }
  });

  // Monitor clicks on any buttons
  document.addEventListener('click', (event) => {
    const isButton = 
      event.target.tagName === 'BUTTON' ||
      (event.target.tagName === 'INPUT' && (event.target.type === 'submit' || event.target.type === 'button')) ||
      event.target.classList.contains('btn') ||
      event.target.closest('button') || 
      event.target.closest('input[type="submit"]') ||
      event.target.closest('input[type="button"]');
    
    if (isButton) {
      // After button click, check if we need to restore the warning
      setTimeout(checkAndRestoreContent, 300);
    }
  });

  // Simple mutation observer to watch for direct changes to the element
  const observer = new MutationObserver(() => {
    setTimeout(checkAndRestoreContent, 0);
  });

  // Watch the un-match-time element itself
  observer.observe(unmatchTimeElement, {
    characterData: true,
    childList: true,
    subtree: true
  });

  // Watch for any man-hour-input changes in the document
  const docObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.target.classList && 
          (mutation.target.classList.contains('man-hour-input') || 
           mutation.target.closest('.man-hour-input'))) {
        setTimeout(checkAndRestoreContent, 100);
      }
    }
  });

  // Observe document for man-hour-input changes
  docObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['value'],
    subtree: true
  });

  // Simple periodic check as a fallback
  setInterval(checkAndRestoreContent, 2000);
}

// Fix settings icon SVG
function fixSettingsIcon() {
  // First, fix any existing settings buttons
  const fixSettingsButtons = () => {
    const settingsButtons = document.querySelectorAll('.staff-settings-btn');
    
    settingsButtons.forEach(button => {
      // Skip if already enhanced
      if (button.hasAttribute('data-enhanced')) return;
      
      // Mark as enhanced
      button.setAttribute('data-enhanced', 'true');
      
      // Keep the original button's appearance and behavior instead of replacing it with a circular button
      // Just enhance it with the original functionality
      
      // Get the original href
      const originalHref = button.getAttribute('href');
      
      // Get the original title
      const originalTitle = button.getAttribute('title') || '設定';
      
      // Update the button text if it's empty
      if (!button.textContent.trim()) {
        button.textContent = originalTitle;
      }
    });
  };
  
  // Fix existing buttons first
  fixSettingsButtons();
  
  // Set up a MutationObserver to watch for new buttons
  const observer = new MutationObserver((mutations) => {
    let shouldFix = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // Check if any added nodes contain our target elements
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (
              node.classList?.contains('staff-settings-btn') || 
              node.querySelector?.('.staff-settings-btn')
            )) {
            shouldFix = true;
          }
        });
      }
    });
    
    if (shouldFix) {
      fixSettingsButtons();
    }
  });
  
  // Start observing the document body for DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also run a periodic check to catch any elements that might have been missed
  setInterval(fixSettingsButtons, 2000);
}

// Function to make sign-in-right-container folded by default with toggle button
function foldSignInRightContainer() {
  const container = document.querySelector('.col-sm-6.sign-in-right-container');
  if (!container || container.dataset.enhanced) return;
  
  // Mark as enhanced to prevent duplicate processing
  container.dataset.enhanced = 'true';
  
  // Ensure the parent element is positioned relative for absolute positioning of the toggle button
  const parentElem = container.parentNode;
  if (parentElem && getComputedStyle(parentElem).position === 'static') {
    parentElem.style.position = 'relative';
  }
  
  // Hide the container initially
  container.style.display = 'none';

  // Hide the sign-in-bg element
  const signInBg = document.querySelector('.sign-in-bg');
  if (signInBg) {
    signInBg.style.display = 'none';
  }
  
  // Update container styling
  container.style.backgroundColor = 'white';
  container.style.display = 'none';
  container.style.textAlign = 'center';
  container.style.borderRadius = '12px';
  container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  container.style.position = 'relative';
  container.style.padding = '20px';
  
  // Center all inner content using flexbox
  container.style.display = 'none'; // Keep initially hidden
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  
  // Apply center alignment to all direct children
  Array.from(container.children).forEach(child => {
    if (child.style) {
      child.style.margin = '0 auto';
      child.style.maxWidth = '100%';
      
      // If the child is a container itself, center its contents too
      if (child.children && child.children.length > 0) {
        child.style.display = 'flex';
        child.style.flexDirection = 'column';
        child.style.alignItems = 'center';
        child.style.justifyContent = 'center';
      }
    }
  });
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'sign-in-toggle-btn';
  toggleButton.textContent = '広告を表示';
  toggleButton.setAttribute('type', 'button');
  toggleButton.style.cssText = 'margin: 4px auto; display: block; padding: 1px 6px; background-color: white; color: #aaa; border: 1px solid #ddd; border-radius: 10px; cursor: pointer; font-size: 10px; opacity: 0.6; transition: all 0.2s ease; height: 18px; line-height: 1;';
  // Ensure the button is on top
  toggleButton.style.zIndex = '1000';
  
  // Add hover effect
  toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.opacity = '0.9';
  });
  
  toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.opacity = '0.6';
  });
  
  // Add button click handler
  toggleButton.addEventListener('click', () => {
    const isShowing = container.style.display !== 'none';
    
    if (isShowing) {
      // Hide the container
      container.style.display = 'none';
      
      // Restore the regular button
      toggleButton.textContent = '広告を表示';
      toggleButton.style.position = 'absolute';
      toggleButton.style.top = '0';
      toggleButton.style.right = '0';
      toggleButton.style.margin = '4px';
      toggleButton.style.display = 'block';
      toggleButton.style.padding = '1px 6px';
      toggleButton.style.borderRadius = '10px';
      toggleButton.style.fontSize = '10px';
      toggleButton.style.opacity = '0.6';
      toggleButton.style.width = 'auto';
      toggleButton.style.height = '18px';
      toggleButton.style.lineHeight = '1';
      toggleButton.style.backgroundColor = 'white';
      toggleButton.style.color = '#aaa';
      toggleButton.style.border = '1px solid #ddd';
      toggleButton.style.zIndex = '1000';
      
      // Move button before container
      container.parentNode.insertBefore(toggleButton, container);
    } else {
      // Show the container
      container.style.display = 'flex'; // Use flex display when showing
      
      // Change button to round close button at top right
      toggleButton.textContent = '×';
      toggleButton.style.position = 'absolute';
      toggleButton.style.top = '10px';
      toggleButton.style.right = '10px';
      toggleButton.style.margin = '0';
      toggleButton.style.padding = '0';
      toggleButton.style.width = '24px';
      toggleButton.style.height = '24px';
      toggleButton.style.borderRadius = '50%';
      toggleButton.style.display = 'flex';
      toggleButton.style.alignItems = 'center';
      toggleButton.style.justifyContent = 'center';
      toggleButton.style.fontSize = '16px';
      toggleButton.style.lineHeight = '1';
      toggleButton.style.fontWeight = 'bold';
      toggleButton.style.zIndex = '1000';
      
      // Move button inside container
      container.appendChild(toggleButton);
    }
  });
  
  // Position button at top right initially
  toggleButton.style.position = 'absolute';
  toggleButton.style.top = '0';
  toggleButton.style.right = '0';
  toggleButton.style.margin = '4px';
  toggleButton.style.zIndex = '1000';
  
  // Insert button before the container
  container.parentNode.insertBefore(toggleButton, container);
}

// Apply clock settings to all flip clocks
function applyClockSettings(specificContainer = null) {
  chrome.storage.sync.get(['clockStyle', 'clockSize', 'showSeconds', 'showProgressBar'], function(result) {
    const clockStyle = result.clockStyle || 'gradient';
    const clockSize = result.clockSize || 'medium';
    const showSeconds = result.showSeconds !== false; // Default to true
    const showProgressBar = result.showProgressBar !== false; // Default to true
    
    // Get all flip clock containers or just the specific one
    const containers = specificContainer ? 
      [specificContainer] : 
      document.querySelectorAll('.flip-clock-container');
    
    containers.forEach(container => {
      // Handle default style (non-flip) separately
      const defaultDisplay = container.querySelector('.default-time-display');
      if (defaultDisplay) {
        // Apply size to default display
        const fontSize = clockSize === 'small' ? '2.5rem' : clockSize === 'large' ? '4.5rem' : '3.5rem';
        defaultDisplay.style.fontSize = fontSize;
        
        // Apply seconds visibility to default display
        const secondsElement = defaultDisplay.querySelector('span[data-position="seconds"]');
        const secondsColon = defaultDisplay.querySelector('span[data-position="seconds-colon"]');
        
        if (secondsElement) {
          secondsElement.style.display = showSeconds ? 'inline' : 'none';
        }
        if (secondsColon) {
          secondsColon.style.display = showSeconds ? 'inline' : 'none';
        }
        
        return; // Skip the rest since we're using default display
      }
      
      // For flip clock styles
      const digitElements = container.querySelectorAll('.flip-clock-digit');
      digitElements.forEach(digit => {
        const front = digit.querySelector('.flip-card-front');
        const back = digit.querySelector('.flip-card-back');
        
        if (!front || !back) return;
        
        // Reset all style-specific classes
        digit.classList.remove('style-gradient', 'style-flat', 'style-modern');
        digit.classList.add(`style-${clockStyle}`);
        
        // Apply specific styles based on clockStyle
        if (clockStyle === 'gradient') {
          front.style.background = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)';
          back.style.background = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)';
          front.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          back.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        } else if (clockStyle === 'flat') {
          front.style.background = 'var(--color-primary)';
          back.style.background = 'var(--color-primary)';
          front.style.boxShadow = 'none';
          back.style.boxShadow = 'none';
        }
        
        // Apply size
        digit.style.width = clockSize === 'small' ? '60px' : clockSize === 'large' ? '100px' : '80px';
        digit.style.height = clockSize === 'small' ? '90px' : clockSize === 'large' ? '150px' : '120px';
        
        // Adjust font size based on size
        const fontSize = clockSize === 'small' ? '2.5rem' : clockSize === 'large' ? '4.5rem' : '3.5rem';
        front.style.fontSize = fontSize;
        back.style.fontSize = fontSize;
        
        // Apply seconds visibility
        const isSecondDigit = digit.dataset.position === 'seconds' || 
                            Number(digit.dataset.index) >= 6; // Seconds are at positions 6-7
        
        if (isSecondDigit) {
          digit.style.display = showSeconds ? '' : 'none';
          // Also hide the seconds colon
          const prevElement = digit.previousElementSibling;
          if (prevElement && prevElement.classList.contains('colon') && prevElement.dataset.position === 'seconds-colon') {
            prevElement.style.display = showSeconds ? '' : 'none';
          }
        }
      });
      
      // Also update colons based on size
      const colons = container.querySelectorAll('.colon');
      colons.forEach(colon => {
        colon.style.height = clockSize === 'small' ? '90px' : clockSize === 'large' ? '150px' : '120px';
        colon.style.fontSize = clockSize === 'small' ? '2rem' : clockSize === 'large' ? '4rem' : '3rem';
      });
      
      // Update progress bar visibility
      const progressContainer = container.querySelector('.work-progress-container');
      if (progressContainer) {
        progressContainer.style.display = showProgressBar ? 'block' : 'none';
      }
    });
  });
}

// Update function to apply new clock style when it changes
function updateClockStyle(newStyle) {
  // If changing to/from default style, we need to recreate the clock display
  chrome.storage.sync.get(['clockStyle'], function(result) {
    const oldStyle = result.clockStyle || 'gradient';
    const requiresReload = 
      (oldStyle === 'default' && newStyle !== 'default') || 
      (oldStyle !== 'default' && newStyle === 'default');
    
    if (requiresReload) {
      // We need to reload the clock display - find all clock elements
      const clockContainers = document.querySelectorAll('.flip-clock-container');
      clockContainers.forEach(container => {
        const clockDigitsContainer = container.querySelector('.flip-clock-digits-container');
        if (clockDigitsContainer) {
          // Get original clock element
          const clockElement = document.querySelector('#clock, #display-time, .display-2 > div:not(.flip-clock-container)');
          if (clockElement) {
            const timeString = clockElement.textContent.trim();
            // Recreate clock digits with new style
            clockDigitsContainer.innerHTML = '';
            setupFlipClockDigits(clockDigitsContainer, timeString);
          }
        }
      });
    } else {
      // Just update the style
      applyClockSettings();
    }
  });
}

// Function to update the work progress bar
function updateWorkProgressBar(container) {
  const progressContainer = container.querySelector('.work-progress-container');
  if (!progressContainer) return;
  
  const progressTrack = progressContainer.querySelector('.work-progress-track');
  const progressFill = progressContainer.querySelector('.work-progress-fill');
  const percentageIndicator = progressContainer.querySelector('.work-progress-percentage');
  
  // Define work hours
  const workStartHour = 10; // 10:00
  const workEndHour = 19;   // 19:00
  const workTotalMinutes = (workEndHour - workStartHour) * 60; // 9 hours = 540 minutes
  
  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  
  // Add current time indicator
  let timeIndicator = progressContainer.querySelector('.current-time-indicator');
  if (!timeIndicator) {
    timeIndicator = document.createElement('div');
    timeIndicator.className = 'current-time-indicator';
    timeIndicator.style.position = 'absolute';
    timeIndicator.style.top = '2px';
    timeIndicator.style.width = '3px';
    timeIndicator.style.height = '12px';
    timeIndicator.style.backgroundColor = '#FF5722';
    timeIndicator.style.zIndex = '2';
    timeIndicator.style.boxShadow = '0 0 4px rgba(255, 87, 34, 0.6)';
    timeIndicator.style.borderRadius = '1.5px';
    timeIndicator.style.transform = 'translateX(-50%)';
    
    const timeLabel = document.createElement('div');
    timeLabel.className = 'current-time-label';
    timeLabel.style.position = 'absolute';
    timeLabel.style.top = '-15px';
    timeLabel.style.fontSize = '10px';
    timeLabel.style.fontWeight = 'bold';
    timeLabel.style.color = '#FF5722';
    timeLabel.style.transform = 'translateX(-50%)';
    timeLabel.style.whiteSpace = 'nowrap';
    timeLabel.style.textShadow = '0 0 2px rgba(255, 255, 255, 0.8)';
    
    timeIndicator.appendChild(timeLabel);
    progressTrack.appendChild(timeIndicator);
  }
  
  // Calculate percentage for time indicator position relative to 24h day
  const currentMinuteOfDay = currentHour * 60 + currentMinute;
  const workdayStart = workStartHour * 60;
  const workdayEnd = workEndHour * 60;
  
  // Calculate where to put the time indicator on the track
  let dailyPercentage;
  if (currentMinuteOfDay < workdayStart) {
    dailyPercentage = 0; // Before workday starts, pin to beginning
  } else if (currentMinuteOfDay > workdayEnd) {
    dailyPercentage = 100; // After workday ends, pin to end
  } else {
    // During workday, calculate the accurate position
    dailyPercentage = ((currentMinuteOfDay - workdayStart) / workTotalMinutes) * 100;
  }
  
  timeIndicator.style.left = `${dailyPercentage}%`;
  
  const timeLabel = timeIndicator.querySelector('.current-time-label');
  timeLabel.textContent = currentTimeStr;
  
  // Update indicator visibility based on whether we're within ±3 hours of the workday
  const isNearWorkday = currentMinuteOfDay >= (workdayStart - 180) && 
                         currentMinuteOfDay <= (workdayEnd + 180);
  timeIndicator.style.opacity = isNearWorkday ? '1' : '0.5';
  
  // Calculate progress
  let progress = 0;
  let progressText = '';
  
  if (currentHour < workStartHour) {
    // Before work hours
    const minutesUntilStart = workdayStart - currentMinuteOfDay;
    const hoursUntil = Math.floor(minutesUntilStart / 60);
    const minsUntil = minutesUntilStart % 60;
    
    progress = 0;
    progressText = `出勤時間まで ${hoursUntil}時間${minsUntil}分`;
    
    // Update visual cues
    progressFill.style.backgroundColor = 'rgba(120, 130, 140, 0.4)';
    progressFill.style.boxShadow = 'none';
    
  } else if (currentHour >= workEndHour) {
    // After work hours
    const minutesAfterEnd = currentMinuteOfDay - workdayEnd;
    const hoursAfter = Math.floor(minutesAfterEnd / 60);
    const minsAfter = minutesAfterEnd % 60;
    
    progress = 100;
    progressText = `${currentTimeStr} • 定時は (${hoursAfter}時間 ${minsAfter}分 前)`;
    
    // Update visual cues for completed workday
    progressFill.style.backgroundColor = '#28A745'; // Green when complete
    progressFill.style.boxShadow = '0 0 8px rgba(40, 167, 69, 0.3)';
    
  } else {
    // During work hours
    const minutesSinceStart = currentMinuteOfDay - workdayStart;
    progress = Math.min(100, (minutesSinceStart / workTotalMinutes) * 100);
    
    // Calculate time remaining
    const minutesRemaining = workTotalMinutes - minutesSinceStart;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const minsRemaining = minutesRemaining % 60;
    
    // Calculate percentage with more precision
    const percentage = progress.toFixed(1);
    
    progressText = `${currentTimeStr} • ${percentage}% 経過 • 残り： ${hoursRemaining}時間 ${minsRemaining}分 `;
    
    // Update color based on progress
    if (progress >= 90) {
      progressFill.style.backgroundColor = '#28A745'; // Green when almost complete
      progressFill.style.boxShadow = '0 0 8px rgba(40, 167, 69, 0.3)';
    } else if (progress >= 75) {
      progressFill.style.backgroundColor = '#17a2b8'; // Teal for good progress
      progressFill.style.boxShadow = '0 0 8px rgba(23, 162, 184, 0.3)';
    } else if (progress >= 50) {
      progressFill.style.backgroundColor = '#FFC107'; // Yellow for halfway
      progressFill.style.boxShadow = '0 0 8px rgba(255, 193, 7, 0.3)';
    } else if (progress >= 25) {
      progressFill.style.backgroundColor = '#fd7e14'; // Orange for getting started
      progressFill.style.boxShadow = '0 0 8px rgba(253, 126, 20, 0.3)';
    } else {
      progressFill.style.backgroundColor = 'var(--color-primary)'; // Default blue
      progressFill.style.boxShadow = '0 0 8px rgba(0, 102, 221, 0.3)';
    }
  }
  
  // Animate the progress bar smoothly
  progressFill.style.width = `${progress}%`;
  
  // Update the text indicator
  percentageIndicator.textContent = progressText;
  
  // Visual pulse effect for time indicator
  if (!timeIndicator.dataset.animating) {
    timeIndicator.dataset.animating = 'true';
    
    // Add subtle pulse animation
    const pulseAnimation = () => {
      timeIndicator.animate(
        [
          { boxShadow: '0 0 4px rgba(255, 87, 34, 0.6)' },
          { boxShadow: '0 0 8px rgba(255, 87, 34, 0.8)' },
          { boxShadow: '0 0 4px rgba(255, 87, 34, 0.6)' }
        ],
        {
          duration: 2000,
          iterations: Infinity
        }
      );
    };
    
    pulseAnimation();
  }
}
