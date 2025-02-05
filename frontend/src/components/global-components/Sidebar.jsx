import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/prima.webp";
import { Routes, Route } from "react-router-dom"; // ✅ Import Routes here
import Dashboard from '../../pages/Dashboard';
import FinancialSummary from '../../pages/FinancialSummary';
import ReserveCategoryExpense from '../../pages/ReserveCategoryExpense';

export default function SideBar() {
    const navigate = useNavigate();

    const NAVIGATION = [
        { segment: 'dashboard', title: 'Home', icon: <DashboardIcon />, onClick: () => navigate('/dashboard') },
        { kind: 'divider' },
        { segment: 'financial-summary', title: 'Financial Summary', icon: <BarChartIcon />, onClick: () => navigate('/financial-summary') },
        { segment: 'reserve-categories-expense', title: 'Reserve Category Expense', icon: <BarChartIcon />, onClick: () => navigate('/reserve-categories-expense') },
        { segment: 'integrations', title: 'Integrations', icon: <LayersIcon />, onClick: () => navigate('/integrations') },
    ];

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src={Logo} alt="Prima logo" />,
                title: 'Prima Consulting',
                homeUrl: '/dashboard',
            }}
            theme={createTheme({
                cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
                colorSchemes: { light: true, dark: true },
            })}
        >
            <DashboardLayout defaultSidebarCollapsed>
                {/* ✅ Define Routes inside the Sidebar */}
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/financial-summary" element={<FinancialSummary />} />
                    <Route path="/reserve-categories-expense" element={<ReserveCategoryExpense />} />
                </Routes>
            </DashboardLayout>
        </AppProvider>
    );
}

SideBar.propTypes = {
    children: PropTypes.node,
};
