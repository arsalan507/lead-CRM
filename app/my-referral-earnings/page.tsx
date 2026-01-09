'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// MANDATORY: The 'default' export is what Next.js looks for to render the page
export default function MyReferralEarningsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralEarnings();
  }, []);

  const fetchReferralEarnings = async () => {
    try {
      const response = await fetch('/api/referral-earnings/my-earnings');
      const result = await response.json();
      if (result.success) setLeads(result.data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = leads.reduce((sum, l) => sum + (l.incentive_amount || 0), 0);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-purple-600 p-8 rounded-2xl text-white shadow-lg mb-6">
          <h1 className="text-sm opacity-80 uppercase tracking-widest">Total Earnings</h1>
          <div className="text-5xl font-bold mt-2">₹{total.toLocaleString('en-IN')}</div>
          <p className="mt-2 opacity-70">From {leads.length} reviewed leads</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Invoice</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Incentive</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-green-50">
                  <td className="p-4 font-bold text-gray-900">{l.customer_name}</td>
                  <td className="p-4 text-gray-500">{l.invoice_no}</td>
                  <td className="p-4 text-right font-bold text-purple-700">₹{l.incentive_amount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}