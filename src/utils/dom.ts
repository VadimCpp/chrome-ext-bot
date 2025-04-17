/**
 * Get the href URL of a card element
 * @param {HTMLElement} cardElement - The card element to get the href URL from
 * @returns {string|null} The href URL of the card element, or null if no href URL is found
 */
export function getCardHrefUrl(cardElement: HTMLElement): string | null {
  if (!cardElement) {
    return null;
  }
  
  if (cardElement.tagName.toLowerCase() === "a") {
    return cardElement.getAttribute("href");
  }
  
  const anchor = cardElement.querySelector("a");
  return anchor ? anchor.getAttribute("href") : null;
} 