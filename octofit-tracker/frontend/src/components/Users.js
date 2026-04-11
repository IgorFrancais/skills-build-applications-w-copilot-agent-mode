import { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewCard from './DataViewCard';

function Users() {
  const [users, setUsers] = useState([]);

  const endpoint = useMemo(() => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    }
    return 'http://localhost:8000/api/users/';
  }, []);

  const columns = useMemo(
    () => [
      { header: 'Name', key: 'name' },
      {
        header: 'Email',
        key: 'email',
        render: (user) => (
          <a className="link-primary text-decoration-none" href={`mailto:${user.email}`}>
            {user.email || '-'}
          </a>
        ),
      },
      { header: 'Team', key: 'team' },
    ],
    []
  );

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const normalized = Array.isArray(data) ? data : data.results || [];
      setUsers(normalized);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [endpoint]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <DataViewCard
      title="Users"
      subtitle="Manage team members and profile details"
      endpoint={endpoint}
      rows={users}
      columns={columns}
      searchPlaceholder="Search by name, email, or team"
      emptyMessage="No users found."
      rowKey={(user) => user.id || user._id || user.email}
      onRefresh={loadUsers}
    />
  );
}

export default Users;
