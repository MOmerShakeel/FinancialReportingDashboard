import "./Dashboard.css";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Logo from "../assets/prima.webp";
import DataFinancialSummary from "../assets/Data-FinancialSummary.csv";
import Papa from 'papaparse';
import { useState, useEffect } from "react";
import Sidebar from "../components/global-components/Sidebar";

function Dashboard(props) {
  return (
    // <Sidebar/>
    <div>Dashboard</div>
  );
}

export default Dashboard;