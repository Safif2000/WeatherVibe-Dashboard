/**
 * Time utilities for handling timezone-aware times
 */

/**
 * Get the current time in a specific timezone using Intl API
 * @param {string} timezone - IANA timezone string (e.g., 'Asia/Karachi')
 * @returns {Date} Date object representing the current time in that timezone
 */
export function getTimeInTimezone(timezone) {
  try {
    if (!timezone) return new Date();
    
    // Use Intl to get timezone-aware time
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(new Date());
    const date = new Date(
      parseInt(parts.find(p => p.type === 'year').value),
      parseInt(parts.find(p => p.type === 'month').value) - 1,
      parseInt(parts.find(p => p.type === 'day').value),
      parseInt(parts.find(p => p.type === 'hour').value),
      parseInt(parts.find(p => p.type === 'minute').value),
      parseInt(parts.find(p => p.type === 'second').value)
    );
    
    return date;
  } catch (e) {
    console.warn('Error with timezone:', timezone, e);
    return new Date();
  }
}

/**
 * Get greeting based on hour in a specific timezone
 * @param {string} timezone - IANA timezone string
 * @returns {string} Greeting message
 */
export function getTimeBasedGreeting(timezone) {
  const timeInTz = getTimeInTimezone(timezone);
  const hour = timeInTz.getHours();
  
  // Morning: 5 AM to 12 PM (5-11:59)
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }
  
  // Afternoon: 12 PM to 5 PM (12-16:59)
  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }
  
  // Evening: 5 PM to 9 PM (17-20:59)
  if (hour >= 17 && hour < 21) {
    return "Good evening";
  }
  
  // Night: 9 PM to 5 AM (21-23 and 0-4:59)
  if (hour >= 21 || hour < 5) {
    return "Good night ";
  }
  
  // Fallback
  return "Hello";
}

/**
 * Format time in a specific timezone
 * @param {string} timezone - IANA timezone string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export function formatTimeInTimezone(timezone, options = {}) {
  try {
    if (!timezone) {
      return new Date().toLocaleTimeString("en-US", options);
    }
    
    return new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      ...options
    });
  } catch (e) {
    console.warn('Error formatting time:', e);
    return new Date().toLocaleTimeString("en-US", options);
  }
}

/**
 * Format date in a specific timezone
 * @param {string} timezone - IANA timezone string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDateInTimezone(timezone, options = {}) {
  try {
    if (!timezone) {
      return new Date().toLocaleDateString("en-US", options);
    }
    
    return new Date().toLocaleDateString("en-US", {
      timeZone: timezone,
      ...options
    });
  } catch (e) {
    console.warn('Error formatting date:', e);
    return new Date().toLocaleDateString("en-US", options);
  }
}
