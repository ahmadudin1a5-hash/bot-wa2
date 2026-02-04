import { Message, Client, MessageMedia } from "whatsapp-web.js";
import Command from "./Command";
import { activeSessions } from "./session"; // Pastikan import dari file yang sama

export class CommandSend extends Command {
    constructor() {
        super('send', 'Kirim pesan ke nomor lain', ['pm'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const client = (msg as any).client as Client;

        const fullArg = args.join(" ");
        const [target, ...textParts] = fullArg.split("|");
        const messageText = textParts.join("|")?.trim();

        if (!target || !messageText) {
            msg.reply("❌ Format salah! Gunakan: *!send nomor|pesan*");
            return;
        }

        let rawNumber = target.trim().replace(/\D/g, '');
        if (rawNumber.startsWith('0')) rawNumber = '62' + rawNumber.slice(1);

        const formattedTarget = rawNumber + "@c.us";

        try {
            // 1. Cek apakah nomor terdaftar
            const isRegistered = await client.isRegisteredUser(formattedTarget);
            if (!isRegistered) {
                msg.reply(`❌ Nomor *${rawNumber}* tidak terdaftar di WhatsApp.`);
                return;
            }

            // 2. Format pesan yang akan diterima oleh Target
            // Kita tambahkan footer instruksi !reply di bawahnya
            const messageForTarget = `📩 *PESAN DARI SESEORANG*\n\n` +
                                     `${messageText}\n\n` +
                                     `──────────────────\n` +
                                     `💡 *Cara Membalas:*\n` +
                                     `Ketik: *!reply <pesan kamu>*\n` +
                                     `Contoh: *!reply halo stranger!*`;

            // 3. Kirim pesan ke target
            await client.sendMessage(formattedTarget, messageForTarget);

            // 4. Simpan sesi menggunakan angka saja (rawNumber) agar sinkron dengan CommandReply
            const cleanTargetId = rawNumber; 
            activeSessions.set(cleanTargetId, msg.from);

            // 5. Beri laporan ke Admin
            msg.reply(`✅ Pesan berhasil terkirim ke ${rawNumber}.`);

            // 6. Set timeout hapus sesi (1 jam)
            setTimeout(() => {
                if (activeSessions.get(cleanTargetId) === msg.from) {
                    activeSessions.delete(cleanTargetId);
                }
            }, 3600000);

        } catch (error) {
            console.error("Error Send:", error);
            msg.reply("❌ Gagal mengirim pesan.");
        }
    }
}