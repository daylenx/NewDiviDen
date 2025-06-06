import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolio, PortfolioItem } from '../contexts/PortfolioContext';
import toast from 'react-hot-toast';

const FINNHUB_API_KEY = 'd114gopr01qse6lf7p30d114gopr01qse6lf7p3g';

// Sample/mock data
const kpis = [
  { label: 'Total Portfolio Value', value: '$24,500' },
  { label: 'Annual Dividend Income', value: '$2,450' },
  { label: 'Average Yield (%)', value: '3.2%' },
  { label: 'Next Payout Date', value: '2024-07-15' },
];
const monthlyProgress = { earned: 95, target: 120 };
const upcomingPayouts = [
  { date: '2024-07-15', symbol: 'VTI', amount: 45.75 },
  { date: '2024-07-20', symbol: 'AAPL', amount: 33.25 },
  { date: '2024-07-25', symbol: 'MSFT', amount: 28.10 },
];
const topHoldings = [
  { ticker: 'AAPL', shares: 10.5, yield: '1.2%', earned: '$125' },
  { ticker: 'VTI', shares: 25.75, yield: '2.1%', earned: '$540' },
  { ticker: 'MSFT', shares: 5.25, yield: '1.0%', earned: '$52' },
];
const dripActivity = [
  { date: '2024-07-01', action: 'Reinvested', symbol: 'AAPL', shares: 0.12 },
  { date: '2024-06-15', action: 'Reinvested', symbol: 'VTI', shares: 0.25 },
];

