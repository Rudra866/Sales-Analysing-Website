import {cn} from "@/lib/utils";

export default function ContainerLayout({children, className}: { children: React.ReactNode, className?: string }) {
    return (
        <>
            <div className={cn("relative py-10", className)}>
                <section className="container">
                    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                        {children}
                    </div>
                </section>
            </div>
        </>
    )
}
