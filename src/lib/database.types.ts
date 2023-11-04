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
          id: string
          LastAccessed: string
          Name: string | null
          Role: number
        }
        Insert: {
          CreatedOn?: string
          Email?: string | null
          EmployeeNumber: string
          id: string
          LastAccessed?: string
          Name?: string | null
          Role: number
        }
        Update: {
          CreatedOn?: string
          Email?: string | null
          EmployeeNumber?: string
          id?: string
          LastAccessed?: string
          Name?: string | null
          Role?: number
        }
        Relationships: [
          {
            foreignKeyName: "Employees_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Employees_Role_fkey"
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
            foreignKeyName: "Notifications_Employee_fkey"
            columns: ["Employee"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Notifications_Sale_fkey"
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
            foreignKeyName: "Sales_CustomerID_fkey"
            columns: ["CustomerID"]
            isOneToOne: false
            referencedRelation: "Customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sales_EmployeeID_fkey"
            columns: ["EmployeeID"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sales_FinancingID_fkey"
            columns: ["FinancingID"]
            isOneToOne: false
            referencedRelation: "Financing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sales_TradeInID_fkey"
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
            foreignKeyName: "SalesGoals_Creator_fkey"
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
            foreignKeyName: "Tasks_Assignee_fkey"
            columns: ["Assignee"]
            isOneToOne: false
            referencedRelation: "Employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_Creator_fkey"
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
