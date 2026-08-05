import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Task, TaskFormData, TaskFormErrors } from "../types/task";
import { taskToFormData } from "../utils/taskMappers";

type UseTaskFormProps = {
    taskToEdit?: Task | null;
    onSuccess: (formData: TaskFormData) => void;
};

const initialValues: TaskFormData = {
    title: "",
    description: "",
    status: "",
    priority: "",
    date: "",
};

export function useTaskForm({ taskToEdit, onSuccess }: UseTaskFormProps) {
    const [formData, setFormData] = useState<TaskFormData>(initialValues);
    const [errors, setErrors] = useState<TaskFormErrors>({});

    const isEditing = Boolean(taskToEdit);

    useEffect(() => {
        if (taskToEdit) {
            setFormData(taskToFormData(taskToEdit));
        } else {
            setFormData(initialValues);
        }

        setErrors({});
    }, [taskToEdit]);

    function validate() {
        const newErrors: TaskFormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "O título é obrigatório.";
        }

        if (!formData.status) {
            newErrors.status = "O status é obrigatório.";
        }

        if (!formData.priority) {
            newErrors.priority = "A prioridade é obrigatória.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function updateField<K extends keyof TaskFormData>(
        field: K,
        value: TaskFormData[K]
    ) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field as keyof TaskFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

        updateField(name as keyof TaskFormData, value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) return;

        onSuccess(formData);
    }

    return {
        formData,
        errors,
        isEditing,
        updateField,
        handleInputChange,
        handleSubmit,
    };
}
