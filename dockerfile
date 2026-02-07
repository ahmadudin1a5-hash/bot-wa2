# Gunakan image node versi terbaru
FROM node:20-slim

# Instal dependensi sistem untuk Chrome & Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    libgbm-dev \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Salin package.json dan install
COPY package*.json ./
RUN npm install

# Salin semua kode (src, tsconfig, dll)
COPY . .

# Jalankan build TypeScript untuk membuat folder dist/
RUN npx tsc

# Set path agar Puppeteer langsung menemukan Chrome yang baru diinstall
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Jalankan hasil build
CMD ["node", "dist/app.js"]