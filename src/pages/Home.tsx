import { useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyTaskList from "../components/EmptyTaskList";
import Header from "../components/Header";
import Modal from "../components/Modal";
import FormTask from "../components/FormTask";
import TaskCardList from "../components/TaskCardList";
import type { Task, TaskFormData } from "../types/task";
import { formDataToTask } from "../utils/taskMappers";
import { initialTasks } from "../constants/taskList.contants";

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const openCreateForm = () => {
        setTaskToEdit(null);
        setIsFormOpen(true);
    };

    const openEditForm = (task: Task) => {
        setTaskToEdit(task);
        setIsFormOpen(true);
    };

    const handleDeleteTask = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== id)
        );
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setTaskToEdit(null);
    };

    const handleSaveTask = (formData: TaskFormData) => {
        if (taskToEdit) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskToEdit.id
                        ? formDataToTask(formData, task.id, task.isChecked)
                        : task
                )
            );
        } else {
            const nextId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

            setTasks((prevTasks) => [...prevTasks, formDataToTask(formData, nextId)]);
        }

        closeForm();
    };

    const handleToggleTask = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          status: task.status === "Concluído"
                              ? "A fazer"
                              : "Concluído",
                          isChecked: task.status !== "Concluído",
                      }
                    : task
            )
        );
    };

    const hasTasks = tasks.length > 0;

    return (
        <div className="flex min-h-dvh w-full flex-col bg-[#F3F1FF]">
            <Header onAddTask={openCreateForm} />

            <main className="mx-auto flex w-full max-w-325 flex-1 flex-col px-4 pb-8 sm:px-6 lg:px-8">
                {!hasTasks ? (
                    <>
                        <PageHeader />
                        <EmptyTaskList onAddTask={openCreateForm} />
                    </>
                ) : (
                    <TaskCardList 
                        tasks={tasks} 
                        onEditTask={openEditForm} 
                        onDeleteTask={handleDeleteTask} 
                        onToggleTask={handleToggleTask}
                    />
                )}
            </main>

            <Modal isOpen={isFormOpen} onClose={closeForm}>
                <FormTask
                    onClose={closeForm}
                    taskToEdit={taskToEdit}
                    onSave={handleSaveTask}
                />
            </Modal>
        </div>
    );
}
