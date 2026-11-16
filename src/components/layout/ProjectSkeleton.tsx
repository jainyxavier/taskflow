export default function ProjectSkeleton() {
    return (
        <div
            className="flex w-full flex-1 flex-col gap-4 pt-6 lg:flex-row lg:gap-6"
            aria-busy="true"
            aria-label="Carregando projeto"
        >
            <aside className="w-full shrink-0 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm lg:w-64">
                <div className="mb-5 flex flex-col gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-md bg-[#EDE9FE]" />
                    <div className="h-6 w-40 animate-pulse rounded-md bg-[#F3F4F6]" />
                </div>
                <div className="flex flex-row gap-2 overflow-hidden lg:flex-col">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-10 w-28 shrink-0 animate-pulse rounded-md bg-[#F3F4F6] lg:w-full"
                        />
                    ))}
                </div>
            </aside>

            <section className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="h-8 w-48 animate-pulse rounded-md bg-[#F3F4F6]" />
                <div className="h-4 w-full max-w-md animate-pulse rounded-md bg-[#F3F4F6]" />
                <div className="mt-4 h-40 w-full animate-pulse rounded-xl bg-[#F3F4F6]" />
            </section>
        </div>
    );
}
