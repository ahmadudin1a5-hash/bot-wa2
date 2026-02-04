import { Message, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";
import axios from "axios";

export class CommandRemoveBg extends Command {
    // Masukkan API Key Anda di sini
    private apiKey = "9BX5292FTqeVgpxTjmaTos9h";

    constructor() {
        super('removebg', 'Menghapus background gambar (fomrat: !removebg (masukkan gambar))', ['rbg'])
    }

    async execute(msg: Message): Promise<void> {
        // Cek apakah pesan memiliki media atau membalas pesan yang memiliki media
        const hasQuotedMsg = msg.hasQuotedMsg;
        const quotedMsg = hasQuotedMsg ? await msg.getQuotedMessage() : null;
        const targetMsg = (msg.hasMedia) ? msg : (quotedMsg?.hasMedia ? quotedMsg : null);

        if (!targetMsg) {
            msg.reply("❌ Kirim gambar atau balas gambar dengan caption !removebg");
            return;
        }

        try {
            await msg.reply("⏳ Sedang memproses... Tunggu sebentar.");

            const media = await targetMsg.downloadMedia();
            
            // Kirim ke API Remove.bg
            const response = await axios.post(
                "https://api.remove.bg/v1.0/removebg",
                {
                    image_file_b64: media.data,
                    size: "auto"
                },
                {
                    headers: { "X-Api-Key": this.apiKey },
                    responseType: "arraybuffer"
                }
            );

            const resultBase64 = Buffer.from(response.data, "binary").toString("base64");
            const resultMedia = new MessageMedia("image/png", resultBase64, "no-bg.png");

            await msg.reply(resultMedia, undefined, {
                caption: "✅ Background berhasil dihapus!"
            });

        } catch (e: any) {
            console.error("RemoveBG Error:", e.response?.data?.toString() || e.message);
            msg.reply("❌ Gagal menghapus background. Pastikan API Key benar atau kuota API masih ada.");
        }
    }
}