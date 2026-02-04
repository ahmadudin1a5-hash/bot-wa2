import { Message, Client } from "whatsapp-web.js";
import Command from "./Command";
import { activeSessions } from "./session"; // Pastikan path ke session.ts benar

export class CommandReply extends Command {
    constructor() {
        super('reply', 'Membalas pesan dari Seseorang (format: !reply [text])', ['balas'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const client = (msg as any).client as Client;
        
        // 1. Ambil data kontak pengirim untuk mendapatkan nomor HP asli (bukan LID)
        const contact = await msg.getContact();
        
        // 2. Ambil angka saja dari nomor HP asli (misal: 628123456)
        const senderNumber = contact.number; 
        const replyText = args.join(" ");

        if (!replyText) {
            msg.reply("❌ Masukkan pesan balasan!\nContoh: *!reply Halo Stranger*");
            return;
        }

        // 3. Cek di Map menggunakan nomor HP asli
        if (activeSessions.has(senderNumber)) {
            const adminJid = activeSessions.get(senderNumber)!;
            
            try {
                // Beri identitas pengirim pada pesan yang diteruskan ke admin
                const pushname = contact.pushname || senderNumber;
                const formattedMessage = `📩 *BALASAN BARU*\n\n👤 *Dari:* ${pushname} (@${senderNumber})\n💬 *Pesan:* ${replyText}`;

                // Kirim balik ke Admin yang mengirim !send tadi
                await client.sendMessage(adminJid, formattedMessage);
                
                // Konfirmasi ke pengirim (Target)
                await msg.reply("✅ Balasan Anda berhasil diteruskan ke seseorang tersebut.");
            
            } catch (error) {
                console.error("Error forwarding reply:", error);
                msg.reply("❌ Gagal mengirim balasan ke Admin.");
            }
        } else {
            // Jika nomor tidak ada di daftar sesi
            msg.reply("❌ Sesi tidak ditemukan. Anda tidak memiliki pesan aktif untuk dibalas.");
        }
    }
}