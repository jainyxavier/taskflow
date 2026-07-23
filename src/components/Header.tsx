import { LuClipboardCheck } from "react-icons/lu";
import AddTaskBtn from "./AddTaskBtn";

type HeaderProps = {
    onAddTask: () => void;
};

export default function Header({ onAddTask }: HeaderProps) {
    return (
        <header className="w-full px-4 pt-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center rounded-md bg-[#7C3AED] p-1.5">
                        <LuClipboardCheck size={26} color="#fff" />
                    </div>

                    <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                        Task<span className="text-[#7C3AED]">Flow</span>
                    </h2>
                </div>

                <AddTaskBtn buttonText="Nova Tarefa" onClick={onAddTask} />
            </div>
        </header>
    );
}
