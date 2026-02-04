import { Message, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";

export class CommandSticker extends Command {
    constructor() {
        super('s', 'Ubah gambar menjadi stiker (format: !s)', ['sticker', 'stiker'])
    }

    async execute(msg: Message): Promise<void> {
        const targetMsg = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
        
        if (targetMsg.hasMedia) {
            const media = await targetMsg.downloadMedia();
            await msg.reply(media, undefined, { 
                sendMediaAsSticker: true, 
                stickerName: "cihuy", 
                stickerAuthor: "lovyu" 
            });
        } else {
            msg.reply("Silakan kirim/balas gambar dengan perintah !s");
        }
    }
}