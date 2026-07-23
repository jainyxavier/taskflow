import { useState, type ChangeEvent, type SubmitEvent} from "react";
import type { TaskFormData, TaskFormErrors } from "../types/task";

type UseTaskFormProps = {
    onSuccess: () => void;
};

const initialValues: TaskFormData = {
    title: "",
    description: "",
    status: "",
    priority: "",
    date: "",
};

export function useTaskForm({ onSuccess }: UseTaskFormProps) {
    const [formData, setFormData] = useState<TaskFormData>(initialValues);
    const [errors, setErrors] = useState<TaskFormErrors>({});

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

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (!validate()) return;

        onSuccess();

        setFormData(initialValues);
        setErrors({});
    }

    return {
        formData,
        errors,

        updateField,
        handleInputChange,
        handleSubmit,
    };
}