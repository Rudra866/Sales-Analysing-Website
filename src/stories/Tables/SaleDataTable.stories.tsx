// todo modify when we remove data collection from the tables
import DataTable, {DataTableProps} from "@/components/tables/data-table";
import {Meta, StoryObj} from "@storybook/react";
import {Sale} from "@/lib/database";
import SalesTable from "@/components/tables/sales-table";
import {test_employee_set, test_sales_set} from "@/tests/test_data";

export default {
  title: 'Tables/Sales Table',
  component: DataTable,
  render: () => <SalesTable data={test_sales_set} loading={false} employees={test_employee_set}/>
} as Meta;


export const Sales: StoryObj<DataTableProps<Sale>> = {
  args: {

  }
}