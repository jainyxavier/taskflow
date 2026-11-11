import { Outlet } from "react-router-dom";
import Header from "../Header";
import { AddTaskActionProvider } from "../../hooks/useAddTaskAction";

export default function AppShell() {
    return (
        <AddTaskActionProvider>
            <div className="auth-enter flex min-h-dvh w-full flex-col bg-[#F3F1FF]">
                <Header />

                <main className="mx-auto flex w-full max-w-325 flex-1 flex-col px-4 pb-8 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </AddTaskActionProvider>
    );
}
