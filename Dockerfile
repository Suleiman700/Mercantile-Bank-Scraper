# Use Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 8083
EXPOSE 8083

# Set environment variable for port (optional fallback)
ENV PORT=8083

# Start the app
CMD ["node", "server.js"]