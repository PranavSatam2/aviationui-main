const SESSION_KEY = 'userSession'; // Key for localStorage
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// Save session data to localStorage with expiration time
export const saveSession = (data) => 
{
  const sessionData = 
  {
    ...data,
    timestamp: Date.now(), // Current time to track session expiration
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

// Check if the session is still valid (not expired)
export const isSessionValid = () => 
{
  const sessionData = JSON.parse(localStorage.getItem(SESSION_KEY));

  if (!sessionData) return false; // No session found

  // Check if the session has expired
  const currentTime = Date.now();
  if (currentTime - sessionData.timestamp > EXPIRATION_TIME) 
    {
    // Session expired
    clearSession(); // Clear session from storage
    return false;
  }

  return true;
};

// Retrieve session data from localStorage
export const getSessionData = () =>
{
  const sessionData = JSON.parse(localStorage.getItem(SESSION_KEY));
  return sessionData ? sessionData : null;
};

// Clear session data from localStorage
export const clearSession = () => 
{
  localStorage.removeItem(SESSION_KEY);
};