const Dashboard = () => {
  const { userName } = useAuth();
  const { portfolio, uploadPortfolio, removePortfolio, loading } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Financial News State
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      setNewsError(null);
      try {
        const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setNews(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err: any) {
        setNewsError('Could not load news.');
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // CSV upload handler (same as Profile)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        const headerRow = lines.findIndex(line =>
          line.toLowerCase().includes('symbol') &&
          line.toLowerCase().includes('last price')
        );
        if (headerRow === -1) {
          toast.error('Could not find the portfolio data in the file. Please make sure you\'re using the "View All Positions" export.');
          return;
        }
        const headers = lines[headerRow].split(',').map(h => h.trim().toLowerCase());
        const getIndex = (searchTerms: string[]) => {
          const index = headers.findIndex(h => searchTerms.some(term => h.includes(term)));
          return index;
        };
        const newPortfolio: PortfolioItem[] = lines.slice(headerRow + 1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(value => value.trim());
            const cleanValue = (val: string) => parseFloat(val.replace(/[$,%]/g, '')) || 0;
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
          .filter(item => item.symbol && item.value > 0);
        if (newPortfolio.length === 0) {
          toast.error('No valid portfolio positions found in the file.');
          return;
        }
        uploadPortfolio(newPortfolio).then(() => {
          toast.success(`Successfully imported ${newPortfolio.length} positions`);
        });
      } catch (error) {
        toast.error('Error importing portfolio. Please make sure you\'re using the "View All Positions" export from your brokerage.');
      }
    };
    reader.readAsText(file);
  };

  // Remove portfolio handler
  const handleRemovePortfolio = async () => {
    await removePortfolio();
    toast.success('Portfolio removed');
  };

  // KPI calculations (always use latest portfolio from context)
  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);
  const annualIncome = portfolio.reduce((sum, item) => sum + (item.value * 0.03), 0); // Example 3% yield
  const avgYield = portfolio.length ? (portfolio.reduce((sum, item) => sum + (item.value * 0.03), 0) / totalValue) * 100 : 0;
  const nextPayoutDate = '2024-07-15'; // Placeholder, implement real logic

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-solarized-base3 dark:bg-solarized-base03">
        <div className="text-lg text-solarized-base01 dark:text-solarized-base1">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-solarized-base3 via-solarized-base2 to-solarized-base3 dark:from-solarized-base03 dark:via-solarized-base02 dark:to-solarized-base03 py-8 px-2 sm:px-4">
      {/* Top Section: Greeting */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-solarized-blue dark:text-solarized-cyan drop-shadow">Welcome back, {userName || 'Investor'} 👋</h1>
        <p className="text-lg sm:text-xl text-solarized-base01 dark:text-solarized-base1 mb-2">Instantly see where you stand financially.</p>
        <p className="text-lg italic text-solarized-blue dark:text-solarized-cyan">“Your dividend income is working while you sleep.”</p>
      </div>

      {/* CSV Upload (if no portfolio or always show for re-upload) */}
      <div className="max-w-2xl mx-auto mb-8 text-center bg-solarized-base2 dark:bg-solarized-base02 rounded-xl shadow p-6">
        <label className="block text-base font-semibold text-solarized-base01 dark:text-solarized-base1 mb-2">Import Portfolio (CSV)</label>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="block w-full text-sm text-solarized-base01 dark:text-solarized-base1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-solarized-blue file:text-solarized-base3 hover:file:bg-solarized-blue/80 dark:file:bg-solarized-blue/20 dark:file:text-solarized-base0"
        />
        <p className="mt-1 text-sm text-solarized-base01 dark:text-solarized-base1">Export your portfolio as "View All Positions" from your brokerage and upload the CSV file here.</p>
        {portfolio.length > 0 && (
          <button
            onClick={handleRemovePortfolio}
            className="mt-4 bg-solarized-red text-solarized-base3 rounded-lg py-2 px-4 font-semibold shadow hover:bg-solarized-red/80 transition"
          >
            Remove Portfolio
          </button>
        )}
      </div>

      {portfolio.length === 0 && !loading && (
        <div className="max-w-2xl mx-auto mb-8 text-center text-solarized-base01 dark:text-solarized-base1 bg-solarized-base2 dark:bg-solarized-base02 rounded-xl shadow p-6">
          <p>No portfolio uploaded yet. Please upload your portfolio to see your dashboard.</p>
        </div>
      )}

      {/* Financial News Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4 text-solarized-base00 dark:text-solarized-base0">Financial News</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {newsLoading ? (
            <div className="text-solarized-base01 dark:text-solarized-base1">Loading news...</div>
          ) : newsError ? (
            <div className="text-solarized-red">{newsError}</div>
          ) : (
            news.map((item, idx) => (
              <div key={item.id || idx} className="bg-solarized-base2 dark:bg-solarized-base02 rounded-lg shadow p-4 hover:shadow-lg transition">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-solarized-blue font-semibold hover:underline text-lg">
                  {item.headline}
                </a>
                <div className="text-solarized-base01 dark:text-solarized-base1 text-sm mt-1">{item.summary}</div>
                <div className="text-xs text-solarized-base1 dark:text-solarized-base01 mt-1">{item.source} &middot; {new Date(item.datetime * 1000).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Replace with real data if available */}
        <div className="bg-solarized-blue/90 dark:bg-solarized-cyan/80 rounded-xl shadow p-6 text-center text-solarized-base3">
          <div className="text-3xl font-bold mb-1">${totalValue.toLocaleString()}</div>
          <div className="text-base font-medium">Total Portfolio Value</div>
        </div>
        <div className="bg-solarized-green/90 dark:bg-solarized-green/80 rounded-xl shadow p-6 text-center text-solarized-base3">
          <div className="text-3xl font-bold mb-1">${annualIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="text-base font-medium">Annual Dividend Income</div>
        </div>
        <div className="bg-solarized-yellow/90 dark:bg-solarized-yellow/80 rounded-xl shadow p-6 text-center text-solarized-base3">
          <div className="text-3xl font-bold mb-1">{avgYield.toFixed(2)}%</div>
          <div className="text-base font-medium">Average Yield</div>
        </div>
        <div className="bg-solarized-violet/90 dark:bg-solarized-violet/80 rounded-xl shadow p-6 text-center text-solarized-base3">
          <div className="text-3xl font-bold mb-1">{nextPayoutDate}</div>
          <div className="text-base font-medium">Next Payout Date</div>
        </div>
      </div>

      {/* Monthly Income Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8 bg-solarized-base2 dark:bg-solarized-base02 rounded-xl shadow p-6">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-solarized-base00 dark:text-solarized-base0">Monthly Income</span>
          <span className="text-sm text-solarized-base01 dark:text-solarized-base1">${monthlyProgress.earned} of ${monthlyProgress.target}</span>
        </div>
        <div className="w-full bg-solarized-base3 dark:bg-solarized-base03 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-solarized-blue to-solarized-green h-4 rounded-full transition-all duration-500"
            style={{ width: `${(monthlyProgress.earned / monthlyProgress.target) * 100}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-solarized-base01 dark:text-solarized-base1 mt-2">
          You've earned ${monthlyProgress.earned} of ${monthlyProgress.target} this month
        </div>
      </div>

      {/* Upcoming Payouts Preview */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-2 text-solarized-base00 dark:text-solarized-base0">Upcoming Payouts</h2>
        <div className="bg-solarized-base2 dark:bg-solarized-base02 rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-solarized-base3 dark:bg-solarized-base03">
                <th className="text-left px-2 py-1">Date</th>
                <th className="text-left px-2 py-1">Symbol</th>
                <th className="text-left px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayouts.map((p, i) => (
                <tr key={p.date + p.symbol} className={i % 2 === 0 ? 'bg-solarized-base2 dark:bg-solarized-base02' : 'bg-solarized-base3 dark:bg-solarized-base03'}>
                  <td className="px-2 py-1">{p.date}</td>
                  <td className="px-2 py-1">{p.symbol}</td>
                  <td className="px-2 py-1">${p.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Holdings Overview */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-2 text-solarized-base00 dark:text-solarized-base0">Top Holdings</h2>
        <div className="bg-solarized-base2 dark:bg-solarized-base02 rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-solarized-base3 dark:bg-solarized-base03">
                <th className="text-left px-2 py-1">Ticker</th>
                <th className="text-left px-2 py-1">Shares</th>
                <th className="text-left px-2 py-1">Yield</th>
                <th className="text-left px-2 py-1">Dividends Earned</th>
              </tr>
            </thead>
            <tbody>
              {topHoldings.map((h, i) => (
                <tr key={h.ticker} className={i % 2 === 0 ? 'bg-solarized-base2 dark:bg-solarized-base02' : 'bg-solarized-base3 dark:bg-solarized-base03'}>
                  <td className="px-2 py-1">{h.ticker}</td>
                  <td className="px-2 py-1">{h.shares}</td>
                  <td className="px-2 py-1">{h.yield}</td>
                  <td className="px-2 py-1">{h.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent DRIP Activity */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-2 text-solarized-base00 dark:text-solarized-base0">Recent DRIP Activity</h2>
        <div className="bg-solarized-base2 dark:bg-solarized-base02 rounded-lg shadow p-4">
          <ul>
            {dripActivity.map((a, i) => (
              <li key={i} className="mb-1">
                {a.date}: {a.action} {a.shares} shares of {a.symbol}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Insights */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="bg-solarized-base2 dark:bg-solarized-base02 rounded-lg shadow p-6">
          <span className="text-lg font-semibold text-solarized-green">Your income grew 8% over last quarter</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 