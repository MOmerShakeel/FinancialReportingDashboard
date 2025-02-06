import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import LayersIcon from '@mui/icons-material/Layers';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/prima.webp";
import { Routes, Route } from "react-router-dom"; // ✅ Import Routes here
import Dashboard from '../../pages/Dashboard';
import FinancialSummary from '../../pages/FinancialSummary';
import ReserveCategoryExpense from '../../pages/ReserveCategoryExpense';
import Projections from '../../pages/Projections';

export default function SideBar() {
    const navigate = useNavigate();

    const NAVIGATION = [
        { segment: './dashboard', title: 'Home', icon: <DashboardIcon />, onClick: () => navigate('/dashboard') },
        { kind: 'divider' },
        { segment: './financial-summary', title: 'Financial Summary', icon: <LayersIcon />, onClick: () => navigate('/financial-summary') },
        { segment: './reserve-categories-expense', title: 'Reserve Category Expense', icon: <BarChartIcon />, onClick: () => navigate('/reserve-categories-expense') },
        { segment: './projections', title: 'Projection Charts', icon: <TimelineIcon />, onClick: () => navigate('/projections') },
        { kind: 'divider' },
        { segment: './', title: 'Sign Out', icon: <LogoutIcon />, onClick: () => navigate('/') },
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
                    <Route path="/projections" element={<Projections />} />
                </Routes>
            </DashboardLayout>
        </AppProvider>
    );
}

SideBar.propTypes = {
    children: PropTypes.node,
};
