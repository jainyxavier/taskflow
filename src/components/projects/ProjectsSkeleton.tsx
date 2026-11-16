export default function ProjectsSkeleton() {
    return (
        <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Carregando projetos"
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="h-6 w-16 animate-pulse rounded-md bg-[#EDE9FE]" />
                        <div className="h-6 w-14 animate-pulse rounded-full bg-[#F3F4F6]" />
                    </div>
                    <div className="h-6 w-3/4 animate-pulse rounded-md bg-[#F3F4F6]" />
                    <div className="h-4 w-full animate-pulse rounded-md bg-[#F3F4F6]" />
                    <div className="h-4 w-2/3 animate-pulse rounded-md bg-[#F3F4F6]" />
                </div>
            ))}
        </div>
    );
}
