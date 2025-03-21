document.addEventListener('DOMContentLoaded', function() {
  const enableEnhancerToggle = document.getElementById('enableEnhancer');
  const darkModeToggle = document.getElementById('darkMode');
  const showSecondsToggle = document.getElementById('showSeconds');
  const showProgressBarToggle = document.getElementById('showProgressBar');
  const statusIndicator = document.getElementById('statusIndicator');
  const clockStyleRadios = document.querySelectorAll('input[name="clockStyle"]');
  const clockSizeRadios = document.querySelectorAll('input[name="clockSize"]');
  
  // Function to update status indicator
  function updateStatusIndicator(enabled) {
    if (statusIndicator) {
      statusIndicator.textContent = enabled ? "Enabled" : "Disabled";
      statusIndicator.className = enabled ? "status-indicator status-enabled" : "status-indicator status-disabled";
    }
  }
  
  // Load saved settings
  chrome.storage.sync.get(
    ['enableEnhancer', 'darkMode', 'clockStyle', 'clockSize', 'showSeconds', 'showProgressBar'], 
    function(result) {
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
      
      // Set clock style radio buttons
      if (result.clockStyle) {
        document.querySelector(`input[name="clockStyle"][value="${result.clockStyle}"]`).checked = true;
      }
      
      // Set clock size radio buttons
      if (result.clockSize) {
        document.querySelector(`input[name="clockSize"][value="${result.clockSize}"]`).checked = true;
      }
      
      // Set seconds toggle
      if (result.showSeconds !== undefined) {
        showSecondsToggle.checked = result.showSeconds;
      }
      
      // Set progress bar toggle
      if (result.showProgressBar !== undefined) {
        showProgressBarToggle.checked = result.showProgressBar;
      } else {
        // Default to enabled
        showProgressBarToggle.checked = true;
      }
    }
  );
  
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
  
  // Handle clock style changes
  clockStyleRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        chrome.storage.sync.set({clockStyle: this.value});
        showToast(`Clock style updated to ${this.value}`);
        
        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'updateClockSettings',
              clockStyle: radio.value
            });
          }
        });
      }
    });
  });
  
  // Handle clock size changes
  clockSizeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        chrome.storage.sync.set({clockSize: this.value});
        showToast(`Clock size updated to ${this.value}`);
        
        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'updateClockSettings',
              clockSize: radio.value
            });
          }
        });
      }
    });
  });
  
  // Handle show seconds toggle
  showSecondsToggle.addEventListener('change', function() {
    const isEnabled = this.checked;
    chrome.storage.sync.set({showSeconds: isEnabled});
    showToast(isEnabled ? "Seconds display enabled" : "Seconds display disabled");
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateClockSettings',
          showSeconds: isEnabled
        });
      }
    });
  });
  
  // Handle show progress bar toggle
  showProgressBarToggle.addEventListener('change', function() {
    const isEnabled = this.checked;
    chrome.storage.sync.set({showProgressBar: isEnabled});
    showToast(isEnabled ? "Progress bar enabled" : "Progress bar disabled");
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateClockSettings',
          showProgressBar: isEnabled
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
