import { Message, Client } from "whatsapp-web.js";

abstract class Command {
    prefixs: string[] = ['/', '.', '!', '~']
    name: string;
    description: string;
    alias: string[]


    constructor(name: string, description?: string, alias?: string[]){
        this.name = name;
        this.description = description || '';
        this.alias = alias ? [name, ...alias] : [name];
    }

    abstract execute(msg: Message, args: string[], client: Client): void;

    handle(msg: Message, client: Client){ // Tambah parameter client
        const prefix = msg.body[0];
        if(this.prefixs.includes(prefix)){
            const argAll: string[] = msg.body.slice(1).split(" ");
            const cmdNoPrefix = argAll[0].toLocaleLowerCase();
            if(this.alias.includes(cmdNoPrefix)){
                const args = argAll.slice(1);
                this.execute(msg, args, client); // Kirim client ke execute
            }
        }
    }
}

export default Command;