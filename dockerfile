# Gunakan image node resmi
FROM node:20

# Instal Chrome untuk Puppeteer
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Salin package file dulu (untuk optimasi cache)
COPY package*.json ./

# Install semua dependensi
RUN npm install

# Salin semua kode sumber
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Compile TypeScript ke JavaScript (dist/)
RUN npm run build

# Jalankan bot menggunakan hasil kompilasi
CMD ["npm", "start"]