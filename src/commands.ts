import Command from "./commands/Command";
import { CommandMenu } from "./commands/CommandMenu";
import { CommandSticker } from "./commands/CommandSticker";
import { CommandSend } from "./commands/CommandSend";
import { CommandTikTok } from "./commands/CommandTiktok";
import { CommandBrat } from "./commands/CommandBrat";
import { CommandRemoveBg } from "./commands/CommandRemoveBg";
import { CommandQRCode } from "./commands/CommandQRCode";
import { CommandTodo } from "./commands/CommandTodo";
import { CommandDone } from "./commands/CommandDone";
import { CommandHumanize } from "./commands/CommandHumanize";
import { CommandReply } from "./commands/CommandReply";
import { CommandTxt2Img } from "./commands/CommandTxt2Img";

const commands: Command[] = [
    new CommandMenu(),
    new CommandSticker(),
    new CommandTikTok(),
    new CommandBrat(),
    new CommandSend(),
    new CommandRemoveBg(),
    new CommandQRCode(),
    new CommandTodo(),
    new CommandDone(),
    new CommandHumanize(),
    new CommandReply(),
    new CommandTxt2Img()
];

export default commands;