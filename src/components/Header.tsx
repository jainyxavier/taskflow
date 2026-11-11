import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { LuClipboardCheck } from "react-icons/lu";
import AddTaskBtn from "./AddTaskBtn";
import AuthTransitionOverlay from "./AuthTransitionOverlay";
import { useAddTaskButton } from "../hooks/useAddTaskAction";
import { useAuthTransition } from "../hooks/useAuthTransition";
import { useAuthStore } from "../stores/authStore";
import { logout } from "../utils/auth";

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export default function Header() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage);
    const onAddTask = useAddTaskButton();
    const { isTransitioning, startTransition } = useAuthTransition();

    function handleLogout() {
        startTransition(() => {
            logout();
            hydrateFromStorage();
            navigate("/login", { replace: true });
        });
    }

    return (
        <header className="w-full px-4 pt-4 sm:px-6 lg:px-8">
            {isTransitioning && <AuthTransitionOverlay message="Saindo..." />}

            <div className="mx-auto flex w-full max-w-325 items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center rounded-md bg-[#7C3AED] p-1.5">
                        <LuClipboardCheck size={26} color="#fff" />
                    </div>

                    <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                        Task<span className="text-[#7C3AED]">Flow</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {user && (
                        <div
                            aria-label={`Olá, ${user.name}`}
                            className="mr-1 flex min-w-0 items-center gap-2 sm:mr-2"
                        >
                            <span
                                aria-hidden="true"
                                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-bold text-[#7C3AED] sm:size-9 sm:text-sm"
                            >
                                {getInitials(user.name) || user.name[0]?.toUpperCase()}
                            </span>
                            <p className="hidden min-w-0 flex-col leading-tight sm:flex">
                                <span className="text-xs font-medium text-[#6B7280]">Olá,</span>
                                <span className="max-w-40 truncate text-sm font-semibold text-[#111827] lg:max-w-56">
                                    {user.name}
                                </span>
                            </p>
                        </div>
                    )}

                    {onAddTask && <AddTaskBtn buttonText="Nova Tarefa" onClick={onAddTask} />}

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isTransitioning}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#6B7280] transition-all duration-200 hover:border-[#DDD6FE] hover:bg-[#F5F3FF] hover:text-[#7C3AED] hover:shadow-sm active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:px-3.5 sm:text-base"
                    >
                        <IoIosLogOut className="size-5 shrink-0" />
                        Sair
                    </button>
                </div>
            </div>
        </header>
    );
}
