import React from "react";
import { getCurrentDate } from "../utils/getDates";
import { CSVLink } from "react-csv";

function DownloadData(props) {
    const fullWeatherInfo = props.updatedArray;
    const today = getCurrentDate('-');
    return (
        <section id="downloadDataSection">
            <CSVLink
                data={fullWeatherInfo}
                filename={`prognoza_pogody_z_dnia_${today}_z_${props.from}`}
                // className="btn btn-primary"
                target="_blank"
            >Download data</CSVLink>
        </section>
    )
}

export default DownloadData;