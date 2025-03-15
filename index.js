// index.js
// This is the main entry point for our MCP server.
// It reads JSON-RPC messages (in JSON format) from STDIN (the terminal input) and sends responses to STDOUT.

const readline = require('readline');
const scanner = require('./scanner');

// Create an interface to read from STDIN line-by-line.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Helper function to send a response in JSON format.
function sendResponse(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

// Define the methods (commands) our server supports.
const methods = {
  listTools: async () => {
    return {
      tools: [
        { name: "listTools", description: "Lists available commands." },
        { name: "scanProject", description: "Scans project data for vulnerabilities." }
      ]
    };
  },
  scanProject: async (params) => {
    if (!params || !params.projectData) {
      throw new Error("Missing parameter: projectData");
    }
    // Send a progress message as soon as the scan starts.
    sendResponse({
      jsonrpc: "2.0",
      method: "scanProgress",
      params: { message: "Scan started..." }
    });
    // Call our scanner module to perform the vulnerability scan.
    const result = await scanner.scanProject(params.projectData);
    return result;
  }
};

// Listen for each line of input (each line is expected to be a JSON-RPC request).
rl.on('line', async (line) => {
  let req;
  try {
    req = JSON.parse(line);
  } catch (err) {
    console.error("Invalid JSON received:", line);
    return;
  }

  // Check if the message includes a method.
  if (!req.method) {
    console.error("Missing method in request:", req);
    return;
  }

  // Process the request by calling the appropriate method.
  if (methods[req.method]) {
    try {
      const result = await methods[req.method](req.params);
      if (req.id !== undefined) {  // Only send a response if an id was provided.
        sendResponse({
          jsonrpc: "2.0",
          id: req.id,
          result
        });
      }
    } catch (err) {
      if (req.id !== undefined) {
        sendResponse({
          jsonrpc: "2.0",
          id: req.id,
          error: { code: -32000, message: err.message }
        });
      }
    }
  } else {
    if (req.id !== undefined) {
      sendResponse({
        jsonrpc: "2.0",
        id: req.id,
        error: { code: -32601, message: "Method not found" }
      });
    }
  }
});
