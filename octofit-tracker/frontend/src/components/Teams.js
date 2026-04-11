import { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewCard from './DataViewCard';

function Teams() {
  const [teams, setTeams] = useState([]);

  const endpoint = useMemo(() => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    }
    return 'http://localhost:8000/api/teams/';
  }, []);

  const columns = useMemo(
    () => [
      { header: 'Team Name', key: 'name' },
      {
        header: 'Members',
        key: 'members',
        render: (team) => (team.members || []).join(', ') || '-',
      },
      {
        header: 'Total Members',
        key: 'membersCount',
        render: (team) => (team.members || []).length,
      },
    ],
    []
  );

  const loadTeams = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const normalized = Array.isArray(data) ? data : data.results || [];
      setTeams(normalized);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, [endpoint]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return (
    <DataViewCard
      title="Teams"
      subtitle="Create and track training squads"
      endpoint={endpoint}
      rows={teams}
      columns={columns}
      searchPlaceholder="Search by team name or member"
      emptyMessage="No teams found."
      rowKey={(team) => team.id || team._id || team.name}
      onRefresh={loadTeams}
    />
  );
}

export default Teams;
