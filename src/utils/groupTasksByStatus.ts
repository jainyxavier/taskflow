import type { Task } from "../types/task";

export function groupTasksByStatus(tasks: Task[]) {
    return {
        "A fazer": tasks.filter((task) => task.status === "A fazer"),
        "Em andamento": tasks.filter((task) => task.status === "Em andamento"),
        "Concluído": tasks.filter((task) => task.status === "Concluído"),
    };
}
