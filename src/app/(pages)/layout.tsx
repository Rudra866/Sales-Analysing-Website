/**
 * Layout that is rendered on all pages in the (pages) directory.
 * @param children
 * @group React Layouts
 */
export default function PagesLayout({ children }: { children: React.ReactNode}) {
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
