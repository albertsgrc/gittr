import { Command } from "clime";
export default class extends Command {
    execute(path?: string): Promise<void>;
}
