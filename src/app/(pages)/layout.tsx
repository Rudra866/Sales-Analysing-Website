import Navigation from "@/components/menu/navigation";

/**
 * Layout that is rendered on all pages in the (pages) directory.
 * @param children
 * @group React Layouts
 */
export default function PagesLayout({ children }: { children: React.ReactNode}) {
  return (
      <>
          <Navigation />
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
