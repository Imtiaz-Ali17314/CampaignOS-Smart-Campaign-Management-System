import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  MoreVertical,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { format } from 'date-fns';

const CampaignTable = ({ campaigns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.client.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [campaigns, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredCampaigns.length / rowsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const StatusPill = ({ status }) => {
    const config = {
      active: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500',
        icon: Activity 
      },
      paused: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500',
        icon: Clock 
      },
      completed: { 
        bg: 'bg-gray-100 dark:bg-gray-800', 
        text: 'text-gray-700 dark:text-gray-400',
        dot: 'bg-gray-500',
        icon: CheckCircle2 
      }
    };
    const { bg, text, dot, icon: Icon } = config[status] || config.completed;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dot}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Campaign List</h2>
          <p className="text-sm text-muted-foreground">Manage and track all campaigns</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30">
              {['name', 'status', 'budget', 'spend', 'conversions'].map((key) => (
                <th 
                  key={key} 
                  className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2">
                    {key}
                    {sortConfig.key === key ? (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-muted/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm">{campaign.name}</div>
                  <div className="text-xs text-muted-foreground">{campaign.client}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={campaign.status} />
                </td>
                <td className="px-6 py-4 font-mono text-sm">${campaign.budget.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-sm">${campaign.spend.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-primary">{campaign.conversions.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={18} className="text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} results
        </p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 bg-card border border-border rounded-lg text-xs font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 bg-card border border-border rounded-lg text-xs font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;
