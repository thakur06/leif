import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Analytics = () => {
  const [chartData, setChartData] = useState({
    days: [],
    avgHours: [],
    clockIns: [],
    totalHours: []
  });
  const [loading, setLoading] = useState(true);
      const { role} = useAuth();
      const navigate=useNavigate();
  useEffect(() => {

  
      role!="manager"?navigate("/clock"):null

    
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/shifts/week', {
          headers: {
            Authorization: `${localStorage.getItem('token')}` // No 'Bearer' prefix unless your backend requires it
          }
        });
        
        const data = response.data; // Axios automatically parses JSON
        
        // Transform API data to chart format
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rest of the component (chartDataConfig, options, and return statement) remains the same
  const chartDataConfig = {
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

  const options = {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">Clock-in Statistics</h3>
      <div className="h-96">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading analytics data...</p>
          </div>
        ) : chartData.days.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p>No data available for the previous week</p>
          </div>
        ) : (
          <Line data={chartDataConfig} options={options} />
        )}
      </div>
    </div>
  );
};