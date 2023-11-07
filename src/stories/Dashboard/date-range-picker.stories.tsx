import {Meta, StoryObj} from "@storybook/react";
// import {
//   CalendarDateRangePicker,
//   CalendarDateRangePickerProps
// } from "@/components/dashboard-components/date-range-picker";
import {useState} from "react";
import {
    CalendarDateRangePicker,
    CalendarDateRangePickerProps
} from "@/app/(pages)/dashboard/components/date-range-picker";


export default {
  title: 'Dashboard/Date Range Picker',
  component: CalendarDateRangePicker,
  parameters: {
    layout: "centered"
  }
} as Meta;

// export const Default: StoryObj<typeof Search> = {
//   args: {},
//   render: args => <CalendarDateRangePicker/>
// };

function FunctionalCalandarDateRangePicker(args: CalendarDateRangePickerProps) {
  const [selectedDate, setSelectedDate] = useState(args.date);
  return (
      <>
        <p>Selected From: {selectedDate?.from?.toLocaleDateString() ?? "undefined"}</p>
        <p>Selected To: {selectedDate?.to?.toLocaleDateString() ?? "undefined"}</p>
        <CalendarDateRangePicker {...args} date={selectedDate} setDate={setSelectedDate} />

      </>
  );
}

export const Default: StoryObj<CalendarDateRangePickerProps> = {
  render:(args) => (
      <>
        <FunctionalCalandarDateRangePicker {...args}/>
      </>
  ),
  args: {
    date: { from: new Date(), to: new Date() },
  }
};
