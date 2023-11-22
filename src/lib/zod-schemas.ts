import { z } from "zod";
import { role_options_config } from "@/components/dialogs/create-role-dialog";

/* Common fields */

const emailField = z
  .string()
  .min(1, {
    message: "Employee Email must not be empty.",
  })
  .max(320, {
    message: "Employee Email must be less than 255 characters.",
  })
  .email({
    message: "Employee Email must be a valid email address.",
  });

export const passwordField = z
  .string()
  .nonempty({ message: "Password must not be empty." });
const passwordModifyField = passwordField.min(8, {
  message: "Password must be at least 8 characters.",
});

const generalStringField = z
  .string()
  .nonempty({
    message: "Required",
  })
  .max(255, {
    message: "Length exceeds maximum",
  });
const uncappedGeneralStringField = z.string();
const optionalGeneralStringField = generalStringField.optional();

const generalNumberField = z.number();

const monetaryNumberField = z.number(); // todo

const roleNumberStringField = z.string().refine(
  (value) => {
    return !isNaN(Number(value)) && Number(value) >= 1;
  },
  {
    message: "Invalid.",
  },
);

/** Authentication */
export const forgotPasswordDialogSchema = z.object({
  email: emailField,
});

export const passwordChangeFormSchema = z.object({
  password: passwordField,
});

export const LoginSchema = z.object({
  email: emailField,
  password: passwordField,
});

/** Employees */
export const existingEmployeeFormSchema = z.object({
  EmployeeNumber: generalStringField,
  Name: generalStringField,
  email: emailField,
  Role: roleNumberStringField,
});

export const referencePageFormSchema = z.object({
  title: generalStringField,
  body: uncappedGeneralStringField.optional(),
});

// TODO need to fix monetary values not being able to have decimals.
export const saleFormSchemaCommon = {
  StockNumber: z.string().min(1, { message: "StockNumber must not be empty." }),
  VehicleMake: z.string().min(1, { message: "VehicleMake must not be empty." }),
  CustomerName: z.string().nonempty("Customer Name must not be empty."),
  CustomerCity: z.string().nonempty("Customer City must not be empty."),
  ActualCashValue: z.number(),
  GrossProfit: z.number(),
  FinAndInsurance: z.number(),
  TradeInID: z.number().optional(),
  NewSale: z.boolean().transform((res) => !res),
  Total: z.number().optional(),
  Holdback: z.number().optional(),
  LotPack: z.number().optional(),
  DaysInStock: z.number().optional(),
  DealerCost: z.number().optional(),
  ROI: z.number().optional(),
};

export const saleFormSchema = z.object({
  ...saleFormSchemaCommon,
});

/*** Roles **/
const roles = Object.fromEntries(
  role_options_config.map((role) => [role.name, z.boolean()]),
);
export const createRoleModalSchema = z.object({
  RoleName: z
    .string()
    .min(1, "Role Name must not be empty")
    .max(255, "Role name exceeds limit"),
  ...roles,
});

export const newTaskSchema = z.object({
  Name: z.string(),
  Description: z.string(),
  // other
});
