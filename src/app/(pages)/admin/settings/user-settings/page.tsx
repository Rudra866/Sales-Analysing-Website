import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic";

const UserForm = dynamic(() => import("../components/user-form"));
export default function UserSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Add New User</h3>
        <p className="text-sm text-muted-foreground">
          Add a New User to Your Application.
        </p>
      </div>
      <Separator />
      <UserForm />
    </div>
  )
}
