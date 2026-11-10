import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { IoPersonAddOutline } from "react-icons/io5";
import { LuEye, LuEyeOff } from "react-icons/lu";
import AuthLayout from "../components/AuthLayout";
import AuthTransitionOverlay from "../components/AuthTransitionOverlay";
import FieldError from "../components/FieldError";
import { useAuthTransition } from "../hooks/useAuthTransition";
import {
    AuthRequestError,
    POST_REGISTER_PATH,
    markSessionTrusted,
    register,
    type AuthFieldErrors,
} from "../utils/auth";

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

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isTransitioning, startTransition } = useAuthTransition();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setFieldErrors({});

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");
        const nextFieldErrors: AuthFieldErrors = {};

        if (!name) {
            nextFieldErrors.name = "Nome é obrigatório";
        } else if (name.length < 2) {
            nextFieldErrors.name = "O nome deve ter pelo menos 2 caracteres.";
        }

        if (!isValidEmail(email)) {
            nextFieldErrors.email = "Email inválido";
        }

        if (password.length < 8) {
            nextFieldErrors.password = "Mínimo 8 caracteres";
        }

        if (!confirmPassword || password !== confirmPassword) {
            nextFieldErrors.confirmPassword = "Senhas não coincidem";
        }

        if (
            nextFieldErrors.name ||
            nextFieldErrors.email ||
            nextFieldErrors.password ||
            nextFieldErrors.confirmPassword
        ) {
            setFieldErrors(nextFieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await register(name, email, password);
            markSessionTrusted();
            startTransition(() => {
                navigate(POST_REGISTER_PATH, { replace: true });
            });
        } catch (err) {
            if (err instanceof AuthRequestError) {
                setFieldErrors(err.fields);
                if (!err.fields.name && !err.fields.email && !err.fields.password) {
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
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={fieldErrors.name ? "name-error" : undefined}
                            placeholder="Digite seu nome"
                            className={inputClassName(Boolean(fieldErrors.name))}
                        />
                    </div>
                    <FieldError id="name-error" message={fieldErrors.name} />
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
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={100}
                            aria-invalid={Boolean(fieldErrors.password)}
                            aria-describedby={fieldErrors.password ? "password-error" : undefined}
                            placeholder="Mínimo de 8 caracteres"
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
                            aria-invalid={Boolean(fieldErrors.confirmPassword)}
                            aria-describedby={
                                fieldErrors.confirmPassword ? "confirm-password-error" : undefined
                            }
                            placeholder="Repita sua senha"
                            className={inputClassName(Boolean(fieldErrors.confirmPassword), true)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={
                                showConfirmPassword
                                    ? "Ocultar confirmação de senha"
                                    : "Mostrar confirmação de senha"
                            }
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#9CA3AF] hover:text-[#6B7280]"
                        >
                            {showConfirmPassword ? (
                                <LuEyeOff className="size-5" />
                            ) : (
                                <LuEye className="size-5" />
                            )}
                        </button>
                    </div>
                    <FieldError id="confirm-password-error" message={fieldErrors.confirmPassword} />
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
