# Menggunakan image Node yang sudah include Puppeteer/Chrome
FROM ghcr.io/puppeteer/puppeteer:latest

# Pindah ke user root untuk install dependensi sistem
USER root

# Update dan install library tambahan yang mungkin dibutuhkan
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set direktori kerja
WORKDIR /app

# Salin package file dulu (untuk optimasi cache)
COPY package*.json ./

# Install semua dependensi
RUN npm install

# Salin semua kode sumber
COPY . .

# Compile TypeScript ke JavaScript (dist/)
RUN npm run build

# Jalankan bot menggunakan hasil kompilasi
CMD ["npm", "start"]