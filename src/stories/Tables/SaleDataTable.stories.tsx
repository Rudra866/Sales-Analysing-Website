// todo modify when we remove data collection from the tables
import DataTable, {DataTableProps} from "@/components/tables/DataTable";
import {Meta, StoryObj} from "@storybook/react";
import {Sale} from "@/lib/database";
import SalesTable from "@/app/(pages)/sales/components/SalesTable";

export default {
  title: 'Tables/Sales Table',
  component: DataTable,
  render: () => <SalesTable/>
} as Meta;


export const Sales: StoryObj<DataTableProps<Sale>> = {
  args: {

  }
}