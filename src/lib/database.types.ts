/** @ignore */
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
  public: {
    Tables: {
      Customers: {
        Row: {
          City: string
          id: number
          Name: string
        }
        Insert: {
          City: string
          id?: number
          Name: string
        }
        Update: {
          City?: string
          id?: number
          Name?: string
        }
        Relationships: []
      }
      Employees: {
        Row: {
          CreatedOn: string
          EmployeeNumber: string
          id: string
          LastAccessed: string
          Name: string
          Role: number
        }
        Insert: {
          CreatedOn?: string
          EmployeeNumber: string
          id: string
          LastAccessed?: string
          Name: string
          Role: number
        }
        Update: {
          CreatedOn?: string
          EmployeeNumber?: string
          id?: string
          LastAccessed?: string
          Name?: string
          Role?: number
        }
        Relationships: [
          {
            foreignKeyName: "Employees_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Employees_Role_fkey"
            columns: ["Role"]
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          }
        ]
      }
      Financing: {
        Row: {
          id: number
          Method: string
        }
        Insert: {
          id?: number
          Method: string
        }
        Update: {
          id?: number
          Method?: string
        }
        Relationships: []
      }
      MonthlySales: {
        Row: {
          FinAndInsurance: number
          GrossProfit: number
          Holdback: number
          id: number
          TimePeriod: string
          Total: number
        }
        Insert: {
          FinAndInsurance: number
          GrossProfit: number
          Holdback: number
          id?: number
          TimePeriod: string
          Total: number
        }
        Update: {
          FinAndInsurance?: number
          GrossProfit?: number
          Holdback?: number
          id?: number
          TimePeriod?: string
          Total?: number
        }
        Relationships: []
      }
      Notifications: {
        Row: {
          Employee: number
          id: number
          Sale: number
        }
        Insert: {
          Employee: number
          id?: number
          Sale: number
        }
        Update: {
          Employee?: number
          id?: number
          Sale?: number
        }
        Relationships: [
          {
            foreignKeyName: "Notifications_Sale_fkey"
            columns: ["Sale"]
            referencedRelation: "Sales"
            referencedColumns: ["id"]
          }
        ]
      }
      Roles: {
        Row: {
          DatabasePermission: boolean
          EmployeePermission: boolean
          id: number
          ModifyAllPermission: boolean
          ModifySelfPermission: boolean
          ReadPermission: boolean
          RoleName: string | null
          WritePermission: boolean
        }
        Insert: {
          DatabasePermission?: boolean
          EmployeePermission?: boolean
          id?: number
          ModifyAllPermission?: boolean
          ModifySelfPermission?: boolean
          ReadPermission?: boolean
          RoleName?: string | null
          WritePermission?: boolean
        }
        Update: {
          DatabasePermission?: boolean
          EmployeePermission?: boolean
          id?: number
          ModifyAllPermission?: boolean
          ModifySelfPermission?: boolean
          ReadPermission?: boolean
          RoleName?: string | null
          WritePermission?: boolean
        }
        Relationships: []
      }
      Sales: {
        Row: {
          ActualCashValue: number
          CustomerID: number
          DaysInStock: number | null
          DealerCost: number | null
          EmployeeID: string
          FinancingID: number | null
          FinAndInsurance: number
          GrossProfit: number
          Holdback: number | null
          id: number
          LotPack: number | null
          NewSale: boolean | null
          ROI: number | null
          SaleTime: string | null
          StockNumber: string
          Total: number
          TradeInID: number | null
          VehicleMake: string
        }
        Insert: {
          ActualCashValue: number
          CustomerID: number
          DaysInStock?: number | null
          DealerCost?: number | null
          EmployeeID: string
          FinancingID?: number | null
          FinAndInsurance: number
          GrossProfit: number
          Holdback?: number | null
          id?: number
          LotPack?: number | null
          NewSale?: boolean | null
          ROI?: number | null
          SaleTime?: string | null
          StockNumber: string
          Total: number
          TradeInID?: number | null
          VehicleMake: string
        }
        Update: {
          ActualCashValue?: number
          CustomerID?: number
          DaysInStock?: number | null
          DealerCost?: number | null
          EmployeeID?: string
          FinancingID?: number | null
          FinAndInsurance?: number
          GrossProfit?: number
          Holdback?: number | null
          id?: number
          LotPack?: number | null
          NewSale?: boolean | null
          ROI?: number | null
          SaleTime?: string | null
          StockNumber?: string
          Total?: number
          TradeInID?: number | null
          VehicleMake?: string
        }
        Relationships: [
          {
            foreignKeyName: "Sales_CustomerID_fkey"
            columns: ["CustomerID"]
            referencedRelation: "Customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sales_EmployeeID_fkey"
            columns: ["EmployeeID"]
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sales_FinancingID_fkey"
            columns: ["FinancingID"]
            referencedRelation: "Financing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sales_TradeInID_fkey"
            columns: ["TradeInID"]
            referencedRelation: "TradeIns"
            referencedColumns: ["id"]
          }
        ]
      }
      SalesGoals: {
        Row: {
          Creator: number
          Description: string | null
          EndDate: string
          id: number
          Name: string
          StartDate: string
          TotalGoal: number
        }
        Insert: {
          Creator: number
          Description?: string | null
          EndDate?: string
          id?: number
          Name: string
          StartDate?: string
          TotalGoal: number
        }
        Update: {
          Creator?: number
          Description?: string | null
          EndDate?: string
          id?: number
          Name?: string
          StartDate?: string
          TotalGoal?: number
        }
        Relationships: []
      }
      Tasks: {
        Row: {
          Assignee: number | null
          Creator: number | null
          Description: string | null
          EndDate: string
          id: number
          Name: string
          PercentageComplete: number | null
          StartDate: string
        }
        Insert: {
          Assignee?: number | null
          Creator?: number | null
          Description?: string | null
          EndDate?: string
          id?: number
          Name: string
          PercentageComplete?: number | null
          StartDate?: string
        }
        Update: {
          Assignee?: number | null
          Creator?: number | null
          Description?: string | null
          EndDate?: string
          id?: number
          Name?: string
          PercentageComplete?: number | null
          StartDate?: string
        }
        Relationships: []
      }
      TradeIns: {
        Row: {
          ActualCashValue: number
          id: number
          Trade: string
        }
        Insert: {
          ActualCashValue: number
          id?: number
          Trade: string
        }
        Update: {
          ActualCashValue?: number
          id?: number
          Trade?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
/** @ignore */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
/** @ignore */
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

/**Represents a complete employee row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link EmployeeInsert} or {@link EmployeeUpdate}.
 *  @interface
 *  @category Database Row */
export type Employee =             Tables<"Employees">;

/** Represents a complete role row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link RoleInsert} or {@link RoleUpdate}.
 *  @interface
 *  @category Database Row */
export type Role =                 Tables<"Roles">;

/** Represents a complete sale row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link SaleInsert} or {@link SaleUpdate}.
 *  @interface
 *  @category Database Row */
export type Sale =                 Tables<"Sales">;
/** Represents a complete sales goal row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link SalesGoalInsert} or {@link SalesGoalUpdate}.
 *  @interface
 *  @category Database Row */
export type SalesGoal =            Tables<"SalesGoals">;
/** Represents a complete monthly sales row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link MonthlySaleInsert} or {@link MonthlySaleUpdate}.
 *  @interface
 *  @category Database Row */
export type MonthlySale =          Tables<"MonthlySales">;
/** Represents a complete customer row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link CustomerInsert} or {@link CustomerUpdate}.
 *  @interface
 *  @category Database Row */
export type Customer  =            Tables<"Customers">;
/** Represents a complete financier row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link FinancierInsert} or {@link FinancierUpdate}.
 *  @interface
 *  @category Database Row */
export type Financier =            Tables<"Financing">;
/** Represents a complete notification row in the database with all required fields. If you need an incomplete
 *  type instead, consider using {@link NotificationInsert} or {@link NotificationUpdate}.
 *  @interface
 *  @category Database Row */
export type Notification =         Tables<"Notifications">;
/** Represents a complete task row in the database with all required fields. If you need an incomplete
    type instead, consider using {@link TaskInsert} or {@link TaskUpdate}.
 *  @interface
 *  @category Database Row */
export type Task =                 Tables<"Tasks">;
/** Represents a complete trade in row in the database with all required fields. If you need an incomplete
    type instead, consider using {@link TradeInInsert} or {@link TradeInUpdate}.
 *  @interface
 *  @category Database Row */
export type TradeIn =              Tables<"TradeIns">;

// todo the rest::
/** @interface
 *  @category Database Insert */
export type EmployeeInsert =       InsertTables<"Employees">;
/** @interface
 *  @category Database Insert */
export type RoleInsert =           InsertTables<"Roles">;
/** @interface
 *  @category Database Insert */
export type SaleInsert =           InsertTables<"Sales">;
/** @interface
 *  @category Database Insert */
export type SalesGoalInsert =      InsertTables<"SalesGoals">;
/** @interface
 *  @category Database Insert */
export type MonthlySaleInsert =    InsertTables<"MonthlySales">;
/** @interface
 *  @category Database Insert */
export type CustomerInsert  =      InsertTables<"Customers">;
/** @interface
 *  @category Database Insert */
export type FinancierInsert =      InsertTables<"Financing">;
/** @interface
 *  @category Database Insert */
export type NotificationInsert =   InsertTables<"Notifications">;
/** @interface
 *  @category Database Insert */
export type TaskInsert =           InsertTables<"Tasks">;
/** @interface
 *  @category Database Insert */
export type TradeInInsert =        InsertTables<"TradeIns">;

/** @interface
 *  @category Database Update */
export type EmployeeUpdate =       UpdateTables<"Employees">;
/** @interface
 *  @category Database Update */
export type RoleUpdate =           UpdateTables<"Roles">;
/** @interface
 *  @category Database Update */
export type SaleUpdate =           UpdateTables<"Sales">;
/** @interface
 *  @category Database Update */
export type SalesGoalUpdate =      UpdateTables<"SalesGoals">;
/** @interface
 *  @category Database Update */
export type MonthlySaleUpdate =    UpdateTables<"MonthlySales">;
/** @interface
 *  @category Database Update */
export type CustomerUpdate  =      UpdateTables<"Customers">;
/** @interface
 *  @category Database Update */
export type FinancierUpdate =      UpdateTables<"Financing">;
/** @interface
 *  @category Database Update */
export type NotificationUpdate =   UpdateTables<"Notifications">;
/** @interface
 *  @category Database Update */
export type TaskUpdate =           UpdateTables<"Tasks">;
/** @interface
 *  @category Database Update */
export type TradeInUpdate =        UpdateTables<"TradeIns">;