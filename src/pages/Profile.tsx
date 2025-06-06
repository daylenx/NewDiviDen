import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PortfolioItem {
  symbol: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  quantity: number;
  paidPrice: number;
  daysGain: number;
  totalGain: number;
  totalGainPercent: number;
  value: number;
}

// Sample portfolio data
const samplePortfolio: PortfolioItem[] = [
  {
    symbol: 'AAPL',
    lastPrice: 175.04,
    change: 2.15,
    changePercent: 1.24,
    quantity: 10.5,
    paidPrice: 150.25,
    daysGain: 22.58,
    totalGain: 260.30,
    totalGainPercent: 16.45,
    value: 1750.42
  },
  {
    symbol: 'MSFT',
    lastPrice: 415.32,
    change: -1.25,
    changePercent: -0.30,
    quantity: 5.25,
    paidPrice: 380.50,
    daysGain: -6.56,
    totalGain: 182.81,
    totalGainPercent: 9.16,
    value: 2180.43
  },
  {
    symbol: 'VTI',
    lastPrice: 250.75,
    change: 0.85,
    changePercent: 0.34,
    quantity: 25.75,
    paidPrice: 245.30,
    daysGain: 21.89,
    totalGain: 140.08,
    totalGainPercent: 2.22,
    value: 6456.81
  },
  {
    symbol: 'TSLA',
    lastPrice: 175.34,
    change: -3.45,
    changePercent: -1.93,
    quantity: 15.5,
    paidPrice: 180.20,
    daysGain: -53.48,
    totalGain: -75.33,
    totalGainPercent: -2.76,
    value: 2717.77
  },
  {
    symbol: 'NVDA',
    lastPrice: 875.28,
    change: 12.45,
    changePercent: 1.44,
    quantity: 2.5,
    paidPrice: 750.50,
    daysGain: 31.13,
    totalGain: 311.95,
    totalGainPercent: 16.63,
    value: 2188.20
  }
];

