const STATUS_LABELS: Record<string, string> = {
    active: "Ativo",
    archived: "Arquivado",
    on_hold: "Em pausa",
};

const STATUS_STYLES: Record<string, string> = {
    active: "bg-[#DCFCE7] text-[#166534]",
    archived: "bg-[#F3F4F6] text-[#4B5563]",
    on_hold: "bg-[#FEF3C7] text-[#92400E]",
};

export function getProjectStatusLabel(status: string) {
    return STATUS_LABELS[status] ?? status;
}

export function getProjectStatusClassName(status: string) {
    return STATUS_STYLES[status] ?? "bg-[#EDE9FE] text-[#5B21B6]";
}
