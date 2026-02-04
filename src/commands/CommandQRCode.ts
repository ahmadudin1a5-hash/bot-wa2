import { Message, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";
import QRCode from "qrcode";

export class CommandQRCode extends Command {
    constructor() {
        super('qrcode', 'Mengubah link atau teks menjadi QR Code (fomrat: !qrcode link)', ['qr', 'makeqr'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const text = args.join(" ");
        
        // Validasi jika tidak ada input
        if (!text) {
            msg.reply("❌ Masukkan link atau teks! Contoh: !qrcode https://google.com");
            return;
        }

        try {
            await msg.reply("⏳ Sedang membuat QR Code...");

            // Generate QR Code sebagai Data URL (Base64)
            // Kita set margin 2 agar ada bingkai putih sedikit (lebih mudah di-scan)
            const qrDataUrl = await QRCode.toDataURL(text, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#000000', // Warna QR
                    light: '#FFFFFF' // Warna Background
                }
            });

            // Ambil bagian base64-nya saja
            const base64Data = qrDataUrl.split(',')[1];
            const media = new MessageMedia('image/png', base64Data, 'qrcode.png');

            await msg.reply(media, undefined, {
                caption: `✅ QR Code untuk: *${text}*`
            });

        } catch (e: any) {
            console.error("QRCode Error:", e.message);
            msg.reply("❌ Gagal membuat QR Code.");
        }
    }
}