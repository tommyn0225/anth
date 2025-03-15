# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of your code
COPY . .

# Start the MCP server when the container runs
CMD ["npm", "start"]
