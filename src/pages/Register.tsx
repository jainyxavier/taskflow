import { useState, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { IoPersonAddOutline } from "react-icons/io5";
import { LuEye, LuEyeOff } from "react-icons/lu";
import AuthLayout from "../components/AuthLayout";
import AuthTransitionOverlay from "../components/AuthTransitionOverlay";
import { useAuthTransition } from "../hooks/useAuthTransition";
import { getPostLoginPath, markSessionTrusted, register } from "../utils/auth";

type LocationState = {
    from?: string;
};

const inputClassName =
    "h-14 w-full rounded-xl border border-[#E5E7EB] bg-white pr-4 pl-12 text-base text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20";

const passwordInputClassName =
    "h-14 w-full rounded-xl border border-[#E5E7EB] bg-white pr-12 pl-12 text-base text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isTransitioning, startTransition } = useAuthTransition();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (name.length < 2) {
            setError("O nome deve ter pelo menos 2 caracteres.");
            return;
        }

        if (password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsSubmitting(true);

        try {
            await register(name, email, password);
            markSessionTrusted();
            const from = (location.state as LocationState | null)?.from;
            startTransition(() => {
                navigate(getPostLoginPath(from), { replace: true });
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Não foi possível criar a conta.");
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout>
            {isTransitioning && <AuthTransitionOverlay message="Entrando..." />}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-[#111827] lg:text-4xl">
                    Crie sua conta
                </h2>
                <p className="mt-3 text-base leading-7 text-[#6B7280] lg:text-lg">
                    Cadastre-se para organizar suas tarefas e acompanhar seu progresso.
                </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-base font-semibold text-[#111827]">
                        Nome
                    </label>
                    <div className="relative">
                        <HiOutlineUser className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            autoComplete="name"
                            id="name"
                            name="name"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            placeholder="Digite seu nome"
                            className={inputClassName}
                        />
                    </div>
                </div>

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
                            className={inputClassName}
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
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={100}
                            placeholder="Mínimo de 8 caracteres"
                            className={passwordInputClassName}
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

                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-base font-semibold text-[#111827]">
                        Confirmar senha
                    </label>
                    <div className="relative">
                        <HiOutlineLockClosed className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={100}
                            placeholder="Repita sua senha"
                            className={passwordInputClassName}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#9CA3AF] hover:text-[#6B7280]"
                        >
                            {showConfirmPassword ? <LuEyeOff className="size-5" /> : <LuEye className="size-5" />}
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
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                    <IoPersonAddOutline className="size-6" />
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B7280] lg:text-base">
                Já tem uma conta?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-[#7C3AED] hover:text-[#6D28D9]"
                >
                    Entrar
                </Link>
            </p>
        </AuthLayout>
    );
}
