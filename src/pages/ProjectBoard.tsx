import { Link, useParams } from "react-router-dom";

export default function ProjectBoard() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Board do projeto</h1>
            <p className="max-w-md text-base text-[#6B7280]">
                O board Kanban deste projeto será implementado no próximo card. Projeto:{" "}
                <span className="font-medium text-[#111827]">{id}</span>
            </p>
            <Link
                to="/projects"
                className="rounded-md bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6D28D9]"
            >
                Voltar para projetos
            </Link>
        </div>
    );
}
