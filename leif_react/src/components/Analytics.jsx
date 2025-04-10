import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export const Analytics = () => {
  const [chartData, setChartData] = useState({
    days: [],
    avgHours: [],
  });
  const [staffChartData, setStaffChartData] = useState({
    labels: [],
    datasets: []
  });
  const [totalWeekHours, setTotalWeekHours] = useState(0);
  const [uniqueUserCount, setUniqueUserCount] = useState(0);
  const [period, setPeriod] = useState({ start: '', end: '' });
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
        
        const { data } = response.data; // Access the 'data' property from the response

        // Transform API data for the daily Line Chart
        const days = Object.keys(data.averageHoursPerDay || {}).map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        const avgHours = Object.values(data.averageHoursPerDay || {});

        setChartData({
          days,
          avgHours,
        });

        // Transform API data for the staff Bar Chart
        const staffData = data.totalHoursPerEmployee || {};
        const staffNames = Object.values(staffData).map(staff => staff.name);
        const staffHours = Object.values(staffData).map(staff => staff.hours);

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

        // Set additional metrics
        setTotalWeekHours(data.totalWeekHours || 0);
        setUniqueUserCount(data.uniqueUsers?.count || 0);
        setPeriod({
          start: data.period?.start || '',
          end: data.period?.end || ''
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [role, navigate]);

  const lineChartDataConfig = {
    labels: chartData.days,
    datasets: [
      {
        label: "Avg Hours Per Day",
        data: chartData.avgHours,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
        text: `Daily Average Hours (${period.start} to ${period.end})`,
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
          label: (context) => `${context.dataset.label}: ${context.parsed.y}h`
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
        title: { display: true, text: 'Hours' }
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Total Hours per Staff (${period.start} to ${period.end})`,
        font: { size: 16, weight: "bold" }
      },
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}h`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
          autoSkip: false,
          maxRotation: 45,
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
      
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-gray-600">Total Week Hours</p>
              <p className="text-xl font-bold">{totalWeekHours}h</p>
            </div>
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-gray-600">Unique Staff Members</p>
              <p className="text-xl font-bold">{uniqueUserCount}</p>
            </div>
          </div>

          {/* Daily Line Chart */}
          <div className="h-96 mb-8">
            {chartData.days.length === 0 ? (
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
            {staffChartData.labels.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p>No staff data available</p>
              </div>
            ) : (
              <Bar data={staffChartData} options={barChartOptions} />
            )}
          </div>
        </>
      )}
    </div>
  );
};