import fs from "fs/promises";
import path from "path";
import Link from "next/link";

/**
 * Layout that is rendered on all pages in the (pages) directory.
 * @param children
 * @group React Layouts
 */
export default async function TestsLayout({children}: { children: React.ReactNode }) {
  const dir = "src/app/(pages)/admin/test"
  const filesAndDirs = await fs.readdir(dir);
  const directories = [];

  for (const item of filesAndDirs) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);

    if (stats.isDirectory()) {
      directories.push(item);
    }
  }
  return (
      <div className="relative py-10 mx-4">
        <section>
          <div className="overflow-clip rounded-[0.5rem] border bg-background shadow">
            <div className={"flex items-center my-4 mx-4"}>
              <h1 className={"mx-2"}>Links:</h1>
              <div className={"overflow-scroll py-3"}>
                {directories.map((name) =>
                    <Link key={name}
                          href={name}
                          className={"mx-4 text-foreground"}>{name}</Link>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-clip rounded-[0.5rem] border bg-background shadow my-3">
            {children}
          </div>
        </section>
      </div>
  )
}
