'use client'

import {Employee, ReferencePage, Sale, Task} from "@/lib/database";
import {DateRange} from "react-day-picker";
import React from "react";

type AdminContextProps = {
    tasks?: Task[];
    sales?: Sale[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    employee?: Employee | null;
    referencePage?: ReferencePage[]

}
