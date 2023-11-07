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
          Avatar: string
          Email: string
          EmployeeNumber: string
          id: string
          Name: string
          Role: number
        }
        Insert: {
          Avatar?: string
          Email?: string
          EmployeeNumber: string
          id: string
          Name: string
          Role: number
        }
        Update: {
          Avatar?: string
          Email?: string | null
          EmployeeNumber?: string
          id?: string
          Name?: string | null
          Role?: number
        }
        Relationships: [
          {
            foreignKeyName: "employees_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_role_fkey"
            columns: ["Role"]
            isOneToOne: false
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
          Employee: string
          id: number
          Sale: number
        }
        Insert: {
          Employee: string
          id?: number
          Sale: number
        }
        Update: {
          Employee?: string
          id?: number
          Sale?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_employee_fkey"
            columns: ["Employee"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sale_fkey"
            columns: ["Sale"]
            isOneToOne: false
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
            foreignKeyName: "sales_customerid_fkey"
            columns: ["CustomerID"]
            isOneToOne: false
            referencedRelation: "Customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_employeeid_fkey"
            columns: ["EmployeeID"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_financingid_fkey"
            columns: ["FinancingID"]
            isOneToOne: false
            referencedRelation: "Financing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_tradeinid_fkey"
            columns: ["TradeInID"]
            isOneToOne: false
            referencedRelation: "TradeIns"
            referencedColumns: ["id"]
          }
        ]
      }
      SalesGoals: {
        Row: {
          Creator: string
          Description: string | null
          EndDate: string
          id: number
          Name: string
          StartDate: string
          TotalGoal: number
        }
        Insert: {
          Creator: string
          Description?: string | null
          EndDate?: string
          id?: number
          Name: string
          StartDate?: string
          TotalGoal: number
        }
        Update: {
          Creator?: string
          Description?: string | null
          EndDate?: string
          id?: number
          Name?: string
          StartDate?: string
          TotalGoal?: number
        }
        Relationships: [
          {
            foreignKeyName: "salesgoals_creator_fkey"
            columns: ["Creator"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          }
        ]
      }
      Tasks: {
        Row: {
          Assignee: string | null
          Creator: string
          Description: string | null
          EndDate: string
          id: number
          Name: string
          PercentageComplete: number | null
          StartDate: string
        }
        Insert: {
          Assignee?: string | null
          Creator: string
          Description?: string | null
          EndDate?: string
          id?: number
          Name: string
          PercentageComplete?: number | null
          StartDate?: string
        }
        Update: {
          Assignee?: string | null
          Creator?: string
          Description?: string | null
          EndDate?: string
          id?: number
          Name?: string
          PercentageComplete?: number | null
          StartDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_fkey"
            columns: ["Assignee"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_creator_fkey"
            columns: ["Creator"]
            isOneToOne: false
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
