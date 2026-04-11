FROM node:22.14.0-bookworm-slim

WORKDIR /app

# Copy all source files
COPY . .

# Install dependencies across client and server
RUN npm run install:all

# Build client for production
RUN npm run build

# Start server
CMD ["npm", "start"]
