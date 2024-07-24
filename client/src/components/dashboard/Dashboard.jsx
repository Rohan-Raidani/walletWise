import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import { fetchTransactions, addTransaction, deleteTransaction } from '../../services/api';
import './dashboard.css'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTransactions();
      const sortedTransactions = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(sortedTransactions);
      calculateTotalBalance(sortedTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalBalance = (transactionsData) => {
    const total = transactionsData.reduce((acc, transaction) => {
      return transaction.type === 'credit' 
        ? acc + transaction.money 
        : acc - transaction.money;
    }, 0);
    setTotalBalance(total);
  };

  const pieChartData = useMemo(() => {
    const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.money, 0);
    const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.money, 0);
    return [
      { name: 'Credit', value: totalCredit },
      { name: 'Debit', value: totalDebit },
    ];
  }, [transactions]);

  const barChartData = useMemo(() => {
    const dailyTotals = transactions.reduce((acc, t) => {
      const date = new Date(t.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { credit: 0, debit: 0 };
      }
      acc[date][t.type] += t.money;
      return acc;
    }, {});
  
    return Object.entries(dailyTotals)
      .map(([date, values]) => ({ date, ...values }))
      .slice(-7);
  }, [transactions]);

  const handleSubmit = async (action) => {
    if (action === 'delete') {
      if (!selectedTransaction) return;
      try {
        await deleteTransaction(selectedTransaction._id);
        setSelectedTransaction(null);
        loadTransactions();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    } else {
      if (!amount) return;
      try {
        await addTransaction(Number(amount), action);
        setAmount('');
        loadTransactions();
      } catch (error) {
        console.error('Failed to add transaction:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#424242]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF5722]"></div>
      </div>
    );
  }

  return (
    <div className="main flex-1 flex items-center justify-between px-10 pt-12 bg-[#424242]">
      <div className="left h-full w-1/2 flex flex-col justify-center items-center">
        <div className="card flex flex-col gap-4 items-center p-5 pt-2 shadow-lg bg-[#616161] rounded-xl border border-[#FF5722] w-11/12 max-w-2xl">
          <h1 className='font-serif font-bold text-[#E0E0E0] text-3xl '>Your Wallet</h1>
          
          <div className="total-amount w-full bg-[#424242] rounded-lg p-4 mb-4">
            <p className="text-[#E0E0E0] text-lg font-semibold">Total Balance:</p>
            <p className="text-[#FF5722] text-4xl font-bold">{totalBalance.toFixed(2)} Rs</p>
          </div>

          <h2 className='recent font-serif font-bold text-[#E0E0E0] text-2xl mb-4'>Recent Transactions</h2>
          
          <div className="table-container h-60 w-6/7 overflow-y-auto">
            <table className='table-auto w-full border-collapse'>
              <thead>
                <tr className='bg-[#424242]'>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[#E0E0E0] uppercase tracking-wider'>Title</th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[#E0E0E0] uppercase tracking-wider'>Amount</th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[#E0E0E0] uppercase tracking-wider'>Type</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--back-light)] divide-y divide-[var(--back-dark)]">
                {transactions.slice(0, 10).map((transaction, index) => (
                  <tr 
                    key={transaction._id || index} 
                    className={`${index % 2 === 0 ? 'bg-[var(--back-light)]' : 'bg-[var(--back-dark)]'} ${selectedTransaction === transaction ? 'bg-[#FF5722] bg-opacity-50' : ''}`}
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-[var(--text-g)]'>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-[var(--text-g)]'>
                      {transaction.money.toFixed(2)} Rs
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-[var(--text-g)]'>
                      {transaction.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="form flex flex-col sm:flex-row gap-4 w-full mt-4">
            <input
              type="number"
              placeholder='Enter amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='px-4 py-2 w-1/2 border border-[#FF5722] rounded-md bg-[#424242] text-[#E0E0E0] focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] transition duration-150 ease-in-out'
            />
            <button onClick={() => handleSubmit('credit')} className='flex-1 bg-[#FF5722] text-[#E0E0E0] py-2 px-4 rounded-md hover:bg-[#E64A19] transition duration-150 ease-in-out'>
              Add
            </button>
            <button onClick={() => handleSubmit('debit')} className='flex-1 bg-[#FF5722] text-[#E0E0E0] py-2 px-4 rounded-md hover:bg-[#E64A19] transition duration-150 ease-in-out'>
              Subtract
            </button>
            <button 
              onClick={() => handleSubmit('delete')} 
              className={`flex-1 bg-[#FF5722] text-[#E0E0E0] py-2 px-4 rounded-md hover:bg-[#E64A19] transition duration-150 ease-in-out ${!selectedTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedTransaction}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="right h-full w-full md:w-1/2 flex flex-col justify-center items-center gap-10">
        <div className="w-full h-29 flex flex-col items-center sub">
          <h2 className="text-[#E0E0E0] text-xl font-bold mb-4">Credit vs Debit</h2>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart className="chart">
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-29 flex flex-col items-center">
          <h2 className="text-[#E0E0E0] text-xl font-bold mb-4">Last 7 Days Transactions</h2>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              className="chart"
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="credit" fill="#00C49F" />
              <Bar dataKey="debit" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 

export default Dashboard