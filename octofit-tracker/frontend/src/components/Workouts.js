import { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewCard from './DataViewCard';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);

  const endpoint = useMemo(() => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    }
    return 'http://localhost:8000/api/workouts/';
  }, []);

  const columns = useMemo(
    () => [
      { header: 'User', key: 'user' },
      { header: 'Workout', key: 'workout' },
      {
        header: 'Reps',
        key: 'reps',
        render: (workout) => workout.reps ?? '-',
      },
    ],
    []
  );

  const loadWorkouts = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const normalized = Array.isArray(data) ? data : data.results || [];
      setWorkouts(normalized);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  }, [endpoint]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  return (
    <DataViewCard
      title="Workouts"
      subtitle="Discover personalized exercises and rep goals"
      endpoint={endpoint}
      rows={workouts}
      columns={columns}
      searchPlaceholder="Search by user, workout, or reps"
      emptyMessage="No workouts found."
      rowKey={(workout) => workout.id || workout._id || `${workout.user}-${workout.workout}`}
      onRefresh={loadWorkouts}
    />
  );
}

export default Workouts;
