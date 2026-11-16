import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import Button from "../Button";
import FieldError from "../FieldError";
import Modal from "../Modal";
import RequiredMark from "../RequiredMark";
import { ProjectRequestError } from "../../api/projects";
import { fieldClassName, labelClassName } from "../../constants/form.constants";
import type { CreateProjectInput } from "../../types/project";

type CreateProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProjectInput) => Promise<void>;
    isSubmitting: boolean;
};

const KEY_PATTERN = /^[A-Z]{2,10}$/;

function CreateProjectForm({
    onClose,
    onSubmit,
    isSubmitting,
}: Omit<CreateProjectModalProps, "isOpen">) {
    const [name, setName] = useState("");
    const [key, setKey] = useState("");
    const [description, setDescription] = useState("");
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<"name" | "key" | "description", string>>
    >({});
    const [formError, setFormError] = useState("");

    function validate(): boolean {
        const nextErrors: Partial<Record<"name" | "key" | "description", string>> = {};

        if (!name.trim()) {
            nextErrors.name = "Informe o nome do projeto.";
        }

        if (!KEY_PATTERN.test(key)) {
            nextErrors.key = "Key deve ter 2-10 letras maiúsculas";
        }

        setFieldErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError("");

        if (!validate()) return;

        try {
            await onSubmit({
                name: name.trim(),
                key,
                description: description.trim() || undefined,
            });
        } catch (error) {
            if (error instanceof ProjectRequestError) {
                setFieldErrors(error.fields);
                if (!error.fields.name && !error.fields.key && !error.fields.description) {
                    setFormError(error.message);
                } else if (error.status === 409) {
                    setFormError("Esta key já está em uso");
                }
                return;
            }

            if (isAxiosError(error) && error.response?.status === 409) {
                setFieldErrors({ key: "Esta key já está em uso" });
                setFormError("Esta key já está em uso");
                return;
            }

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível conectar ao servidor",
            );
        }
    }

    return (
        <section className="flex flex-col gap-5 sm:gap-6">
            <h2
                id="form-task-title"
                className="pr-12 text-xl font-bold text-[#111827] sm:text-2xl"
            >
                Novo Projeto
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="project-name" className={labelClassName}>
                        Nome <RequiredMark />
                    </label>
                    <input
                        id="project-name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            if (fieldErrors.name) {
                                setFieldErrors((prev) => ({ ...prev, name: undefined }));
                            }
                        }}
                        placeholder="Ex: Backend Services"
                        className={`${fieldClassName} ${
                            fieldErrors.name
                                ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                                : ""
                        }`}
                        disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.name} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="project-key" className={labelClassName}>
                        Key <RequiredMark />
                    </label>
                    <input
                        id="project-key"
                        name="key"
                        type="text"
                        value={key}
                        maxLength={10}
                        onChange={(event) => {
                            const nextKey = event.target.value
                                .toUpperCase()
                                .replace(/[^A-Z]/g, "");
                            setKey(nextKey);
                            if (fieldErrors.key) {
                                setFieldErrors((prev) => ({ ...prev, key: undefined }));
                            }
                            if (formError) setFormError("");
                        }}
                        placeholder="Ex: BACK, PROJ"
                        className={`${fieldClassName} uppercase tracking-wide ${
                            fieldErrors.key
                                ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                                : ""
                        }`}
                        disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.key} />
                    {!fieldErrors.key && (
                        <span className="text-xs text-[#6B7280]">
                            2 a 10 letras maiúsculas (A-Z)
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="project-description" className={labelClassName}>
                        Descrição
                    </label>
                    <textarea
                        id="project-description"
                        name="description"
                        rows={3}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Descrição opcional do projeto"
                        className={`${fieldClassName} resize-none`}
                        disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.description} />
                </div>

                {formError && (
                    <p className="text-sm text-red-500" role="alert">
                        {formError}
                    </p>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F1FF] disabled:cursor-wait disabled:opacity-70 sm:text-base"
                    >
                        Cancelar
                    </button>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting || !name.trim() || !key}
                    >
                        {isSubmitting ? "Criando..." : "Criar Projeto"}
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default function CreateProjectModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
}: CreateProjectModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {isOpen ? (
                <CreateProjectForm
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            ) : null}
        </Modal>
    );
}
