import Fuse from "fuse.js";
import profileData from "../data/profile.json";

// Pre-tuned Fuse.js configuration for optimal keyword/alias matching.
// Threshold 0.35 provides a balanced matching range (not too strict, not too fuzzy).
const fuseOptions = {
  keys: ["triggers", "question"],
  threshold: 0.4, 
  includeScore: true,
};

/**
 * Finds the best-matching answer from the profile chat database.
 * 
 * CHALLENGE instructions:
 * 1. Instantiate `Fuse` with `profileData.chatDatabase` and the pre-configured `fuseOptions`.
 * 2. Search the `query` using the fuse instance.
 * 3. If a match is found, return the top matching database item (i.e. results[0].item).
 * 4. If NO match is found, construct and return a fallback response object:
 *    {
 *      question: query,
 *      answer: "I couldn't quite catch that. Try asking one of the questions below, or reach out to me directly!",
 *      action: "RENDER_FALLBACK"
 *    }
 * 
 * @param {string} query - The raw user input message (pre-validated by the UI).
 * @returns {Object} The matched database item, or a fallback object.
 */
export function findBestMatch(query) {
  // ==========================================
  // TODO: CHALLENGE - Implement the fuzzy matching logic here
  // ==========================================
  const fuseInstance = new Fuse(profileData.chatDatabase, fuseOptions);
  const res = fuseInstance.search(query);

  if(res.length > 0)
    return res[0].item;
  else
    return {
       question: query,
       answer: "I couldn't quite catch that. Try asking one of the questions below, or reach out to me directly!",
       action: "RENDER_FALLBACK"
     };
  // ==========================================
  // End of Challenge
  // ==========================================
}
