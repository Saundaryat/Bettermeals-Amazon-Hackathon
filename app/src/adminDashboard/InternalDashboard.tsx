import React, { useState, useEffect } from 'react';
import { getAllHouseholdsWithPrimaryNamesAndApproval } from '../services/database';
import { internalDashboardStyles } from './styles/InternalDashboard.styles';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import LocalStorageManager from "@/lib/localStorageManager";

const InternalDashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/admin-login" replace />;

  const [households, setHouseholds] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      setDashboardLoading(true);
      const data = await getAllHouseholdsWithPrimaryNamesAndApproval();
      setHouseholds(data);
      setDashboardLoading(false);
    }
    if (user) fetchData();
  }, [user]);

  // Filter households by search
  const filteredHouseholds = households.filter(hh => {
    const name = hh.primaryName || '';
    return (
      (hh.name && hh.name.toLowerCase().includes(search.toLowerCase())) ||
      hh.id.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className={internalDashboardStyles.dashboardContainer} style={internalDashboardStyles.dashboardContainerStyle}>
      <div className={internalDashboardStyles.dashboardHeader}>
        <h1 className={internalDashboardStyles.dashboardTitle}>Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleSignOut} 
          className={internalDashboardStyles.logoutButton}
        >
          Sign Out
        </Button>
      </div>
      
      <div className={internalDashboardStyles.searchContainer}>
        <input
          type="text"
          placeholder="Search by household name, ID, or member name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={internalDashboardStyles.searchInput}
        />
      </div>
      
      <div className={internalDashboardStyles.tableContainer}>
        <div className={internalDashboardStyles.tableWrapper}>
          <table className={internalDashboardStyles.table}>
            <thead>
              <tr className={internalDashboardStyles.tableHeader}>
                <th className={internalDashboardStyles.tableHeaderCell}>Household</th>
                <th className={internalDashboardStyles.tableHeaderCell}>Primary Member</th>
                <th className={internalDashboardStyles.tableHeaderCell}>Plan Approved</th>
                <th className={internalDashboardStyles.tableHeaderCell}>Grocery List Sent</th>
                <th className={internalDashboardStyles.tableHeaderCell}>WhatsApp Sent</th>
              </tr>
            </thead>
            <tbody>
              {dashboardLoading ? (
                <tr>
                  <td colSpan={5} className={internalDashboardStyles.loadingCell}>
                    Loading households...
                  </td>
                </tr>
              ) : filteredHouseholds.length === 0 ? (
                <tr>
                  <td colSpan={5} className={internalDashboardStyles.emptyCell}>
                    No households found.
                  </td>
                </tr>
              ) : (
                filteredHouseholds.map((hh, idx) => (
                  <tr key={hh.id} className={internalDashboardStyles.tableRow(idx)}>
                    <td className={internalDashboardStyles.tableCell}>
                      <div className={internalDashboardStyles.tableCellPrimary}>{hh.name || hh.id}</div>
                      <div className={internalDashboardStyles.tableCellSecondary}>{hh.id}</div>
                    </td>
                    <td className={`${internalDashboardStyles.tableCell} ${internalDashboardStyles.tableCellText}`}>
                      {hh.primaryName || 'N/A'}
                    </td>
                    <td className={internalDashboardStyles.tableCell}>
                      <span className={internalDashboardStyles.statusBadge(hh.approvalStatus)}>
                        {hh.approvalStatus ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className={internalDashboardStyles.tableCell}>
                      <span className={internalDashboardStyles.statusBadge(hh.groceryListSent)}>
                        {hh.groceryListSent ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className={internalDashboardStyles.tableCell}>
                      <span className={internalDashboardStyles.statusBadge(hh.whatsappSent)}>
                        {hh.whatsappSent ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InternalDashboard; 