import type { ReactNode } from "react";
import { FaCheck, FaRegHeart } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { RxLightningBolt } from "react-icons/rx";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="auth-enter relative min-h-dvh overflow-hidden bg-[#F4F0FF]">
            <div className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-[#E9DFFF] blur-3xl" />
            <div className="pointer-events-none absolute top-20 -right-28 size-112 rounded-full bg-[#E4DBFF] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#EDE7FE] blur-3xl" />

            <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-center gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20 lg:px-16 lg:py-16">
                <section className="flex w-full max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#7C3AED] lg:size-14">
                            <LuClipboardCheck className="size-7 text-white lg:size-8" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#111827] lg:text-5xl">
                            Task<span className="text-[#7C3AED]">flow</span>
                        </h1>
                    </div>

                    <p className="mt-5 text-lg leading-8 text-[#6B7280] lg:text-xl">
                        Organize suas tarefas, <br className="hidden sm:block" />
                        conquiste seus objetivos.
                    </p>

                    <img
                        src="/images/login-illustration.png"
                        alt="Prancheta com tarefas e um vaso de planta"
                        className="mt-8 hidden w-full max-w-sm mix-blend-screen lg:mt-10 lg:block lg:max-w-md"
                    />

                    <div className="mt-8 flex w-full max-w-md items-start justify-between gap-6">
                        <div className="flex flex-col items-center gap-2.5">
                            <span className="flex size-12 items-center justify-center rounded-full border border-[#DDD6FE] bg-[#DDD6FE] text-[#7C3AED]">
                                <RxLightningBolt className="size-6" />
                            </span>
                            <p className="text-sm font-medium leading-5 text-[#6B7280] lg:text-base">
                                Mais produtividade
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-2.5">
                            <span className="flex size-12 items-center justify-center rounded-full border border-[#DDD6FE] bg-[#DDD6FE] text-[#7C3AED]">
                                <FaCheck className="size-5" />
                            </span>
                            <p className="text-sm font-medium leading-5 text-[#6B7280] lg:text-base">
                                Mais foco
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-2.5">
                            <span className="flex size-12 items-center justify-center rounded-full border border-[#DDD6FE] bg-[#DDD6FE] text-[#7C3AED]">
                                <FaRegHeart className="size-5" />
                            </span>
                            <p className="text-sm font-medium leading-5 text-[#6B7280] lg:text-base">
                                Mais resultados
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-[0_24px_70px_rgba(124,58,237,0.10)] sm:p-10 lg:p-12">
                    {children}
                </section>
            </main>
        </div>
    );
}
