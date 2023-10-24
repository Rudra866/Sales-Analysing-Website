import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';


interface OverviewProps {
    d: { GrossProfit: number; SaleTime: string | null }[];
}



// Overview component
export function Overview({ d }: OverviewProps ) {

    if (!Array.isArray(d)) {
        // If d is not an array, make it an array
        d=[d];
    }
    // Group sales data by day
    const groupedData: { [key: string]: number } = {};
    d.forEach(item => {
        const date = item.SaleTime ? new Date(item.SaleTime).toISOString().split('T')[0] : 'Unknown';
        groupedData[date] = (groupedData[date] || 0) + item.GrossProfit;
    });
    const data = Object.keys(groupedData).map(date => ({
        name: date,
        GrossProfit: groupedData[date],
    }));

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
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
                    tickFormatter={(value) => `$${value}`}
                />
                <Line type="monotone" dataKey="GrossProfit" stroke="#adfa1d" strokeWidth={2}/>
            </LineChart>
        </ResponsiveContainer>
    );
}