import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from "react-chartjs-2"; // Import Bar component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export const Analytics = () => {
  const [chartData, setChartData] = useState({
    days: [],
    avgHours: [],
    clockIns: [],
    totalHours: []
  });
  const [staffChartData, setStaffChartData] = useState({
    labels: [],
    datasets: []
  }); // New state for staff bar chart
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "manager") {
      navigate("/clock");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('https://leif-q464.vercel.app/api/shifts/week', {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        });
        
        const data = response.data;
        console.log(data);

        // Transform API data for the daily Line Chart
        const days = Object.keys(data.averageHoursPerDay || {}).map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const avgHours = Object.values(data.averageHoursPerDay || {});
        const clockIns = Object.values(data.numberOfPeoplePerDay || {});
        
        const totalStaffHours = Object.values(data.totalHoursPerStaff || {});
        const totalHoursPerDay = totalStaffHours.length > 0 
          ? days.map(() => {
              const dailyAvg = totalStaffHours.reduce((sum, staff) => sum + staff.totalHours, 0) / days.length;
              return Number(dailyAvg.toFixed(2));
            })
          : [];

        setChartData({
          days,
          avgHours,
          clockIns,
          totalHours: totalHoursPerDay
        });

        // Transform API data for the staff Bar Chart
        const staffNames = Object.values(data.totalHoursPerStaff || {}).map(staff => staff.name);
        const staffHours = Object.values(data.totalHoursPerStaff || {}).map(staff => staff.totalHours);

        setStaffChartData({
          labels: staffNames,
          datasets: [
            {
              label: "Total Hours Worked",
              data: staffHours,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1
            }
          ]
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [role, navigate]);

  // Line Chart configuration (unchanged)
  const lineChartDataConfig = {
    labels: chartData.days,
    datasets: [
      {
        label: "Avg Hours Clocked In",
        data: chartData.avgHours,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: false
      },
      {
        label: "Number of People Clocking In",
        data: chartData.clockIns,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.1,
        fill: false
      },
      {
        label: "Avg Total Hours per Staff",
        data: chartData.totalHours,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.1,
        fill: false
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Staff Clock-in Analytics (Previous Week)",
        font: { size: 16, weight: "bold" }
      },
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return `${datasetLabel}: ${value}${datasetLabel.includes('Hours') ? 'h' : ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 14 } },
        title: { display: true, text: 'Days' }
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { font: { size: 14 } },
        title: { display: true, text: 'Values' }
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

  // Bar Chart configuration for staff data
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Total Hours Worked per Staff (Previous Week)",
        font: { size: 16, weight: "bold" }
      },
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value}h`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
          autoSkip: false,
          maxRotation: 45, // Rotate labels for readability
          minRotation: 45
        },
        title: { display: true, text: 'Staff' }
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { font: { size: 14 } },
        title: { display: true, text: 'Hours' }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">Clock-in Statistics</h3>
      
      {/* Daily Line Chart */}
      <div className="h-96 mb-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading analytics data...</p>
          </div>
        ) : chartData.days.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p>No data available for the previous week</p>
          </div>
        ) : (
          <Line data={lineChartDataConfig} options={lineChartOptions} />
        )}
      </div>

      {/* Staff Bar Chart */}
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Staff Hours Analytics</h4>
      <div className="h-96">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading staff data...</p>
          </div>
        ) : staffChartData.labels.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p>No staff data available</p>
          </div>
        ) : (
          <Bar data={staffChartData} options={barChartOptions} />
        )}
      </div>
    </div>
  );
};