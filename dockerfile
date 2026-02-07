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

COPY package*.json ./

# Gunakan --omit=dev agar sesuai saran npm, tapi pastikan typescript terinstall
RUN npm install

COPY . .

# Build TypeScript
RUN npx tsc

# Environment Variable agar Puppeteer tahu lokasi Chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

CMD ["node", "src/app.js"]