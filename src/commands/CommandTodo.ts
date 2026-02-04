import { Message } from "whatsapp-web.js";
import Command from "./Command";
import { todoList } from "./store";

export class CommandTodo extends Command {
    constructor() {
        super('todo', 'mengelola daftar tugas (format: !todo (melihat) !todo makan (menambahkan))', ['task', 'tugas'])
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        const task = args.join(" ").toLowerCase().trim();

        try {
            // 1. Tampilkan List jika tidak ada argumen
            if (!task) {
                if (todoList.length === 0) {
                    await msg.reply("pencatatan kosong. ketik *!todo [tugas]* untuk menambah.");
                    return;
                }

                let listText = "┌── ✨ *daftar tugas kamu*\n";
                todoList.forEach((item, index) => {
                    listText += `├ ${index + 1}. ${item}\n`;
                });
                listText += "└──────────────";
                
                await msg.reply(listText);
                return;
            }

            // 2. Cek Duplikat
            if (todoList.includes(task)) {
                await msg.reply(`❌ "${task}" sudah ada di daftar tugas.`);
                return;
            }

            // 3. Tambahkan ke List
            todoList.push(task);
            await msg.reply(`✅ berhasil menambahkan "${task}" ke daftar tugas.`);
            
        } catch (e: any) {
            console.error(e);
            msg.reply("❌ gagal mengelola to-do list.");
        }
    }
}