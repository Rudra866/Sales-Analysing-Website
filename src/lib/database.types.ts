export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

/**
 * @group Database
 */
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
          AuthUser: string | null
          CreatedOn: string
          Email: string
          EmployeeNumber: string
          id: number
          LastAccessed: string
          Name: string
          Password: string
          Role: number
        }
        Insert: {
          AuthUser?: string | null
          CreatedOn?: string
          Email: string
          EmployeeNumber: string
          id?: number
          LastAccessed?: string
          Name: string
          Password: string
          Role: number
        }
        Update: {
          AuthUser?: string | null
          CreatedOn?: string
          Email?: string
          EmployeeNumber?: string
          id?: number
          LastAccessed?: string
          Name?: string
          Password?: string
          Role?: number
        }
        Relationships: [
          {
            foreignKeyName: "Employees_AuthUser_fkey"
            columns: ["AuthUser"]
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
            foreignKeyName: "Notifications_Employee_fkey"
            columns: ["Employee"]
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
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
          EmployeeID: number
          FinancingID: number | null
          FinAndInsurance: number
          GrossProfit: number
          Holdback: number | null
          id: number
          LotPack: number | null
          NewSale: boolean | null
          ROI: number | null
          SaleTime: string
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
          EmployeeID: number
          FinancingID?: number | null
          FinAndInsurance: number
          GrossProfit: number
          Holdback?: number | null
          id?: number
          LotPack?: number | null
          NewSale?: boolean | null
          ROI?: number | null
          SaleTime?: string
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
          EmployeeID?: number
          FinancingID?: number | null
          FinAndInsurance?: number
          GrossProfit?: number
          Holdback?: number | null
          id?: number
          LotPack?: number | null
          NewSale?: boolean | null
          ROI?: number | null
          SaleTime?: string
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
        Relationships: [
          {
            foreignKeyName: "SalesGoals_Creator_fkey"
            columns: ["Creator"]
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "Tasks_Assignee_fkey"
            columns: ["Assignee"]
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_Creator_fkey"
            columns: ["Creator"]
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

/** @interface
 *  @category Row*/
export type Employee =             Tables<"Employees">;
/** @interface
 *  @category Row*/
export type Role =                 Tables<"Roles">;
/** @interface
 *  @category Row*/
export type Sale =                 Tables<"Sales">;
/** @interface
 *  @category Row*/
export type SalesGoal =            Tables<"SalesGoals">;
/** @interface
 *  @category Row*/
export type MonthlySale =          Tables<"MonthlySales">;
/** @interface
 *  @category Row*/
export type Customer  =            Tables<"Customers">;
/** @interface
 *  @category Row*/
export type Financier =            Tables<"Financing">;
/** @interface
 *  @category Row*/
export type Notification =         Tables<"Notifications">;
/** @interface
 *  @category Row*/
export type Task =                 Tables<"Tasks">;
/** @interface
 *  @category Row*/
export type TradeIn =              Tables<"TradeIns">;

/** @interface
 *  @category Insert*/
export type EmployeeInsert =       InsertTables<"Employees">;
/** @interface
 *  @category Insert*/
export type RoleInsert =           InsertTables<"Roles">;
/** @interface
 *  @category Insert*/
export type SaleInsert =           InsertTables<"Sales">;
/** @interface
 *  @category Insert*/
export type SalesGoalInsert =      InsertTables<"SalesGoals">;
/** @interface
 *  @category Insert*/
export type MonthlySaleInsert =    InsertTables<"MonthlySales">;
/** @interface
 *  @category Insert*/
export type CustomerInsert  =      InsertTables<"Customers">;
/** @interface
 *  @category Insert*/
export type FinancierInsert =      InsertTables<"Financing">;
/** @interface
 *  @category Insert*/
export type NotificationInsert =   InsertTables<"Notifications">;
/** @interface
 *  @category Insert*/
export type TaskInsert =           InsertTables<"Tasks">;
/** @interface
 *  @category Insert*/
export type TradeInInsert =        InsertTables<"TradeIns">;

/** @interface
 *  @category Update */
export type EmployeeUpdate =       UpdateTables<"Employees">;
/** @interface
 *  @category Update */
export type RoleUpdate =           UpdateTables<"Roles">;
/** @interface
 *  @category Update */
export type SaleUpdate =           UpdateTables<"Sales">;
/** @interface
 *  @category Update */
export type SalesGoalUpdate =      UpdateTables<"SalesGoals">;
/** @interface
 *  @category Update */
export type MonthlySaleUpdate =    UpdateTables<"MonthlySales">;
/** @interface
 *  @category Update */
export type CustomerUpdate  =      UpdateTables<"Customers">;
/** @interface
 *  @category Update */
export type FinancierUpdate =      UpdateTables<"Financing">;
/** @interface
 *  @category Update */
export type NotificationUpdate =   UpdateTables<"Notifications">;
/** @interface
 *  @category Update */
export type TaskUpdate =           UpdateTables<"Tasks">;
/** @interface
 *  @category Update */
export type TradeInUpdate =        UpdateTables<"TradeIns">;
