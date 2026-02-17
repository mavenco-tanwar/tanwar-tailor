import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

const SectionWrapper = ({
    children,
    className,
    id,
}: SectionWrapperProps) => {
    return (
        <section id={id} className={cn("py-16 md:py-24", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;
