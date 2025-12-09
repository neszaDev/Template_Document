FROM node:18-alpine

# Set work directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8081

# Start server (nodemon for dev)
CMD ["pnpm", "start"]
