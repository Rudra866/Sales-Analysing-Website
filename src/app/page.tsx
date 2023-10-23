import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Sidebar} from "@/components/menu/sidebar";
import {Menu} from "@/components/menu/menu";
import {navigationMenu} from "@/lib/types";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import {Separator} from "@/components/ui/separator";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {PodcastEmptyPlaceholder} from "@/app/(pages)/music/components/podcast-empty-placeholder";


export default async function DashboardPage() {

    // TODO https://youtu.be/KmJN-bEayeY?si=IvDmsmw_xtZHiz1Y


    // const supabase = createServerComponentClient({ cookies })
    //
    // const {data: {session},} = await supabase.auth.getSession();
    //
    // if (!session) {
    //   redirect('/authentication')
    // }
    return (
        <>
            <div className="hidden md:block">
                <Menu />
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Sidebar navigationMenu={navigationMenu} className="hidden lg:block" />
                            <div className="col-span-3 lg:col-span-4 lg:border-l">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    <Tabs defaultValue="music" className="h-full space-y-6">
                                        <div className="space-between flex items-center">
                                            <TabsList>
                                                <TabsTrigger value="music" className="relative">
                                                    Music
                                                </TabsTrigger>
                                                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                                                <TabsTrigger value="live" disabled>
                                                    Live
                                                </TabsTrigger>
                                            </TabsList>
                                            <div className="ml-auto mr-4">
                                                <Button>
                                                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                                                    Add music
                                                </Button>
                                            </div>
                                        </div>
                                        <TabsContent
                                            value="music"
                                            className="border-none p-0 outline-none"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        Listen Now
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Top picks for you. Updated daily.
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="relative">
                                                <ScrollArea>
                                                    <div className="flex space-x-4 pb-4">

                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div>
                                            <div className="mt-6 space-y-1">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    Made for You
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Your personal playlists. Updated daily.
                                                </p>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="relative">
                                                <ScrollArea>
                                                    <div className="flex space-x-4 pb-4">

                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div>
                                        </TabsContent>
                                        <TabsContent
                                            value="podcasts"
                                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        New Episodes
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your favorite podcasts. Updated daily.
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <PodcastEmptyPlaceholder />
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
