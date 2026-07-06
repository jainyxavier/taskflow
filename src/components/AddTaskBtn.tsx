import { IoIosAdd } from "react-icons/io";
import Button from "./Button";

type AddTaskBtnProps = {
    buttonText: string;
};

export default function AddTaskBtn({ buttonText }: AddTaskBtnProps) {
    return (
        <Button size="sm">
            <IoIosAdd className="shrink-0" size={20} color="#fff" />
            <span className="sr-only sm:not-sr-only">{buttonText}</span>
        </Button>
    );
}