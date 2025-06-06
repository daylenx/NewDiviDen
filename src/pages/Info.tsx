import React, { useState } from 'react';

const faqs = [
  {
    q: "How often do companies pay dividends?",
    a: "Most dividend-paying companies distribute dividends quarterly (every 3 months), but some pay monthly or annually. REITs and certain ETFs may pay more frequently."
  },
  {
    q: "Can a company stop paying dividends?",
    a: "Yes. Dividends are not guaranteed. A company may reduce or suspend its dividend if profits drop or if it needs to conserve cash during tough economic times."
  },
  {
    q: "What's a good dividend yield to look for?",
    a: "A 3%–5% yield is generally considered strong and sustainable. Yields over 7% may indicate risk or a potential dividend cut — always check the payout ratio and company health."
  },
  {
    q: "What is a payout ratio, and why does it matter?",
    a: "The payout ratio is the percentage of earnings paid out as dividends. A ratio under 60% is often considered sustainable. A higher ratio may suggest the dividend is at risk if earnings decline."
  },
  {
    q: "Do I pay taxes on dividends?",
    a: "Yes. Most dividends are taxable, though qualified dividends are usually taxed at a lower rate than ordinary income. Taxes vary by country, so check your local regulations."
  },
  {
    q: "What's the difference between dividend yield and dividend growth?",
    a: "Dividend Yield: Measures current income (dividend ÷ stock price).\n\nDividend Growth: Measures how fast the dividend amount increases over time.\nA balanced investor often seeks a combination of both."
  },
  {
    q: "Should I reinvest my dividends automatically (DRIP)?",
    a: "If you're focused on long-term growth, DRIP is a powerful tool to compound returns. If you need the cash for expenses or flexibility, you may prefer receiving payouts."
  },
  {
    q: "What happens if the stock price drops? Do I still get dividends?",
    a: "Yes — if the company maintains its dividend policy. However, a sharp price drop may signal financial issues, which could lead to a dividend cut."
  },
  {
    q: "How can I build monthly dividend income?",
    a: "Buy stocks or ETFs that pay on different months, so you receive at least one payout per month. Many investors build 'monthly income calendars' using this strategy."
  },
  {
    q: "What are some beginner-friendly dividend stocks or ETFs?",
    a: "Popular choices include:\n\n- Dividend Aristocrats (25+ years of dividend increases)\n- Blue-chip stocks (e.g., Johnson & Johnson, Procter & Gamble)\n- Dividend ETFs like SCHD, VIG, or HDV"
  }
];

const Info: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-solarized-base00 dark:text-solarized-base0">📘 Understanding Stocks & Dividends</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📈 What Is a Stock?</h2>
        <p className="mb-2">A stock represents ownership in a company. When you buy a stock, you're purchasing a small piece of that business, also known as a share. Stocks allow investors to benefit from a company's growth and profitability over time through price appreciation and income.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">💸 What Are Dividends?</h2>
        <p className="mb-2">Dividends are regular payments made by companies to their shareholders, typically quarterly. These payments come from a company's profits and are a way to share success with investors. Not all companies pay dividends—those that do are often more stable and established.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🔁 What Is DRIP (Dividend Reinvestment Plan)?</h2>
        <p className="mb-2">DRIP stands for Dividend Reinvestment Plan. It allows investors to automatically use their dividend payments to purchase more shares of the same stock instead of receiving cash. Over time, this creates a snowball effect, compounding your investment and increasing your future dividend payouts.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📊 Why Focus on Dividend Investing?</h2>
        <ul className="list-disc pl-6 mb-2">
          <li><b>Passive Income:</b> Receive consistent cash flow regardless of stock price movements.</li>
          <li><b>Compounding Growth:</b> Reinvested dividends accelerate portfolio growth over time.</li>
          <li><b>Stability:</b> Dividend-paying companies are often more financially secure.</li>
          <li><b>Inflation Protection:</b> Growing dividends can help keep up with the cost of living.</li>
          <li><b>Tax Advantages:</b> Qualified dividends are often taxed at lower rates.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🔍 How to Pick Good Dividend Stocks</h2>
        <ul className="list-disc pl-6 mb-2">
          <li><b>Dividend Yield:</b> Annual dividend compared to stock price.</li>
          <li><b>Payout Ratio:</b> Percentage of earnings paid as dividends (sustainable is typically under 60%).</li>
          <li><b>Dividend Growth:</b> Look for companies with a history of increasing dividends annually.</li>
          <li><b>Earnings Stability:</b> Consistent profits support consistent payouts.</li>
          <li><b>Sector Diversification:</b> Avoid putting all your money in one sector (e.g., just utilities or REITs).</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">⚠️ Dividend Traps to Avoid</h2>
        <ul className="list-disc pl-6 mb-2">
          <li><b>High Yield, Low Quality:</b> A high dividend yield can be a red flag. Always check if the company can afford to keep paying it.</li>
          <li><b>Unstable Business:</b> Don't sacrifice company fundamentals for short-term income.</li>
          <li><b>Lack of Growth:</b> Dividends are important, but total return matters too. Look for a balance.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📆 Monthly Payout Strategy</h2>
        <p className="mb-2">Many dividend investors build a portfolio that pays monthly income by combining stocks with staggered payout dates. This allows for more consistent cash flow, ideal for budgeting or reinvestment.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🧠 Final Takeaway</h2>
        <p>Dividend investing is not a get-rich-quick strategy—it's a long-term approach to building wealth through consistent income and disciplined reinvestment. With the right tools and a smart portfolio, you can grow your passive income month after month, year after year.</p>
      </section>
      <h2 className="text-2xl font-bold mt-12 mb-4 text-solarized-base00 dark:text-solarized-base0">❓ Frequently Asked Questions (FAQs)</h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-solarized-base1 dark:border-solarized-base01 rounded-lg bg-solarized-base2 dark:bg-solarized-base02">
            <button
              className="w-full text-left px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solarized-blue flex justify-between items-center"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`faq-panel-${idx}`}
            >
              <span className="font-semibold text-solarized-base00 dark:text-solarized-base0">{faq.q}</span>
              <span className="ml-2 text-solarized-blue">{open === idx ? '▲' : '▼'}</span>
            </button>
            {open === idx && (
              <div id={`faq-panel-${idx}`} className="px-4 pb-4 text-solarized-base01 dark:text-solarized-base1 whitespace-pre-line">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info; 