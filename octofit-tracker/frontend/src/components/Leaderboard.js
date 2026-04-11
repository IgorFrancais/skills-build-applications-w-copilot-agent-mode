import { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewCard from './DataViewCard';

function Leaderboard() {
  const [entries, setEntries] = useState([]);

  const endpoint = useMemo(() => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    }
    return 'http://localhost:8000/api/leaderboard/';
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Rank',
        key: 'rank',
        render: (entry) => entry.rank ?? '-',
      },
      { header: 'Team', key: 'team' },
      {
        header: 'Points',
        key: 'points',
        render: (entry) => entry.points ?? 0,
      },
    ],
    []
  );

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const normalized = Array.isArray(data) ? data : data.results || [];
      setEntries(normalized);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }, [endpoint]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return (
    <DataViewCard
      title="Leaderboard"
      subtitle="Track team performance in real time"
      endpoint={endpoint}
      rows={entries}
      columns={columns}
      searchPlaceholder="Search by team or points"
      emptyMessage="No leaderboard entries found."
      rowKey={(entry) => entry.id || entry._id || entry.team}
      onRefresh={loadLeaderboard}
    />
  );
}

export default Leaderboard;
