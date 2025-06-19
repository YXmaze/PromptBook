# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files
COPY package.json package-lock.json* ./

# 4. Install dependencies
RUN npm install

# 5. Copy all project files
COPY . .

# 6. Build Next.js
RUN npm run build

# 7. Expose port & start
EXPOSE 3000
CMD ["npm", "start"]
