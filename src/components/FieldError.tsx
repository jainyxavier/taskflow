type FieldErrorProps = {
    id?: string;
    message?: string;
};

export default function FieldError({ id, message }: FieldErrorProps) {
    if (!message) return null;

    return (
        <span
            id={id}
            className="text-sm text-red-500"
            role="alert"
            aria-live="polite"
        >
            {message}
        </span>
    );
}