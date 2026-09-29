import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { LuClipboardCheck } from "react-icons/lu";
import AddTaskBtn from "./AddTaskBtn";
import AuthTransitionOverlay from "./AuthTransitionOverlay";
import { useAuthTransition } from "../hooks/useAuthTransition";
import { logout } from "../utils/auth";

type HeaderProps = {
    onAddTask: () => void;
};

export default function Header({ onAddTask }: HeaderProps) {
    const navigate = useNavigate();
    const { isTransitioning, startTransition } = useAuthTransition();

    function handleLogout() {
        startTransition(() => {
            logout();
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
                    <AddTaskBtn buttonText="Nova Tarefa" onClick={onAddTask} />

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
