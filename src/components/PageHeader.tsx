export default function PageHeader() {
    return (
        <section className="my-6 flex w-full flex-col items-center gap-2 text-center sm:my-8 md:my-10 md:gap-2.5">
            <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-7xl">
                Task<span className="text-[#7C3AED]">Flow</span>
            </h1>

            <p className="max-w-xl text-base text-[#6B7280] sm:text-lg md:text-xl lg:text-2xl">
                Organize suas tarefas com facilidade
            </p>
        </section>
    );
}
