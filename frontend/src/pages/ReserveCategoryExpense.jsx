import DataTable from "../components/reservecategoryexpense-components/DataTable";
import SideBar from "../components/global-components/Sidebar";
import "./ReserveCategoryExpense.css"
import { DashboardLayout } from "@toolpad/core";
import { Box } from "@mui/material";

function ReserveCategoryExpense() {
    return (
    <>
        <h1 className="heading">Reserve Categories Expense</h1>
        <DataTable />
    </>
    );
}

export default ReserveCategoryExpense;