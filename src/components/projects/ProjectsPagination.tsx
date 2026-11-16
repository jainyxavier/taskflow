type ProjectsPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function ProjectsPagination({
    page,
    totalPages,
    onPageChange,
}: ProjectsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <nav
            className="mt-6 flex items-center justify-center gap-3"
            aria-label="Paginação de projetos"
        >
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F1FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Anterior
            </button>

            <span className="text-sm font-medium text-[#6B7280]">
                Página {page} de {totalPages}
            </span>

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F1FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Próxima
            </button>
        </nav>
    );
}
