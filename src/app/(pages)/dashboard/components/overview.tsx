"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
export function Overview({ data }: {data: { name: string; total: number; }[] | undefined }) {

    const customToolTip = (props: any) => {
        if (props.active) {
            return (
                <div className="bg-muted p-4 rounded-md shadow-md">
                    <p className="text-muted-foreground text-sm">{props.label}</p>
                    {/*<p className="text-muted-foreground text-sm">Total: {`$${Number(props.payload[0].value).toLocaleString()}`}</p>*/}
                    <p className="text-muted-foreground text-sm">Total: {props.payload[0].value}</p>
                </div>
            )
        } return null
    }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]}/>
          <Tooltip
              content={customToolTip}
              cursor={{fill: 'rgba(250,250,250,0.3)', radius: 4
          }}/>
      </BarChart>
    </ResponsiveContainer>
  )
}
