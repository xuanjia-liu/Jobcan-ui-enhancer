document.addEventListener('DOMContentLoaded', function() {
  const enableEnhancerToggle = document.getElementById('enableEnhancer');
  const darkModeToggle = document.getElementById('darkMode');
  const statusIndicator = document.getElementById('statusIndicator');
  
  // Function to update status indicator
  function updateStatusIndicator(enabled) {
    if (statusIndicator) {
      statusIndicator.textContent = enabled ? "Enabled" : "Disabled";
      statusIndicator.className = enabled ? "status-enabled" : "status-disabled";
    }
  }
  
  // Load saved settings
  chrome.storage.sync.get(['enableEnhancer', 'darkMode'], function(result) {
    if (result.enableEnhancer !== undefined) {
      enableEnhancerToggle.checked = result.enableEnhancer;
      updateStatusIndicator(result.enableEnhancer);
    } else {
      // Default to enabled if not set
      enableEnhancerToggle.checked = true;
      updateStatusIndicator(true);
    }
    
    if (result.darkMode !== undefined) {
      darkModeToggle.checked = result.darkMode;
    }
  });
  
  // Save settings when changed
  enableEnhancerToggle.addEventListener('change', function() {
    const isEnabled = this.checked;
    chrome.storage.sync.set({enableEnhancer: isEnabled});
    updateStatusIndicator(isEnabled);
    
    // Show feedback toast
    showToast(isEnabled ? "UI Enhancement enabled" : "UI Enhancement disabled");
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleEnhancer',
          enabled: isEnabled
        });
      }
    });
  });
  
  darkModeToggle.addEventListener('change', function() {
    const isEnabled = this.checked;
    chrome.storage.sync.set({darkMode: isEnabled});
    
    // Show feedback toast
    showToast("Dark mode will be available soon!");
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleDarkMode',
          enabled: isEnabled
        });
      }
    });
  });
  
  // Function to show toast notification
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'show';
    
    setTimeout(function() {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
});
