interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default async function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <div className="relative py-10">
      <section>
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          {children}
        </div>
      </section>
    </div>
  )
}
