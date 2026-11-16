import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoIosAdd } from "react-icons/io";
import { createProject, listProjects } from "../api/projects";
import Button from "../components/Button";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectsEmptyState from "../components/projects/ProjectsEmptyState";
import ProjectsErrorState from "../components/projects/ProjectsErrorState";
import ProjectsPagination from "../components/projects/ProjectsPagination";
import ProjectsSkeleton from "../components/projects/ProjectsSkeleton";
import type { CreateProjectInput } from "../types/project";

const PAGE_LIMIT = 20;

export default function Projects() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [searchInput]);

    const { data, isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ["projects", page, search],
        queryFn: () => listProjects({ page, limit: PAGE_LIMIT, search }),
    });

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["projects"] });
            setIsModalOpen(false);
        },
    });

    async function handleCreateProject(input: CreateProjectInput) {
        await createMutation.mutateAsync(input);
    }

    const projects = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const showInitialLoading = isLoading && !data;
    const showEmpty = !showInitialLoading && !isError && projects.length === 0;

    return (
        <div className="flex w-full flex-1 flex-col pt-6 sm:pt-8">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
                        Meus Projetos
                    </h1>
                    <p className="text-sm text-[#6B7280] sm:text-base">
                        Veja e organize os seus projetos
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <label className="relative w-full sm:w-72">
                        <span className="sr-only">Buscar projetos</span>
                        <HiOutlineMagnifyingGlass
                            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#9CA3AF]"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Buscar projetos..."
                            className="h-11 w-full rounded-md border border-[#E5E7EB] bg-white pr-3 pl-10 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] transition-shadow focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                        />
                    </label>

                    <Button
                        className="h-11 w-full px-4 py-0 text-sm sm:w-auto sm:text-sm"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Novo Projeto"
                    >
                        <IoIosAdd size={20} color="#fff" />
                        Novo Projeto
                    </Button>
                </div>
            </div>

            {showInitialLoading && <ProjectsSkeleton />}

            {isError && !showInitialLoading && (
                <ProjectsErrorState onRetry={() => void refetch()} />
            )}

            {showEmpty && (
                <ProjectsEmptyState
                    hasSearch={Boolean(search)}
                    onCreateProject={() => setIsModalOpen(true)}
                />
            )}

            {!showInitialLoading && !isError && projects.length > 0 && (
                <>
                    <div
                        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                            isFetching ? "opacity-70" : ""
                        }`}
                    >
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => navigate(`/projects/${project.id}/board`)}
                            />
                        ))}
                    </div>

                    <ProjectsPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!createMutation.isPending) {
                        setIsModalOpen(false);
                    }
                }}
                onSubmit={handleCreateProject}
                isSubmitting={createMutation.isPending}
            />
        </div>
    );
}
