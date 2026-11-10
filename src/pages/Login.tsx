import { useState, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import { LuEye, LuEyeOff } from "react-icons/lu";
import AuthLayout from "../components/AuthLayout";
import AuthTransitionOverlay from "../components/AuthTransitionOverlay";
import FieldError from "../components/FieldError";
import { useAuthTransition } from "../hooks/useAuthTransition";
import {
    AuthRequestError,
    getPostLoginPath,
    login,
    markSessionTrusted,
    type AuthFieldErrors,
} from "../utils/auth";

type LocationState = {
    from?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string) {
    return EMAIL_PATTERN.test(email);
}

function inputClassName(hasError: boolean, withPasswordToggle = false) {
    const padding = withPasswordToggle ? "pr-12 pl-12" : "pr-4 pl-12";
    const border = hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-200"
        : "border-[#E5E7EB] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20";

    return `h-14 w-full rounded-xl border bg-white ${padding} text-base text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:ring-2 ${border}`;
}

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isTransitioning, startTransition } = useAuthTransition();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setFieldErrors({});

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const nextFieldErrors: AuthFieldErrors = {};

        if (!isValidEmail(email)) {
            nextFieldErrors.email = "Informe um e-mail válido.";
        }

        if (!password) {
            nextFieldErrors.password = "A senha não pode estar vazia.";
        }

        if (nextFieldErrors.email || nextFieldErrors.password) {
            setFieldErrors(nextFieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            markSessionTrusted();
            const from = (location.state as LocationState | null)?.from;
            startTransition(() => {
                navigate(getPostLoginPath(from), { replace: true });
            });
        } catch (err) {
            if (err instanceof AuthRequestError) {
                setFieldErrors(err.fields);
                if (!err.fields.email && !err.fields.password) {
                    setError(err.message);
                }
            } else {
                setError(
                    err instanceof Error ? err.message : "Não foi possível conectar ao servidor",
                );
            }
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
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={fieldErrors.email ? "email-error" : undefined}
                            placeholder="Digite seu e-mail"
                            className={inputClassName(Boolean(fieldErrors.email))}
                        />
                    </div>
                    <FieldError id="email-error" message={fieldErrors.email} />
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
                            aria-invalid={Boolean(fieldErrors.password)}
                            aria-describedby={fieldErrors.password ? "password-error" : undefined}
                            placeholder="Digite sua senha"
                            className={inputClassName(Boolean(fieldErrors.password), true)}
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
                    <FieldError id="password-error" message={fieldErrors.password} />
                </div>

                {error && (
                    <p className="text-sm font-medium text-red-500" role="alert">
                        {error}
                    </p>
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
