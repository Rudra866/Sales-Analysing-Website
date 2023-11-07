// todo modify when we remove data collection from the tables
import DataTable, {DataTableProps} from "@/components/DataTable";
import {Meta, StoryObj} from "@storybook/react";
import {Sale} from "@/lib/database";
import SalesTable from "@/app/(pages)/sales/components/SalesTable";

export default {
  title: 'Tables/Sales Table',
  component: DataTable,
  render: () => <SalesTable/>
} as Meta;
  // render: function Render (args) {
  //   const [sorting, setSorting] = useState<SortingState>([])
  //   const [columnFilters, setColumnFilters] =
  //       useState<ColumnFiltersState>([])
  //
  //   const table: import("@tanstack/table-core").Table<any> = useReactTable({
  //     data: args.data,
  //     columns: columns,
  //     getCoreRowModel: getCoreRowModel(),
  //     getPaginationRowModel: getPaginationRowModel(),
  //     getFilteredRowModel: getFilteredRowModel(),
  //     getSortedRowModel: getSortedRowModel(),
  //     state: {
  //       sorting,
  //       columnFilters
  //     }
  //   })
  //
  //   return (
  //       <DataTable table={table} loading={args.loading}/>
  //   )
  // },
//   args: {
//     loading: true
//   }
// } as Meta;


export const Sales: StoryObj<DataTableProps<Sale>> = {
  args: {

  }
}