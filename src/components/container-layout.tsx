export default function ContainerLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <div className="relative py-10">
                <section className="container">
                    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                        {children}
                    </div>
                </section>
            </div>
        </>
    )
}
