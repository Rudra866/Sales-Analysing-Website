import Navigation from "@/components/menu/navigation";

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: ExamplesLayoutProps) {
  return (
      <>
          <Navigation />
          <div className="relative py-10">
              <section className="container flex-1 rounded-[0.5rem]">
                  <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                      {children}
                  </div>
              </section>
          </div>
      </>
  )
}
