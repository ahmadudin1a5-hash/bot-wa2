# Gunakan image yang sudah ada Chrome-nya
FROM ghcr.io/puppeteer/puppeteer:latest

USER root

# Instal ffmpeg (penting untuk stiker/video)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Salin package.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua file proyek
COPY . .

# Build TypeScript kamu
RUN npm run build

# Beri izin pada folder auth jika ada
RUN mkdir -p .wwebjs_auth && chmod -R 777 .wwebjs_auth

# Jalankan bot dari hasil build
CMD ["node", "dist/app.js"]