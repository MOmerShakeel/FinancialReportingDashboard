import { DataGrid } from '@mui/x-data-grid';
import Papa from 'papaparse';
import ProjectionFile from "../../assets/Data-ProjectionData.csv";
import { useState, useEffect } from 'react';

function DataTable() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    Papa.parse(ProjectionFile, {
      download: true,
      header: true,
      complete: (results) => {
        // Generate columns dynamically
        const generatedColumns = Object.keys(results.data[0]).map(field => ({
          field,
          headerName: field.charAt(0).toUpperCase() + field.slice(1),
          flex: 1
        }));
        // console.log(results);
        // const dataObject = results;

        // console.log(dataObject.data.length);

        //   for(var index = 0;index<dataObject.data.length;index++){
        //   console.log(dataObject.data[index].Month);
        // }

        // Add unique id to rows since CSV does not contain
        const rowsWithId = results.data.map((row, index) => ({
          ...row,
          id: index
        }));
        // console.log(rowsWithId);

        setColumns(generatedColumns);
        setRows(rowsWithId);
      }
    });
  }, []);

  return (
    <>
      <div style={{ height: 300, width: '100%', padding: "20px" }}>
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