export interface StatusSectionType {
    sectionTitle: string;
    tasks: Task[]
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    isChecked: boolean
    createdAt: string;
}

export interface TaskFormData {
    title: string;
    description: string;
    status: string;
    priority: string;
    date: string;
}

export interface TaskFormErrors {
    title?: string;
    status?: string;
    priority?: string;
}