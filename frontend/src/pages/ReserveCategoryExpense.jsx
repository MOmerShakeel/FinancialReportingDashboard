import DataTable from "../components/reservecategoryexpense-components/DataTable";
import "./ReserveCategoryExpense.css"
import ExpensesChart from "../components/reservecategoryexpense-components/ExpensesChart";

function ReserveCategoryExpense() {
    return (
        <>
            <ExpensesChart />
            <DataTable />
        </>
    );
}

export default ReserveCategoryExpense;