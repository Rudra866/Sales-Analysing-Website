import {DashboardProvider} from "@/admin/dashboard/components/dashboard-provider";


export default async function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <DashboardProvider>
                {children}
            </DashboardProvider>
        </>
    )
}
