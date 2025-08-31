/**
 * Simple name capitalization utility - Title Case approach
 * Used by major apps like LinkedIn, Facebook, etc.
 */

export function capitalizeNames(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Clean up multiple spaces and trim
  const cleaned = input.trim().replace(/\s+/g, ' ');
  
  if (cleaned === '') {
    return '';
  }

  // Simple title case: capitalize first letter of each word
  return cleaned
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}