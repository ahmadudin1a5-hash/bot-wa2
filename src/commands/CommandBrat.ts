import { Message, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";
import axios from "axios";

export class CommandBrat extends Command {
    constructor() {
        super('brat', 'Mengubah teks menjadi stiker (format: !brat teks)', ['stikerbrat'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const text = args.join(" ");
        
        if (!text) {
            msg.reply("❌ Masukkan teks! Contoh: !brat halo");
            return;
        }

        try {
            // Kita menggunakan API publik untuk generate gambar Brat
            // Format API biasanya menerima teks sebagai query parameter
            const apiUrl = `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`;

            // Mengambil gambar dari API menggunakan axios dengan responseType arraybuffer
            const response = await axios.get(apiUrl, {
                responseType: 'arraybuffer'
            });

            // Konversi buffer ke base64
            const base64Image = Buffer.from(response.data, 'binary').toString('base64');

            // Buat objek MessageMedia
            const media = new MessageMedia('image/png', base64Image, 'brat.png');

            // Kirim sebagai stiker
            await msg.reply(media, undefined, { 
                sendMediaAsSticker: true,
                stickerName: "cihuy",
                stickerAuthor: "lovyu"
            });

        } catch (e: any) {
            console.error("Brat API Error:", e.message);
            msg.reply("❌ Gagal menghubungi API atau membuat stiker. Coba lagi nanti.");
        }
    }
}