import { LiaClipboardListSolid } from "react-icons/lia";
import AddTaskBtn from "./AddTaskBtn";

export default function EmptyTaskList() {
    return (
        <section className="mx-auto flex w-full max-w-[800px] flex-col items-center justify-center gap-5 rounded-2xl bg-white px-4 py-8 text-center shadow-sm sm:gap-6 sm:px-6 sm:py-10 md:gap-7 md:px-8">
            <div className="flex items-center justify-center rounded-full bg-[#F3F1FF] p-4 sm:p-5">
                <LiaClipboardListSolid
                    className="h-24 w-24 text-[#B8B4D9] sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-[200px] lg:w-[200px]"
                />
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
                <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                    Nenhuma tarefa cadastrada
                </h2>

                <p className="mx-auto max-w-md text-base text-[#6B7280] sm:text-lg md:max-w-lg md:text-xl">
                    Crie sua primeira tarefa para começar a organizar seu fluxo de trabalho.
                </p>
            </div>

            <AddTaskBtn buttonText="Criar primeira tarefa" />
        </section>
    );
}
