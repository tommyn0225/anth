// scanner.js
// This module simulates scanning a project for vulnerabilities.
// It calls the Exa AI client to fetch vulnerability data.

const exaClient = require('./exaClient');

async function scanProject(projectData) {
  // Create a simple search query from the project data.
  let query = "vulnerabilities";
  if (projectData.toLowerCase().includes("express")) {
    query += " express";
  }

  // Use the exaClient to search for vulnerabilities.
  const vulnerabilities = await exaClient.searchVulnerabilities(query);

  return {
    project: projectData,
    findings: vulnerabilities,
    summary: vulnerabilities.length
      ? `Found ${vulnerabilities.length} potential vulnerabilities.`
      : "No vulnerabilities found."
  };
}

module.exports = { scanProject };
