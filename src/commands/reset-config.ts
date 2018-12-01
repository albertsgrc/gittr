import { command, Command, metadata, param } from "clime";
import { Config } from "config";

@command({
    description: "Resets the configuration",
})
export default class extends Command {
    @metadata
    public async execute() {
        Config.reset();
    }
}
