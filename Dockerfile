FROM node:22.14.0-bookworm-slim

WORKDIR /app

# Copy all source files
COPY . .

# Install dependencies across client and server
RUN npm run install:all

# Build client for production
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
