import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoIosAdd } from "react-icons/io";
import {
    ProjectMemberRequestError,
    removeProjectMember,
    updateProjectMemberRole,
} from "../api/projects";
import AddMemberModal from "../components/projects/AddMemberModal";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { useProject } from "../hooks/useProject";
import type { ProjectRole } from "../types/project";
import {
    MANAGEABLE_ROLES,
    getProjectRoleLabel,
} from "../utils/projectRoles";

export default function ProjectMembers() {
    const { project, canManageMembers } = useProject();
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [actionError, setActionError] = useState("");
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: ProjectRole }) =>
            updateProjectMemberRole(project.id, userId, role),
        onMutate: ({ userId }) => {
            setActionError("");
            setPendingUserId(userId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["project", project.id] });
        },
        onError: (error) => {
            setActionError(
                error instanceof ProjectMemberRequestError
                    ? error.message
                    : "Não foi possível atualizar a role",
            );
        },
        onSettled: () => setPendingUserId(null),
    });

    const removeMutation = useMutation({
        mutationFn: (userId: string) => removeProjectMember(project.id, userId),
        onMutate: (userId) => {
            setActionError("");
            setPendingUserId(userId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["project", project.id] });
        },
        onError: (error) => {
            setActionError(
                error instanceof ProjectMemberRequestError
                    ? error.message
                    : "Não foi possível remover o membro",
            );
        },
        onSettled: () => setPendingUserId(null),
    });

    function handleRemove(userId: string, name: string) {
        if (!window.confirm(`Remover ${name} do projeto?`)) return;
        removeMutation.mutate(userId);
    }

    const members = project.members ?? [];

    return (
        <section className="flex flex-col gap-5">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
                        Membros do Projeto
                    </h1>
                    <p className="mt-1 text-sm text-[#6B7280] sm:text-base">
                        {members.length}{" "}
                        {members.length === 1 ? "membro" : "membros"}
                    </p>
                </div>

                {canManageMembers && (
                    <Button
                        className="h-11 w-full px-4 py-0 text-sm sm:w-auto sm:text-sm"
                        onClick={() => setIsAddModalOpen(true)}
                        aria-label="Adicionar Membro"
                    >
                        <IoIosAdd size={20} color="#fff" />
                        Adicionar Membro
                    </Button>
                )}
            </header>

            {actionError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
                    {actionError}
                </p>
            )}

            <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]">
                        <tr>
                            <th className="px-4 py-3 font-medium">Membro</th>
                            <th className="px-4 py-3 font-medium">E-mail</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            {canManageMembers && (
                                <th className="px-4 py-3 font-medium">Ações</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => {
                            const isOwner = member.role === "owner";
                            const isPending = pendingUserId === member.userId;

                            return (
                                <tr
                                    key={member.userId}
                                    className="border-b border-[#F3F4F6] last:border-b-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={member.user.name} size="sm" />
                                            <span className="font-medium text-[#111827]">
                                                {member.user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[#6B7280]">
                                        {member.user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        {canManageMembers && !isOwner ? (
                                            <select
                                                value={member.role}
                                                disabled={isPending}
                                                onChange={(event) =>
                                                    updateRoleMutation.mutate({
                                                        userId: member.userId,
                                                        role: event.target
                                                            .value as ProjectRole,
                                                    })
                                                }
                                                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm text-[#111827] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 disabled:opacity-60"
                                                aria-label={`Alterar role de ${member.user.name}`}
                                            >
                                                {MANAGEABLE_ROLES.map((role) => (
                                                    <option key={role} value={role}>
                                                        {getProjectRoleLabel(role)}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-[#EDE9FE] px-2.5 py-1 text-xs font-semibold text-[#7C3AED]">
                                                {getProjectRoleLabel(member.role)}
                                            </span>
                                        )}
                                    </td>
                                    {canManageMembers && (
                                        <td className="px-4 py-3">
                                            {!isOwner ? (
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleRemove(
                                                            member.userId,
                                                            member.user.name,
                                                        )
                                                    }
                                                    className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                                                >
                                                    Remover
                                                </button>
                                            ) : (
                                                <span className="text-xs text-[#9CA3AF]">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <AddMemberModal
                projectId={project.id}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </section>
    );
}
