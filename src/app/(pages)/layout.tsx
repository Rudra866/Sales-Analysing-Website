
interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default async function ExamplesLayout({ children }: ExamplesLayoutProps) {
  // const router = useRouter()
  // const supabase = useSupabase()
  //
  // useLayoutEffect(() => {
  //       const { data: authListener } = supabase.supabase.auth.onAuthStateChange(
  //           (event, session) => {
  //             if (session?.user) {
  //               router.push('/app')
  //             } else {
  //               router.push('/authentication')
  //             }
  //           }
  //       );
  //       return () => {authListener?.subscription.unsubscribe()};
  //     }
  //     , [supabase.supabase.auth, router]);


  return (
    <>
      {/*<div className="relative py-10">*/}
      {/*  <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">*/}
            {children}
      {/*  </section>*/}
      {/*</div>*/}
    </>
  )
}
