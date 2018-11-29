import { command, Command, param } from "clime";

@command({
    description: "Stops the current timer for a repository folder",
})
export default class extends Command {
    public execute(
        @param({
            description: "Repository path. Defaults to current path.",
        })
        path: string,
    ) {
        return `${path}`;
    }
}