export default function Profile() {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(samplePortfolio);
  const [newItem, setNewItem] = useState<PortfolioItem>({
    symbol: '',
    lastPrice: 0,
    change: 0,
    changePercent: 0,
    quantity: 0,
    paidPrice: 0,
    daysGain: 0,
    totalGain: 0,
    totalGainPercent: 0,
    value: 0,
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.symbol || newItem.quantity <= 0 || newItem.paidPrice <= 0) {
      toast.error('Please fill in all fields correctly');
      return;
    }
    setPortfolio([...portfolio, newItem]);
    setNewItem({
      symbol: '',
      lastPrice: 0,
      change: 0,
      changePercent: 0,
      quantity: 0,
      paidPrice: 0,
      daysGain: 0,
      totalGain: 0,
      totalGainPercent: 0,
      value: 0,
    });
    toast.success('Portfolio item added successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Find the header row that contains the column names
        const headerRow = lines.findIndex(line => 
          line.toLowerCase().includes('symbol') && 
          line.toLowerCase().includes('last price')
        );

        if (headerRow === -1) {
          toast.error('Could not find the portfolio data in the file. Please make sure you\'re using the "View All Positions" export.');
          return;
        }

        // Get the headers and their indices
        const headers = lines[headerRow].split(',').map(h => h.trim().toLowerCase());
        const getIndex = (searchTerms: string[]) => {
          const index = headers.findIndex(h => searchTerms.some(term => h.includes(term)));
          console.log(`Searching for ${searchTerms.join(' or ')}: found at index ${index} (${headers[index] || 'not found'})`);
          return index;
        };

        const newPortfolio = lines.slice(headerRow + 1)
          .filter(line => line.trim()) // Remove empty lines
          .map(line => {
            const values = line.split(',').map(value => value.trim());
            const cleanValue = (val: string) => {
              const cleaned = parseFloat(val.replace(/[$,%]/g, '')) || 0;
              console.log(`Cleaning value: ${val} -> ${cleaned}`);
              return cleaned;
            };
            
            return {
              symbol: values[getIndex(['symbol', 'ticker'])] || '',
              lastPrice: cleanValue(values[getIndex(['last price', 'current price', 'price'])] || '0'),
              change: cleanValue(values[getIndex(['change', 'price change', 'chg'])] || '0'),
              changePercent: cleanValue(values[getIndex(['change %', 'price change %', 'chg %', '% change'])] || '0'),
              quantity: cleanValue(values[getIndex(['quantity', 'shares', 'qty', 'units'])] || '0'),
              paidPrice: cleanValue(values[getIndex(['paid price $', 'cost basis', 'cost', 'basis', 'avg cost'])] || '0'),
              daysGain: cleanValue(values[getIndex(['days gain $', 'daily gain', 'day gain', 'today\'s gain', 'today gain'])] || '0'),
              totalGain: cleanValue(values[getIndex(['total gain', 'unrealized gain', 'gain/loss', 'profit/loss'])] || '0'),
              totalGainPercent: cleanValue(values[getIndex(['total gain %', 'unrealized gain %', 'gain/loss %', 'profit/loss %'])] || '0'),
              value: cleanValue(values[getIndex(['value', 'market value', 'current value'])] || '0'),
            };
          })
          .filter(item => item.symbol && item.value > 0); // Only keep valid entries

        if (newPortfolio.length === 0) {
          toast.error('No valid portfolio positions found in the file.');
          return;
        }

        // Log the first row to debug
        console.log('First portfolio item:', newPortfolio[0]);
        console.log('Headers found:', headers);

        setPortfolio(newPortfolio);
        toast.success(`Successfully imported ${newPortfolio.length} positions`);
      } catch (error) {
        console.error('Error importing portfolio:', error);
        toast.error('Error importing portfolio. Please make sure you\'re using the "View All Positions" export from your brokerage.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-solarized-base3 dark:bg-solarized-base03 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-solarized-base2 dark:bg-solarized-base02 shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-solarized-base00 dark:text-solarized-base0 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-solarized-base01 dark:text-solarized-base1">Email</label>
              <p className="mt-1 text-sm text-solarized-base00 dark:text-solarized-base0">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-solarized-base2 dark:bg-solarized-base02 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-solarized-base00 dark:text-solarized-base0 mb-4">Portfolio Management</h2>
          
          {/* CSV Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-solarized-base01 dark:text-solarized-base1 mb-2">
              Import Portfolio (CSV)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-solarized-base01 dark:text-solarized-base1
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-solarized-blue file:text-solarized-base3
                hover:file:bg-solarized-blue/80
                dark:file:bg-solarized-blue/20 dark:file:text-solarized-base0"
            />
            <p className="mt-1 text-sm text-solarized-base01 dark:text-solarized-base1">
              Export your portfolio as "View All Positions" from your brokerage and upload the CSV file here or upload manually.
            </p>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleAddItem} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-solarized-base01 dark:text-solarized-base1">Symbol</label>
                <input
                  type="text"
                  value={newItem.symbol}
                  onChange={(e) => setNewItem({ ...newItem, symbol: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full rounded-md border-solarized-base1 shadow-sm focus:border-solarized-blue focus:ring-solarized-blue sm:text-sm dark:bg-solarized-base0 dark:border-solarized-base0"
                  placeholder="AAPL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-solarized-base01 dark:text-solarized-base1">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-solarized-base1 shadow-sm focus:border-solarized-blue focus:ring-solarized-blue sm:text-sm dark:bg-solarized-base0 dark:border-solarized-base0"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-solarized-base01 dark:text-solarized-base1">Paid Price</label>
                <input
                  type="number"
                  value={newItem.paidPrice}
                  onChange={(e) => setNewItem({ ...newItem, paidPrice: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-solarized-base1 shadow-sm focus:border-solarized-blue focus:ring-solarized-blue sm:text-sm dark:bg-solarized-base0 dark:border-solarized-base0"
                  placeholder="150.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-solarized-base01 dark:text-solarized-base1">Value</label>
                <input
                  type="number"
                  value={newItem.value}
                  onChange={(e) => setNewItem({ ...newItem, value: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-solarized-base1 shadow-sm focus:border-solarized-blue focus:ring-solarized-blue sm:text-sm dark:bg-solarized-base0 dark:border-solarized-base0"
                  placeholder="150.00"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-solarized-base3 bg-solarized-blue hover:bg-solarized-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solarized-blue"
            >
              Add to Portfolio
            </button>
          </form>

          {/* Portfolio Table */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-solarized-base00 dark:text-solarized-base0 mb-4">Current Portfolio</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-solarized-base1 dark:divide-solarized-base01">
                <thead className="bg-solarized-base3 dark:bg-solarized-base03">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Last Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Change %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Paid Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Days Gain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Total Gain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Total Gain %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-solarized-base01 dark:text-solarized-base1 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-solarized-base2 dark:bg-solarized-base02 divide-y divide-solarized-base1 dark:divide-solarized-base01">
                  {portfolio.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-solarized-base00 dark:text-solarized-base0">{item.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-solarized-base01 dark:text-solarized-base1">${item.lastPrice.toFixed(2)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.change >= 0 ? 'text-solarized-green dark:text-solarized-green' : 'text-solarized-red dark:text-solarized-red'}`}>
                        ${item.change.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.changePercent >= 0 ? 'text-solarized-green dark:text-solarized-green' : 'text-solarized-red dark:text-solarized-red'}`}>
                        {item.changePercent.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-solarized-base01 dark:text-solarized-base1">{item.quantity.toFixed(4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-solarized-base01 dark:text-solarized-base1">${item.paidPrice.toFixed(2)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.daysGain >= 0 ? 'text-solarized-green dark:text-solarized-green' : 'text-solarized-red dark:text-solarized-red'}`}>
                        ${item.daysGain.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.totalGain >= 0 ? 'text-solarized-green dark:text-solarized-green' : 'text-solarized-red dark:text-solarized-red'}`}>
                        ${item.totalGain.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.totalGainPercent >= 0 ? 'text-solarized-green dark:text-solarized-green' : 'text-solarized-red dark:text-solarized-red'}`}>
                        {item.totalGainPercent.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-solarized-base01 dark:text-solarized-base1">${item.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 