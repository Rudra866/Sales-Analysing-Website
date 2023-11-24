import {EmployeeProvider} from "@/employee/employee-components/employee-provider";


export default async function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <EmployeeProvider>
                {children}
            </EmployeeProvider>
        </>
    )
}
