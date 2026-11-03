import logoUrl from "../assets/logo.jpg";

let cachedLogoBuffer = null;

/**
 * Loads the institutional ZPPSU Guidance Seal image into an ArrayBuffer
 * for native embedding into ExcelJS worksheets.
 * Caches the buffer after initial load to optimize performance.
 *
 * @returns {Promise<ArrayBuffer|null>} Image buffer or null on failure
 */
export async function getInstitutionalLogoBuffer() {
  if (cachedLogoBuffer) {
    return cachedLogoBuffer;
  }

  try {
    // Attempt 1: Fetch via resolved Vite asset URL
    const response = await fetch(logoUrl);
    if (response.ok) {
      cachedLogoBuffer = await response.arrayBuffer();
      return cachedLogoBuffer;
    }
  } catch (err) {
    console.warn("Vite asset fetch failed, attempting public fallback:", err);
  }

  try {
    // Attempt 2: Public fallback
    const fallbackResponse = await fetch("/logo.jpg");
    if (fallbackResponse.ok) {
      cachedLogoBuffer = await fallbackResponse.arrayBuffer();
      return cachedLogoBuffer;
    }
  } catch (fallbackErr) {
    console.warn("Public logo.jpg fetch failed:", fallbackErr);
  }

  return null;
}
