// Session Manager - handles session ID management
var sessionManager = (function() {
  let currentSessionId = null;
  let hasModifications = false;

  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getSessionId() {
    if (currentSessionId === null) {
      // Check localStorage first
      const stored = localStorage.getItem('satSessionId');
      if (stored) {
        currentSessionId = stored;
      }
      // If still null, we're using the default session
    }
    return currentSessionId;
  }

  function setSessionId(sessionId) {
    currentSessionId = sessionId;
    if (sessionId) {
      localStorage.setItem('satSessionId', sessionId);
    } else {
      localStorage.removeItem('satSessionId');
    }
    // Trigger UI update
    updateSessionDisplay();
  }

  function ensureSessionId() {
    if (!hasModifications && currentSessionId === null) {
      // First modification - generate session ID
      const newSessionId = generateGUID();
      setSessionId(newSessionId);
      hasModifications = true;
      showSessionIdInfo();
      return newSessionId;
    }
    return getSessionId();
  }

  function showSessionIdInfo() {
    // Show the session info section
    const sessionInfo = document.getElementById('sessionInfo');
    if (sessionInfo) {
      sessionInfo.style.display = 'block';
    }
  }

  function updateSessionDisplay() {
    const sessionDisplay = document.getElementById('sessionDisplay');
    const sessionInput = document.getElementById('sessionInput');
    
    if (sessionDisplay) {
      const sessionId = getSessionId();
      sessionDisplay.textContent = sessionId || 'Demo Session';
    }
  }

  function loadSession(sessionId) {
    setSessionId(sessionId);
    // Reload the page to fetch new session data
    window.location.reload();
  }

  return {
    getSessionId: getSessionId,
    setSessionId: setSessionId,
    ensureSessionId: ensureSessionId,
    loadSession: loadSession,
    updateSessionDisplay: updateSessionDisplay
  };
})();