# Gunakan image node yang berbasis Debian (bukan Alpine) agar library lengkap
FROM node:20-bookworm-slim

# Instal semua library sistem yang dibutuhkan Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Instal Puppeteer secara global untuk memastikan browser terdownload
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

WORKDIR /app

# Copy package dan install
COPY package*.json ./
RUN npm install

# Copy semua file (src, tsconfig.json)
COPY . .

# Jalankan build TypeScript (membuat folder dist)
RUN npx tsc

# Berikan izin eksekusi pada folder chrome yang terunduh
RUN chmod -R 777 /app/node_modules/puppeteer/.local-chromium 2>/dev/null || true

# Jalankan bot
CMD ["node", "dist/app.js"]