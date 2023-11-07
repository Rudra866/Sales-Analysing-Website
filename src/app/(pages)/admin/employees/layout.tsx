import {ReactNode} from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Employee Management'
}

export default function EmployeeLayout({ children }: {children: ReactNode}) {
  return children;
}