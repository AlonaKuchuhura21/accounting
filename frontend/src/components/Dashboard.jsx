import React from 'react';
import { Route } from 'react-router-dom';
import Budgets from './Budgets';
import Home from './Home';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">CoinLY</h1>
          <Route path="/" element={<Home />} className="text-blue-600">Головна</Route>
          <Route path="/budgets" element={<Budgets />} className="text-blue-600">Бюджети</Route>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 border rounded">Logout</button>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </nav>

      <main className="p-8">
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <h2 className="text-xl font-semibold">Квітень</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600">
            + Створ. Бюджет
          </button>
        </div>

        <div className="mt-4 bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between mb-2">
            <span>Дохід:</span>
            <span>0 ₴</span>
          </div>
          <div className="flex justify-between">
            <span>Витрати:</span>
            <span>0 ₴</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;