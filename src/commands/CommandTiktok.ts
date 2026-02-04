import { Message, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";
import axios from "axios";

export class CommandTikTok extends Command {
    constructor() {
        super('tt', 'Download video TikTok tanpa watermark (format: !tt link)', ['tiktok'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const url = args[0];
        if (!url) {
            msg.reply("❌ Sertakan link TikTok!");
            return;
        }

        msg.reply("⏳ Sedang mencoba beberapa server downloader...");

        // Daftar API yang akan dicoba satu per satu jika terjadi error 502/500
        const apis = [
            `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
            `https://sk-tik-downloader.vercel.app/api/download?url=${encodeURIComponent(url)}`,
            `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
        ];

        let success = false;

        for (const apiUrl of apis) {
            try {
                console.log(`[TikTok] Mencoba API: ${apiUrl}`);
                const response = await axios.get(apiUrl, { timeout: 15000 });
                const resData = response.data;

                // Cek apakah data video ada (struktur data bisa berbeda tiap API)
                let videoUrl = resData.video?.noWatermark || resData.data?.play || resData.result?.video;

                if (videoUrl) {
                    const videoBuffer = await axios.get(videoUrl, {
                        responseType: 'arraybuffer',
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });

                    const contentType = videoBuffer.headers['content-type'] || 'video/mp4';
                    const base64Video = Buffer.from(videoBuffer.data, 'binary').toString('base64');
                    const media = new MessageMedia(contentType, base64Video, 'tiktok.mp4');

                    await msg.reply(media, undefined, { caption: "✅ Berhasil diunduh!" });
                    success = true;
                    break; // Keluar dari loop jika berhasil
                }
            } catch (err: any) {
                console.error(`[TikTok] Server ${apiUrl} gagal: ${err.message}`);
                continue; // Coba API berikutnya di dalam daftar
            }
        }

        if (!success) {
            msg.reply("❌ Semua server downloader sedang gangguan (502/500). Silakan coba lagi nanti atau gunakan link lain.");
        }
    }
}