import { Client, LocalAuth } from "whatsapp-web.js";
import { Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import commands from "./commands";
declare global {
    var activeSessions: Map<string, string>;
}

// Inisialisasi jika belum ada
if (!global.activeSessions) {
    global.activeSessions = new Map<string, string>();
}

// Export agar bisa dipanggil dengan nama yang sama
export const activeSessions = global.activeSessions;

const client = new Client({
    restartOnAuthFail: true,
    webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html",
      },
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process", 
          "--disable-gpu",
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    },
      authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg: Message) => {
    let isCommand = false;

    // Ambil prefix dan command
    const prefix = msg.body[0];
    const argAll: string[] = msg.body.slice(1).trim().split(/ +/);
    const cmdNoPrefix = argAll[0]?.toLowerCase();

    for (const command of commands) {
        if (command.prefixs.includes(prefix) && command.alias.includes(cmdNoPrefix)) {
            isCommand = true;
            command.handle(msg, client);
            break; 
        }
    }

    // Jika bukan command DAN di pesan pribadi, tampilkan menu
    if (!isCommand && !msg.from.includes('@g.us')) {
        // Cek dulu apakah dia sedang dalam sesi !send. 
        // Jika ya, jangan kirim "!menu", tapi ingatkan cara balasnya.
        const senderId = msg.from.replace(/\D/g, '');
        if (activeSessions.has(senderId)) {
            await msg.reply("💡 Gunakan perintah *!reply <pesan>* untuk membalas pesan Admin.");
        } else {
            await msg.reply("🤖 Bingung? Ketik *!menu* untuk bantuan.");
        }
    }
});

client.initialize();