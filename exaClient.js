// exaClient.js
// This module handles communication with Exa AI’s API to fetch vulnerability data.

const axios = require('axios');
const EXA_API_KEY = process.env.EXA_API_KEY; // The API key should be set in your environment.

async function searchVulnerabilities(query) {
  if (!EXA_API_KEY) {
    throw new Error("EXA_API_KEY is not set in environment variables.");
  }

  // This is a placeholder URL; replace it with the actual Exa AI endpoint.
  const exaEndpoint = 'https://api.exa.ai/search';

  try {
    const response = await axios.get(exaEndpoint, {
      params: { q: query },
      headers: {
        'Authorization': `Bearer ${EXA_API_KEY}`
      }
    });
    // Assume the API returns a JSON with a 'results' field.
    return response.data.results;
  } catch (error) {
    console.error("Error fetching from Exa AI:", error.message);
    throw new Error("Exa AI query failed");
  }
}

module.exports = { searchVulnerabilities };
