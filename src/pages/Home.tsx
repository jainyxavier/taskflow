import { useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyTaskList from "../components/EmptyTaskList";
import Header from "../components/Header";
import Modal from "../components/Modal";
import FormTask from "../components/FormTask";
import { statusToDo, statusInProgress, statusCompleted } from "../constants/taskList.contants";
import TaskCardList from "../components/TaskCardList";

export default function Home() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    const hasTasks = statusToDo.tasks.length > 0 || statusInProgress.tasks.length > 0 || statusCompleted.tasks.length > 0

    return (
        <div className="flex min-h-dvh w-full flex-col bg-[#F3F1FF]">
            <Header onAddTask={openForm} />

            <main className="mx-auto flex w-full max-w-325 flex-1 flex-col px-4 pb-8 sm:px-6 lg:px-8">
                {!hasTasks ? (
                    <>
                        <PageHeader />
                        <EmptyTaskList onAddTask={openForm} />
                    </>
                ) : (
                    <TaskCardList />
                )}
            </main>

            <Modal isOpen={isFormOpen} onClose={closeForm}>
                <FormTask onClose={closeForm} />
            </Modal>
        </div>
    );
}
