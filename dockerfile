# 1. Gunakan image node yang stabil
FROM node:20

# 2. Instal semua library Linux yang dibutuhkan Chrome agar tidak error 'libglib'
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Copy package file dan install
COPY package*.json ./
RUN npm install

# 4. Copy semua file sumber (.ts, tsconfig.json, dll)
COPY . .

# 5. PROSES BUILD: Mengubah src/*.ts menjadi dist/*.js
RUN npx tsc

# 6. Jalankan file hasil build yang sekarang sudah ada di folder dist
CMD ["node", "dist/app.js"]