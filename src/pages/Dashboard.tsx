import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, Users, Activity, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBloodBank } from '../contexts/BloodBankContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { inventory, donors, requests } = useBloodBank();

  const bloodTypeColors = {
    'A+': '#FF6B6B', 'A-': '#FF8E8E',
    'B+': '#4ECDC4', 'B-': '#6EDDD6',
    'AB+': '#45B7D1', 'AB-': '#6BC5E5',
    'O+': '#96CEB4', 'O-': '#AADCC4'
  };

  const totalDonors = donors.length;
  const activeDonors = donors.filter(d => d.status === 'active').length;
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalRequests = requests.filter(r => r.urgency === 'critical').length;

  const chartData = inventory.map(item => ({
    bloodType: item.bloodType,
    quantity: item.quantity,
    fill: bloodTypeColors[item.bloodType as keyof typeof bloodTypeColors]
  }));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blood Units</p>
                <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
              </div>
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last week</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-3xl font-bold text-gray-900">{activeDonors}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Total: {totalDonors} donors</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requests Today</p>
                <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <Activity className="h-12 w-12 text-green-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-600">Updated today</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Requests</p>
                <p className="text-3xl font-bold text-gray-900">{criticalRequests}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-orange-600">Requires immediate attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Blood Inventory by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bloodType" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Blood Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ bloodType, quantity }) => `${bloodType}: ${quantity}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantity"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Blood Requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.slice(0, 5).map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {request.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.quantity} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                        request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                        request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;