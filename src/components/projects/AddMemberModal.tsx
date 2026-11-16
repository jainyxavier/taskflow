import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addProjectMember,
    ProjectMemberRequestError,
} from "../../api/projects";
import { searchUsersByEmail, type ListedUser } from "../../api/users";
import type { ProjectRole } from "../../types/project";
import { MANAGEABLE_ROLES, getProjectRoleLabel } from "../../utils/projectRoles";
import { fieldClassName, labelClassName } from "../../constants/form.constants";
import Avatar from "../Avatar";
import Button from "../Button";
import FieldError from "../FieldError";
import Modal from "../Modal";

type AddMemberModalProps = {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function AddMemberModal({
    projectId,
    isOpen,
    onClose,
}: AddMemberModalProps) {
    const queryClient = useQueryClient();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<ProjectRole>("developer");
    const [searchResult, setSearchResult] = useState<ListedUser | null>(null);
    const [error, setError] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    function resetForm() {
        setEmail("");
        setRole("developer");
        setSearchResult(null);
        setError("");
        setIsSearching(false);
    }

    const addMutation = useMutation({
        mutationFn: () => {
            if (!searchResult) {
                throw new ProjectMemberRequestError("Busque um usuário antes de adicionar");
            }

            return addProjectMember(projectId, {
                userId: searchResult.id,
                role,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            resetForm();
            onClose();
        },
        onError: (err) => {
            if (err instanceof ProjectMemberRequestError) {
                setError(err.message);
                return;
            }
            setError("Não foi possível adicionar o membro");
        },
    });

    function handleClose() {
        if (addMutation.isPending) return;
        resetForm();
        onClose();
    }

    async function handleSearch(event?: FormEvent) {
        event?.preventDefault();
        setError("");
        setSearchResult(null);

        const value = email.trim();
        if (!value) {
            setError("Informe o e-mail do usuário.");
            return;
        }

        setIsSearching(true);
        try {
            const user = await searchUsersByEmail(value);
            if (!user) {
                setError("Usuário não encontrado");
                return;
            }
            setSearchResult(user);
        } catch {
            setError("Erro ao buscar usuário");
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <section className="flex flex-col gap-5 sm:gap-6">
                <h2
                    id="form-task-title"
                    className="pr-12 text-xl font-bold text-[#111827] sm:text-2xl"
                >
                    Adicionar Membro
                </h2>

                <form className="flex flex-col gap-4" onSubmit={handleSearch}>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="member-email" className={labelClassName}>
                            E-mail do usuário
                        </label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                id="member-email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setSearchResult(null);
                                    if (error) setError("");
                                }}
                                placeholder="usuario@exemplo.com"
                                className={fieldClassName}
                                disabled={isSearching || addMutation.isPending}
                            />
                            <Button
                                type="submit"
                                className="h-11 shrink-0 px-4 py-0 text-sm sm:text-sm"
                                disabled={isSearching || addMutation.isPending || !email.trim()}
                            >
                                {isSearching ? "Buscando..." : "Buscar"}
                            </Button>
                        </div>
                    </div>
                </form>

                {searchResult && (
                    <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                        <div className="mb-4 flex items-center gap-3">
                            <Avatar name={searchResult.name} />
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-[#111827]">
                                    {searchResult.name}
                                </p>
                                <p className="truncate text-sm text-[#6B7280]">
                                    {searchResult.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="member-role" className={labelClassName}>
                                Role
                            </label>
                            <select
                                id="member-role"
                                value={role}
                                onChange={(event) =>
                                    setRole(event.target.value as ProjectRole)
                                }
                                className={fieldClassName}
                                disabled={addMutation.isPending}
                            >
                                {MANAGEABLE_ROLES.map((option) => (
                                    <option key={option} value={option}>
                                        {getProjectRoleLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {error && <FieldError message={error} />}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={addMutation.isPending}
                        className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F1FF] disabled:cursor-wait disabled:opacity-70 sm:text-base"
                    >
                        Cancelar
                    </button>
                    <Button
                        type="button"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={!searchResult || addMutation.isPending}
                        onClick={() => addMutation.mutate()}
                    >
                        {addMutation.isPending ? "Adicionando..." : "Adicionar"}
                    </Button>
                </div>
            </section>
        </Modal>
    );
}
