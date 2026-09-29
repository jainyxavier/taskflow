export default function AuthLoadingScreen() {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-[#F4F0FF]">
            <div className="flex flex-col items-center gap-3">
                <div className="size-10 animate-spin rounded-full border-4 border-[#DDD6FE] border-t-[#7C3AED]" />
                <p className="text-sm font-medium text-[#6B7280]">Verificando sessão...</p>
            </div>
        </div>
    );
}
