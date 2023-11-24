"use client";

import { useEffect } from "react";
import DashboardPage from "@/admin/dashboard/page";

/**
 * This page will be used for the admin dashboard.
 * @group Next.js Pages
 * @route `/admin`
 */
export default function AdminPage() {
  useEffect(() => {}, []);
  // this page just aliases /admin/dashboard
  return <DashboardPage />;
}
