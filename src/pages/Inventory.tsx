import React, { useState } from 'react';
import { Plus, Minus, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { useBloodBank } from '../contexts/BloodBankContext';
import { format } from 'date-fns';

const Inventory: React.FC = () => {
  const { inventory, updateInventory } = useBloodBank();
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [operation, setOperation] = useState<'add' | 'remove'>('add');

  const handleUpdateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBloodType && quantity) {
      const numQuantity = parseInt(quantity);
      updateInventory(selectedBloodType, operation === 'add' ? numQuantity : -numQuantity);
      setSelectedBloodType('');
      setQuantity('');
    }
  };

  const getStatusColor = (quantity: number) => {
    if (quantity < 10) return 'bg-red-100 text-red-800 border-red-200';
    if (quantity < 20) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = (quantity: number) => {
    if (quantity < 10) return 'Critical';
    if (quantity < 20) return 'Low';
    return 'Good';
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalTypes = inventory.filter(item => item.quantity < 10).length;
  const lowStockTypes = inventory.filter(item => item.quantity < 20 && item.quantity >= 10).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blood Inventory</h1>
          <p className="text-gray-600 mt-2">Monitor and manage blood stock levels</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                <p className="text-3xl font-bold text-gray-900">{criticalTypes}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockTypes}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blood Types</p>
                <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Cards */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Stock Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventory.map((item) => (
                  <div key={item.bloodType} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
                          <span className="text-red-600 font-bold text-lg">{item.bloodType}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Type {item.bloodType}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.quantity)}`}>
                            {getStatusText(item.quantity)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{item.quantity}</div>
                        <div className="text-sm text-gray-500">units</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.quantity < 10 ? 'bg-red-500' : 
                          item.quantity < 20 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.quantity / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last updated: {format(item.lastUpdated, 'MMM dd, HH:mm')}</span>
                      {item.quantity < 10 && (
                        <span className="text-red-600 font-medium">Urgent!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Update Inventory Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Update Inventory</h3>
              <form onSubmit={handleUpdateInventory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type
                  </label>
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select blood type</option>
                    {inventory.map(item => (
                      <option key={item.bloodType} value={item.bloodType}>
                        {item.bloodType} (Current: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operation
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="operation"
                        value="add"
                        checked={operation === 'add'}
                        onChange={(e) => setOperation(e.target.value as 'add' | 'remove')}
                        className="mr-2"
                      />
                      <Plus className="h-4 w-4 text-green-600 mr-1" />
                      Add Stock
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="operation"
                        value="remove"
                        checked={operation === 'remove'}
                        onChange={(e) => setOperation(e.target.value as 'add' | 'remove')}
                        className="mr-2"
                      />
                      <Minus className="h-4 w-4 text-red-600 mr-1" />
                      Remove Stock
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                    operation === 'add' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {operation === 'add' ? 'Add to' : 'Remove from'} Inventory
                </button>
              </form>
            </div>

            {/* Critical Alerts */}
            {criticalTypes > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-800">Critical Stock Alert</h4>
                </div>
                <p className="text-red-700 text-sm">
                  {criticalTypes} blood type{criticalTypes > 1 ? 's' : ''} critically low. 
                  Immediate restocking required.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;