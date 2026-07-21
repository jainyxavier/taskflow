type FieldErrorProps = {
    message?: string;
};

export default function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;

    return (
        <span
            className="text-sm text-red-500"
            role="alert"
            aria-live="polite"
        >
            {message}
        </span>
    );
}