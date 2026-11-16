import { HiOutlineFolderOpen } from "react-icons/hi2";
import { IoIosAdd } from "react-icons/io";
import Button from "../Button";

type ProjectsEmptyStateProps = {
    onCreateProject: () => void;
    hasSearch?: boolean;
};

export default function ProjectsEmptyState({
    onCreateProject,
    hasSearch = false,
}: ProjectsEmptyStateProps) {
    return (
        <section className="mx-auto flex w-full max-w-200 flex-col items-center justify-center gap-5 rounded-2xl bg-white px-4 py-10 text-center shadow-sm sm:gap-6 sm:px-6 sm:py-12">
            <div className="flex items-center justify-center rounded-full bg-[#F3F1FF] p-4 sm:p-5">
                <HiOutlineFolderOpen className="h-20 w-20 text-[#B8B4D9] sm:h-24 sm:w-24" />
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                    {hasSearch ? "Nenhum projeto encontrado" : "Nenhum projeto ainda"}
                </h2>
                <p className="mx-auto max-w-md text-base text-[#6B7280] sm:text-lg">
                    {hasSearch
                        ? "Tente outro termo de busca ou limpe o filtro para ver todos os projetos."
                        : "Crie seu primeiro projeto para começar a organizar seu trabalho."}
                </p>
            </div>

            {!hasSearch && (
                <Button size="lg" onClick={onCreateProject} aria-label="Criar primeiro projeto">
                    <IoIosAdd size={22} color="#fff" />
                    Criar primeiro projeto
                </Button>
            )}
        </section>
    );
}
