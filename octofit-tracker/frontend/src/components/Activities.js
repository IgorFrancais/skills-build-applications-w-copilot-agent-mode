import { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewCard from './DataViewCard';

function Activities() {
  const [activities, setActivities] = useState([]);

  const endpoint = useMemo(() => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    }
    return 'http://localhost:8000/api/activities/';
  }, []);

  const columns = useMemo(
    () => [
      { header: 'User', key: 'user' },
      { header: 'Activity', key: 'activity' },
      {
        header: 'Duration (min)',
        key: 'duration',
        render: (activity) => activity.duration ?? '-',
      },
    ],
    []
  );

  const loadActivities = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const normalized = Array.isArray(data) ? data : data.results || [];
      setActivities(normalized);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }, [endpoint]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <DataViewCard
      title="Activities"
      subtitle="Monitor training sessions and durations"
      endpoint={endpoint}
      rows={activities}
      columns={columns}
      searchPlaceholder="Search by user or activity"
      emptyMessage="No activities found."
      rowKey={(activity) => activity.id || activity._id || `${activity.user}-${activity.activity}`}
      onRefresh={loadActivities}
    />
  );
}

export default Activities;
