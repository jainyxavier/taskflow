import type { StatusSectionType } from "../types/task"

export const statusToDo: StatusSectionType = {
    sectionTitle: "A fazer",
    tasks: [
        {
            id: 1,
            title: "Estudar React e TypeScript",
            description: "Aprofundar conhecimentos sobre Hooks, Context API e boas práticas de desenvolvimento.",
            status: "A fazer",
            priority: "Alta",
            isChecked: false,
            createdAt: "10/10/2026"
        },
        {
            id: 2,
            title: "Estudar React e TypeScript",
            description: "Aprofundar conhecimentos sobre Hooks, Context API e boas práticas de desenvolvimento.",
            status: "A fazer",
            priority: "Alta",
            isChecked: false,
            createdAt: "10/10/2026"
        }
    ]
}

export const statusInProgress: StatusSectionType = {
    sectionTitle: "Em andamento",
    tasks: [
        {
            id: 1,
            title: "Estudar React e TypeScript",
            description: "Aprofundar conhecimentos sobre Hooks, Context API e boas práticas de desenvolvimento.",
            status: "Em andamento",
            priority: "Média",
            isChecked: false,
            createdAt: "10/10/2026"
        },
        {
            id: 2,
            title: "Estudar React e TypeScript",
            description: "Aprofundar conhecimentos sobre Hooks, Context API e boas práticas de desenvolvimento.",
            status: "Em andamento",
            priority: "Média",
            isChecked: false,
            createdAt: "10/10/2026"
        }
    ]
}

export const statusCompleted: StatusSectionType = {
    sectionTitle: "Concluído",
    tasks: [
        {
            id: 1,
            title: "Estudar React e TypeScript",
            description: "Aprofundar conhecimentos sobre Hooks, Context API e boas práticas de desenvolvimento.",
            status: "Concluído",
            priority: "Baixa",
            isChecked: false,
            createdAt: "10/10/2026"
        },
        {
            id: 2,
            title: "Estudar React e TypeScript",
            description: "Aprofundar conhecimentos sobre Hooks, Context API e boas práticas de desenvolvimento.",
            status: "Concluído",
            priority: "Baixa",
            isChecked: false,
            createdAt: "10/10/2026"
        }
    ]
}