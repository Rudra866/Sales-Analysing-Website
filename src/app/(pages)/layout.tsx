import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Examples",
  description: "Check out some examples app built using the components.",
}

interface ExamplesLayoutProps {
  children: React.ReactNode
}
// todo loading skeleton & spinner, and error handling, and 404

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <>
      <div className="relative pt-10">
        <section>
          <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            {children}
          </div>
        </section>
      </div>
    </>
  )
}
