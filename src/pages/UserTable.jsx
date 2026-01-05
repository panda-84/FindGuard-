import DataTable from "react-data-table-component";
import { ParseStatus } from "zod/v3";

const UserTable = () => {
    const responseData = [
        {name : "Bibek", email: "bibek@example.com ", gender : "male", password: "bibek123" , address: "ktm", phoene: "9841234567" , dob: "2000-01-01"},
        {name : "Ram", email: "ram@example.com", gender : "male", password: "ram123", address: "ktm", phoene: "9841234567" , dob: "2000-01-01"},
        {name : "Ramesh", email: "ramesh@example.com", gender : "male", password: "ramesh123", address: "ktm", phoene: "9841234567" , dob: "2000-01-01"},
        {name : "Suresh", email: "suresh@example.com", gender : "male", password: "suresh123", address: "ktm", phoene: "9841234567" , dob: "2000-01-01"}

        ];

        const columns = [
            { name: "Name", selector: (row) => row.name, sortable: true},
        ];

    return (<>
    <DataTable
    columns={columns}
    data={responseData}
    pagination
    />      
   </>);
};

    export default UserTable;