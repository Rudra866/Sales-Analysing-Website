// type CustomTooltipProps = {
//   active: any;
//   payload: string | any[];
//   label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>>
// }

// todo ts:any
export function customTooltip(props: any) {
  try {
    if (props.active && props.payload && props.payload.length) {
      return (
          <div className="bg-muted p-4 rounded-md shadow-md">
            <p className="text-muted-foreground text-sm">{props.label}</p>
            <p className="text-muted-foreground text-sm">
              Total: {`$${Number(props?.payload[0]?.value)?.toLocaleString()}`}</p>
          </div>
      )
    }
  }  catch (e) {
    console.error(e)
  }
  return null
}