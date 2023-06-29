import {getFinalMAEforEachApi} from "../utils/MAEfromAllData";
import {useState} from "react";


export default function MAEfromAllData() {
    const [MAE, setMAE] = useState();


    async function handleData() {
        console.log('READY');
        const data = await getFinalMAEforEachApi();
        setMAE(data);
        console.log(data);
    }

    function table() {
        return (
            <>
                {
                    MAE &&
                    <table className={'table table-hover'}>
                        <thead>
                        <th colSpan={6}>
                            Błąd bezwzględny dla całego zbioru danych
                        </th>
                        <tr>
                            <th>Źródło danych</th>

                            {
                                Array.from(MAE.values())[0].map((_, index) => (
                                    <th key={index}>{index+1} dni</th>
                                ))
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            Array.from(MAE.entries()).map(([key, values]) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    {
                                        values.map((value, index) => (
                                            <td key={index}>{value.toFixed(2)}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>

                }
            </>

        );
    };


    return (
        <div>
            <button onClick={handleData}>Oblicz błąd dla całego zbioru danych</button>
            {table()}
        </div>
    )
}
