"use client"
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

/**
 * Layout that is rendered on all pages in the (pages) directory.
 * @param children
 * @group React Layouts
 */
export default function TestsLayout({ children }: { children: React.ReactNode}) {
  const [childPages, setChildPages] = useState([]);

  useEffect(() => {
    // Fetch the list of child pages client-side
    fetch('/test')
        .then((response) => response.json())
        .then((data) => setChildPages(data.result));
  }, []);

  return (
    <div className="relative py-10">
      <section>
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          <div className={"flex my-4 mx-2" } >
          {childPages.map((name)=> <Link className={"flex-grow"} href={`${name}`} key={name}>{name} </Link>)}
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}