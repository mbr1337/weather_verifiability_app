import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ComparisonLineChart({ weatherData, whatParameterToCompare }) {

    const [valueToCompare, setValueToCompare] = React.useState(whatParameterToCompare);

    return (

        <div style={{ width: '100%' }}>
            {
                weatherData &&
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                        data={weatherData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis dataKey={'historical' + valueToCompare} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={'historical' + valueToCompare}
                            name={'Actual ' + valueToCompare}
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey={'forecast' + valueToCompare}
                            name={'Predicted ' + valueToCompare}
                            stroke="#82ca9d"
                        />
                    </LineChart>
                </ResponsiveContainer>
            }


        </div>
    );

}
