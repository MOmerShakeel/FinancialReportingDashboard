import { DataGrid } from '@mui/x-data-grid';
import Papa from 'papaparse';
import ReserveCategoryFile from "../../assets/Data-ReserveCategoriesExpense .csv";
import { useState, useEffect } from 'react';

function DataTable (){
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
  
    useEffect(() => {
      Papa.parse(ReserveCategoryFile, {
        download: true,
        header: true,
        complete: (results) => {
          // Generate columns dynamically
          const generatedColumns = Object.keys(results.data[0]).map(field => ({
            field,
            headerName: field.charAt(0).toUpperCase() + field.slice(1),
            flex: 1
          }));
  
          // Add unique id to rows
          const rowsWithId = results.data.map((row, index) => ({
            ...row,
            id: index
          }));
  
          setColumns(generatedColumns);
          setRows(rowsWithId);
        }
      });
    }, []);

    return (
    <>
      <div style={{ height: 400, width: '100%', padding:"20px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
    </>
    );
}

export default DataTable;