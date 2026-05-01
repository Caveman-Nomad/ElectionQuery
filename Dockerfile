# ---- Stage 1: Build Frontend ----
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy root package files
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . .
RUN npm run build

# ---- Stage 2: Setup Backend and Serve ----
FROM node:18-alpine
WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./
RUN npm install --production

# Copy backend source
COPY server/ ./

# Copy built frontend from Stage 1 into /app/dist
# The backend index.js is configured to look at ../dist
COPY --from=frontend-build /app/dist /app/dist

# Expose port (Cloud Run defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["node", "index.js"]
