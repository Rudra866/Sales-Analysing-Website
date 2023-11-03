"use client"
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {Label} from "@/components/ui/label";

/**
 * Layout that is rendered on all pages in the (pages) directory.
 * @param children
 * @group React Layouts
 */
export default function TestsLayout({ children }: { children: React.ReactNode}) {
  const [childPages, setChildPages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch the list of child pages using route handler
    fetch('/test')
        .then(async (response) => await response.json())
        .then((data) => setChildPages(data.result))
        .catch((error) => console.error(error));
  }, []);

  return (
    <div className="relative py-10 mx-4">
      <section>
        <div className="overflow-clip rounded-[0.5rem] border bg-background shadow">
          <div className={"flex items-center my-4 mx-4" } >
            <h1 className={"mx-2"}>Links:</h1>
            {childPages.map((name)=>
              <
                Button variant={"outline"} className={"mx-2"}
                key={name}
                onClick={()=>router.push(name)}>
                {name}</Button
              >)}
          </div>

        </div>
        <div className="overflow-clip rounded-[0.5rem] border bg-background shadow my-3">
          {children}
        </div>

      </section>
    </div>
  )
}