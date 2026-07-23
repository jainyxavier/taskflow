import { IoIosAdd } from "react-icons/io";
import Button from "./Button";

type AddTaskBtnProps = {
    buttonText: string;
    onClick: () => void;
    size?: "sm" | "lg";
};

export default function AddTaskBtn({ buttonText, onClick, size = "sm" }: AddTaskBtnProps) {
    return (
        <Button size={size} onClick={onClick} aria-label={buttonText}>
            <IoIosAdd className="shrink-0" size={size === "lg" ? 22 : 20} color="#fff" />
            <span className={size === "lg" ? undefined : "sr-only sm:not-sr-only"}>
                {buttonText}
            </span>
        </Button>
    );
}
