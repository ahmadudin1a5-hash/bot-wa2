import { Message } from "whatsapp-web.js";
import Command from "./Command";
import { removeTodo } from "./store"; // Import fungsi penghapus

export class CommandDone extends Command {
    constructor() {
        super('done', 'menghapus tugas yang selesai (format: !done [namatugas])', ['selesai'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const task = args.join(" ").toLowerCase().trim();

        if (!task) {
            msg.reply("❌ tulis nama tugas yang selesai. contoh: !done beli susu");
            return;
        }

        const isDeleted = removeTodo(task);

        if (isDeleted) {
            msg.reply(`✅ mantap! "${task}" telah diselesaikan dan dihapus dari list.`);
        } else {
            msg.reply(`❌ tugas "${task}" tidak ditemukan di daftar.`);
        }
    }
}