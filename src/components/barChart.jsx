import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "../styles/chartStyle.scss";
function BChart(props) {


    return (
        <BarChart
            width={props.width}
            height={props.height}
            data={props.fullWeatherArray}
            margin={{
                top: 50,
                right: 30,
                left: 20,
                bottom: 50,
            }}
            className="bchart"
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={props.xDataKey} padding={{ left: 30, right: 30 }} />
            {/* <YAxis label="°C" /> */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={props.barDataKey1} fill="#0000ff" fillOpacity={0.7} />
            <Bar dataKey={props.barDataKey2} fill="#82ca9d" fillOpacity={1} />
        </BarChart>
    );
}
export default BChart;