import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: "Paid" | "Unpaid" | "Partial";
    className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const statusStyles = {
        Paid: "bg-green-100 text-green-800 border-green-200",
        Unpaid: "bg-red-100 text-red-800 border-red-200",
        Partial: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
        <span
            className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                statusStyles[status],
                className
            )}
        >
            {status}
        </span>
    );
};
