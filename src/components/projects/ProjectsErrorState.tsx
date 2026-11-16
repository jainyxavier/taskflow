import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Button from "../Button";

type ProjectsErrorStateProps = {
    onRetry: () => void;
};

export default function ProjectsErrorState({ onRetry }: ProjectsErrorStateProps) {
    return (
        <section className="mx-auto flex w-full max-w-200 flex-col items-center justify-center gap-5 rounded-2xl bg-white px-4 py-10 text-center shadow-sm sm:gap-6 sm:px-6 sm:py-12">
            <div className="flex items-center justify-center rounded-full bg-[#FEF2F2] p-4 sm:p-5">
                <HiOutlineExclamationTriangle className="h-16 w-16 text-[#EF4444] sm:h-20 sm:w-20" />
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                    Erro ao carregar projetos
                </h2>
                <p className="mx-auto max-w-md text-base text-[#6B7280] sm:text-lg">
                    Não foi possível buscar seus projetos. Verifique a conexão e tente novamente.
                </p>
            </div>

            <Button size="lg" onClick={onRetry} aria-label="Tentar novamente">
                Tentar novamente
            </Button>
        </section>
    );
}
