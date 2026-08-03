import type { Task, TaskFormData } from "../types/task";

const statusLabelToValue: Record<string, string> = {
    "A fazer": "pending",
    "Em andamento": "in-progress",
    "Concluído": "completed",
};

const statusValueToLabel: Record<string, string> = {
    pending: "A fazer",
    "in-progress": "Em andamento",
    completed: "Concluído",
};

const priorityLabelToValue: Record<string, string> = {
    Alta: "high",
    Média: "medium",
    Baixa: "low",
};

const priorityValueToLabel: Record<string, string> = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
};

function displayDateToInputDate(date: string) {
    const [day, month, year] = date.split("/");

    if (!day || !month || !year) return "";

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function inputDateToDisplayDate(date: string) {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
}

export function taskToFormData(task: Task): TaskFormData {
    return {
        title: task.title,
        description: task.description,
        status: statusLabelToValue[task.status] ?? "",
        priority: priorityLabelToValue[task.priority] ?? "",
        date: displayDateToInputDate(task.createdAt),
    };
}

export function formDataToTask(formData: TaskFormData, id: number, isChecked = false): Task {
    return {
        id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: statusValueToLabel[formData.status] ?? "A fazer",
        priority: priorityValueToLabel[formData.priority] ?? "Baixa",
        isChecked,
        createdAt: inputDateToDisplayDate(formData.date) || new Date().toLocaleDateString("pt-BR"),
    };
}
