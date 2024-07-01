import { Link } from 'react-router-dom'

function Calendar() {

    return (
        <div className='Calendar'>

            <header className='sticky-header'>
                <h1>This is my header</h1>
            </header>
            <div>
                <h1>HEYYYYYYYYYY</h1>
                <h1></h1>
            </div>


            <div className='table_foundation'>
                <table>
                    <tr>
                        <th className='sunday'>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                    </tr>

                </table>
            </div>


        </div>
    );
}

export default Calendar