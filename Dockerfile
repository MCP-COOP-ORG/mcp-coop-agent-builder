FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare npm@11.11.0 --activate

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build the app with base-href
RUN npm run build -- --base-href /agent-builder/

# Production
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Angular 17+ with application builder outputs to dist/project-name/browser
COPY --from=base /app/dist/mcp-coop-agent-builder/browser /usr/share/nginx/html/agent-builder
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
