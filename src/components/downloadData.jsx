import React from "react";
import { getCurrentDate } from "../utils/getDates";
import { CSVLink, CSVDownload } from "react-csv";



function DownloadData(props) {
    const fullWeatherInfo = props.updatedArray;
    const today = getCurrentDate('-');
    const from = props.from;
    return (
        <section id="downloadDataSection">
            <CSVLink
                data={fullWeatherInfo}
                filename={`prognoza_pogody_z_dnia_${today}_z_${from}`}
                // className="btn btn-primary"
                target="_blank"
            >Download me</CSVLink>;
        </section>
    )
}

export default DownloadData;