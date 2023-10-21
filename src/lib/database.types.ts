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
          Email: string | null
          EmployeeNumber: string
          id: number
          LastAccessed: string
          Name: string
          Password: string
          Role: number
        }
        Insert: {
          CreatedOn?: string
          Email?: string | null
          EmployeeNumber: string
          id?: number
          LastAccessed?: string
          Name: string
          Password: string
          Role: number
        }
        Update: {
          CreatedOn?: string
          Email?: string | null
          EmployeeNumber?: string
          id?: number
          LastAccessed?: string
          Name?: string
          Password?: string
          Role?: number
        }
        Relationships: [
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
          ModifyPermission: boolean
          ReadPermission: boolean
          RoleName: string | null
          WritePermission: boolean
        }
        Insert: {
          DatabasePermission?: boolean
          EmployeePermission?: boolean
          id?: number
          ModifyPermission?: boolean
          ReadPermission?: boolean
          RoleName?: string | null
          WritePermission?: boolean
        }
        Update: {
          DatabasePermission?: boolean
          EmployeePermission?: boolean
          id?: number
          ModifyPermission?: boolean
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
          EmployeeID: number
          FinancingID: number | null
          FinAndInsurance: number
          GrossProfit: number
          Holdback: number
          id: number
          SaleTime: string | null
          StockNumber: string
          Total: number
          TradeInID: number | null
          VehicleMake: string
        }
        Insert: {
          ActualCashValue: number
          CustomerID: number
          EmployeeID: number
          FinancingID?: number | null
          FinAndInsurance: number
          GrossProfit: number
          Holdback: number
          id?: number
          SaleTime?: string | null
          StockNumber: string
          Total: number
          TradeInID?: number | null
          VehicleMake: string
        }
        Update: {
          ActualCashValue?: number
          CustomerID?: number
          EmployeeID?: number
          FinancingID?: number | null
          FinAndInsurance?: number
          GrossProfit?: number
          Holdback?: number
          id?: number
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
          Assignee: number
          Creator: number
          Description: string | null
          GoalTime: string
          id: number
          Name: string
          TotalGoal: number
        }
        Insert: {
          Assignee: number
          Creator: number
          Description?: string | null
          GoalTime: string
          id?: number
          Name: string
          TotalGoal: number
        }
        Update: {
          Assignee?: number
          Creator?: number
          Description?: string | null
          GoalTime?: string
          id?: number
          Name?: string
          TotalGoal?: number
        }
        Relationships: [
          {
            foreignKeyName: "SalesGoals_Assignee_fkey"
            columns: ["Assignee"]
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
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
          Assignee: number
          Creator: number
          DateIssued: string
          Description: string | null
          id: number
          Name: string
          PercentageComplete: number | null
        }
        Insert: {
          Assignee: number
          Creator: number
          DateIssued?: string
          Description?: string | null
          id?: number
          Name: string
          PercentageComplete?: number | null
        }
        Update: {
          Assignee?: number
          Creator?: number
          DateIssued?: string
          Description?: string | null
          id?: number
          Name?: string
          PercentageComplete?: number | null
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
