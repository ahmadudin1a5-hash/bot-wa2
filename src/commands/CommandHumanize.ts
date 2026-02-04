import { Message } from "whatsapp-web.js";
import Command from "./Command";
import axios from "axios";

export class CommandHumanize extends Command {
    constructor() {
        super('humanize', 'mengubah teks ai menjadi lebih manusiawi (format: !humanize [text]', ['bypass', 'human'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        // Ambil teks dari argumen atau dari pesan yang di-reply
        let text = args.join(" ");
        
        if (msg.hasQuotedMsg && !text) {
            const quotedMsg = await msg.getQuotedMessage();
            text = quotedMsg.body;
        }

        if (!text) {
            msg.reply("❌ masukkan teks atau balas pesan yang ingin di-humanize!\ncontoh: !humanize teks kamu");
            return;
        }

        try {
            await msg.reply("⏳ sedang memproses teks...");
                
            const response = await axios.get(`https://api.danzy.web.id/api/ai/bypass`, {
                params: { text: text }
            });
        
            let result = response.data.result || response.data.data;
        
            if (result) {
                // PERBAIKAN: Mengganti <br /> atau <br> menjadi baris baru (\n)
                // Dan menghapus tag HTML lainnya jika ada
                const cleanResult = result
                    .replace(/<br\s*\/?>/gi, '\n') // Mengubah <br>, <br/>, <br /> menjadi \n
                    .replace(/<\/?[^>]+(>|$)/g, "") // Menghapus tag HTML lain seperti <b>, <div>, dll
                    .replace(/[*—]/g, "");
            
                await msg.reply(`✨ *hasil humanize:*\n\n${cleanResult.trim()}`);
            } else {
                msg.reply("❌ gagal mendapatkan respon dari server.");
            }

        } catch (e: any) {
            console.error("Humanize Error:", e.message);
            msg.reply("❌ terjadi kesalahan saat menghubungi api.");
        }
    }
}