import { Message } from "whatsapp-web.js";
import Command from "./Command";
import allCommands from "../commands";

export class CommandMenu extends Command {
    constructor() {
        super('menu', 'menampilkan panduan penggunaan bot', ['help', 'bantuan'])
    }

    execute(msg: Message): void {
        const botName = "Higraw - Bot";
        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        let menuText = `꒥꒷ *${botName}* ꒷꒥\n`;

        menuText += `berikut daftar perintah yang tersedia untuk kamu gunakan:\n\n`;

        allCommands.forEach((cmd) => {
            // Menggunakan simbol estetik dan huruf kecil sesuai permintaan
            menuText += `┌──  ✨ *!${cmd.name.toLowerCase()}*\n`;
            menuText += `└  _${cmd.description.toLowerCase()}_\n\n`;
        });

        menuText += `─── · ─── · ─── · ───\n`;
        menuText += `pake prefix *!* di depan perintah ya.`;

        msg.reply(menuText);
    }
}