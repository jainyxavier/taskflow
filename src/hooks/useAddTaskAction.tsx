import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type AddTaskActionContextValue = {
    onAddTask: (() => void) | null;
    setOnAddTask: (handler: (() => void) | null) => void;
};

const AddTaskActionContext = createContext<AddTaskActionContextValue | null>(null);

export function AddTaskActionProvider({ children }: { children: ReactNode }) {
    const [onAddTask, setOnAddTaskState] = useState<(() => void) | null>(null);

    const setOnAddTask = useCallback((handler: (() => void) | null) => {
        setOnAddTaskState(() => handler);
    }, []);

    const value = useMemo(
        () => ({ onAddTask, setOnAddTask }),
        [onAddTask],
    );

    return (
        <AddTaskActionContext.Provider value={value}>
            {children}
        </AddTaskActionContext.Provider>
    );
}

function useAddTaskAction() {
    const context = useContext(AddTaskActionContext);
    if (!context) {
        throw new Error("useAddTaskAction precisa estar dentro de AddTaskActionProvider");
    }
    return context;
}

export function useAddTaskButton() {
    return useAddTaskAction().onAddTask;
}

export function useRegisterAddTask(handler: () => void) {
    const { setOnAddTask } = useAddTaskAction();

    useEffect(() => {
        setOnAddTask(handler);
        return () => setOnAddTask(null);
    }, [handler, setOnAddTask]);
}
