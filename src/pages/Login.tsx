import { useState, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import { LuEye, LuEyeOff } from "react-icons/lu";
import AuthLayout from "../components/AuthLayout";
import AuthTransitionOverlay from "../components/AuthTransitionOverlay";
import { useAuthTransition } from "../hooks/useAuthTransition";
import { getPostLoginPath, login, markSessionTrusted } from "../utils/auth";

type LocationState = {
    from?: string;
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isTransitioning, startTransition } = useAuthTransition();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        try {
            await login(email, password);
            markSessionTrusted();
            const from = (location.state as LocationState | null)?.from;
            startTransition(() => {
                navigate(getPostLoginPath(from), { replace: true });
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Não foi possível entrar.");
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout>
            {isTransitioning && <AuthTransitionOverlay message="Entrando..." />}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-[#111827] lg:text-4xl">
                    Bem-vindo!
                </h2>
                <p className="mt-3 text-base leading-7 text-[#6B7280] lg:text-lg">
                    Faça login para acessar sua conta e continuar organizando suas tarefas.
                </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-base font-semibold text-[#111827]">
                        E-mail
                    </label>
                    <div className="relative">
                        <HiOutlineMail className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            autoComplete="email"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Digite seu e-mail"
                            className="h-14 w-full rounded-xl border border-[#E5E7EB] bg-white pr-4 pl-12 text-base text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-base font-semibold text-[#111827]">
                        Senha
                    </label>
                    <div className="relative">
                        <HiOutlineLockClosed className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            placeholder="Digite sua senha"
                            className="h-14 w-full rounded-xl border border-[#E5E7EB] bg-white pr-12 pl-12 text-base text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#9CA3AF] hover:text-[#6B7280]"
                        >
                            {showPassword ? <LuEyeOff className="size-5" /> : <LuEye className="size-5" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-sm font-medium text-red-500">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || isTransitioning}
                    className="mt-2 inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C3AED] text-lg font-semibold text-white transition-all duration-200 hover:bg-[#6D28D9] active:scale-[0.98] active:bg-[#5B21B6] disabled:cursor-wait disabled:opacity-70"
                >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                    <IoIosLogIn className="size-6" />
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B7280] lg:text-base">
                Ainda não tem uma conta?{" "}
                <Link
                    to="/cadastro"
                    className="font-semibold text-[#7C3AED] hover:text-[#6D28D9]"
                >
                    Cadastre-se
                </Link>
            </p>
        </AuthLayout>
    );
}
