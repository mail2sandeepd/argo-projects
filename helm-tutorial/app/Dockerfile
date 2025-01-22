# Use official Node.js 16 Alpine image
FROM node:16-alpine

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies as a non-root user
RUN npm install --quiet

# Copy the rest of the application code
COPY . .

# Change ownership of the working directory to the non-root user
RUN chown -R appuser:appgroup /src

# Expose the port the app runs on
EXPOSE 3000

# Switch to the non-root user to run the app
USER appuser

# Start the application
CMD ["npm", "start"]
