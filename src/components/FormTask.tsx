import { FaRegCalendarAlt } from "react-icons/fa";
import Button from "./Button";
import ColoredSelect from "./ColoredSelect";
import FieldError from "./FieldError";
import RequiredMark from "./RequiredMark";
import { useTaskForm } from "../hooks/useTaskForm";
import { fieldClassName, labelClassName } from "../constants/form.constants";
import { priorityOptions, statusOptions } from "../constants/taskOptions";
import type { Task, TaskFormData } from "../types/task";

type FormTaskProps = {
    onClose: () => void;
    taskToEdit?: Task | null;
    onSave: (formData: TaskFormData) => void;
};

export default function FormTask({ onClose, taskToEdit, onSave }: FormTaskProps) {
    const {
        formData,
        errors,
        isEditing,
        updateField,
        handleInputChange,
        handleSubmit,
    } = useTaskForm({
        taskToEdit,
        onSuccess: onSave,
    });

    return (
        <section className="flex flex-col gap-5 sm:gap-6">
            <h2
                id="form-task-title"
                className="pr-12 text-xl font-bold text-[#111827] sm:text-2xl"
            >
                {isEditing ? "Editar tarefa" : "Nova tarefa"}
            </h2>

            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="title" className={labelClassName}>
                        Título <RequiredMark />
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Digite o título da tarefa"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`${fieldClassName} ${
                            errors.title
                                ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                                : ""
                        }`}
                    />

                    <FieldError message={errors.title} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className={labelClassName}>
                        Descrição
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Descreva os detalhes da tarefa..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`${fieldClassName} resize-none`}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="status" className={labelClassName}>
                        Status <RequiredMark />
                    </label>

                    <ColoredSelect
                        id="status"
                        value={formData.status}
                        options={statusOptions}
                        placeholder="Selecione o status"
                        hasError={Boolean(errors.status)}
                        onChange={(value) => updateField("status", value)}
                    />

                    <FieldError message={errors.status} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="priority" className={labelClassName}>
                        Prioridade <RequiredMark />
                    </label>

                    <ColoredSelect
                        id="priority"
                        value={formData.priority}
                        options={priorityOptions}
                        placeholder="Selecione a prioridade"
                        hasError={Boolean(errors.priority)}
                        onChange={(value) => updateField("priority", value)}
                    />

                    <FieldError message={errors.priority} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="date" className={labelClassName}>
                        Data de criação
                    </label>

                    <div className="relative">
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`${fieldClassName} pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                        />

                        <FaRegCalendarAlt
                            className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#6B7280]"
                            aria-hidden
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F1FF] sm:text-base"
                    >
                        Cancelar
                    </button>

                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                        {isEditing ? "Salvar alterações" : "Criar tarefa"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
