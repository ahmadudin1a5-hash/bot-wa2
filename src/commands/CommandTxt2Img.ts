import { Message, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";
import axios from "axios";
import * as cheerio from "cheerio";

export class CommandTxt2Img extends Command {
    // Daftar style yang didukung oleh website tersebut
    private STYLES = ['photorealistic', 'digital-art', 'impressionist', 'anime', 'fantasy', 'sci-fi', 'vintage'];

    constructor() {
        super('txt2img', 'Generate gambar dari teks dengan AI (format: !txt2img [prompt])', ['imagine', 't2i', 'create']);
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const input = args.join(" ");
        if (!input) msg.reply("❌ Format: *!txt2img prompt | style*");

        const [prompt, styleInput] = input.split('|').map(s => s.trim());
        const style = this.STYLES.includes(styleInput?.toLowerCase()) ? styleInput.toLowerCase() : 'anime';

        try {
            await msg.reply("⏳ Sedang memproses gambar... (Bisa memakan waktu 10-30 detik)");

            const imageUrl = await this.scrapeUnrestrictedAI(prompt, style);
            
            // LOG DEBUG: Cek di terminal apakah URL sudah benar (harus diawali https://)
            console.log("[DEBUG] Image URL Found:", imageUrl);

            // MENGUNDUH GAMBAR MANUAL (Lebih aman daripada fromUrl)
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary').toString('base64');
            
            // Buat Media dari Buffer
            const media = new MessageMedia('image/png', buffer, 'result.png');

            await msg.reply(media, undefined, {
                caption: `🎨 *AI GENERATED*\n\n📝 *Prompt:* ${prompt}\n🎭 *Style:* ${style}`
            });

        } catch (error: any) {
            console.error("Txt2Img Error:", error.message);
            msg.reply(`❌ *Error:* ${error.message}`);
        }
    }

    private async scrapeUnrestrictedAI(prompt: string, style: string): Promise<string> {
        const baseUrl = "https://unrestrictedaiimagegenerator.com"; // Tanpa slash akhir
        
        const client = axios.create({
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });

        // 1. Ambil Nonce
        const { data: html, headers: resHeaders } = await client.get(`${baseUrl}/`);
        const cookies = resHeaders["set-cookie"]?.join("; ");
        
        const $ = cheerio.load(html);
        const nonce = $('input[name="_wpnonce"]').val();
        if (!nonce) throw new Error("Gagal mengambil token security.");

        // 2. Post Data
        const form = new URLSearchParams({
            generate_image: "true",
            image_description: prompt,
            image_style: style,
            _wpnonce: nonce.toString(),
        });

        const { data: resultHtml } = await client.post(`${baseUrl}/`, form.toString(), {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Cookie": cookies || ""
            },
        });

        const $$ = cheerio.load(resultHtml);
        let imgPath = $$("img#resultImage").attr("src");

        if (!imgPath) throw new Error("Gambar tidak ditemukan di halaman hasil.");
        if (imgPath.startsWith('/')) {
            imgPath = `${baseUrl}${imgPath}`;
        }

        return imgPath;
    }
}