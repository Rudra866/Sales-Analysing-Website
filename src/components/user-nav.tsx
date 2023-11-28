'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Moon, Sun} from "lucide-react";
import * as React from "react";
import {useTheme} from "next-themes";
import { useRouter } from 'next/navigation'
import useAuth from "@/hooks/use-auth";
import {getAllTasksByAssignee, getSupabaseBrowserClient} from "@/lib/database";
import EmployeeAvatar from "@/components/employee-avatar";
import {useEffect, useState} from "react";


const userDirectory = {
  profile: "/admin"
}

export function UserNav() {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient();
  const {employee, user} = useAuth();
  const [notify, setNotify] = useState(false)


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh()
  }



  useEffect(() => {
    employee && getAllTasksByAssignee(supabase, employee.id)
        .then((res) => {
          const start = res.sort((a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime())
          console.log("notify", new Date(start[start.length - 1].CreatedTime) > new Date(user?.last_sign_in_at || '' ))

          // if the last task is overdue, notify the user
          if (start.length > 0 && new Date(start[start.length - 1].CreatedTime) > new Date(user?.last_sign_in_at || '' )) {
            console.log("notify")
            setNotify(true)
          }

        })
  }, [employee])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <EmployeeAvatar employee={employee} notify={notify}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{employee?.Name ?? "Guest"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {employee?.Email ?? "nobody@nobody.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>Change theme</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
