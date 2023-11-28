"use client";
import useAuth from "@/hooks/use-auth";
import { redirect } from "next/navigation";


/**
 * The root page of the app. Loads employee/admin specific dashboard.
 * @group Next.js Pages
 * @route `/`
 */
export default function RootPage() {
  const { role } = useAuth();

  if (!role) {
    // loading / corrupt user
    return <></>;
  }

  if (role.EmployeePermission) {
    redirect(`/admin`);
  } else {
    redirect(`/employee`);
  }
}
