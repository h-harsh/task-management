import { Table } from '../../components';
import { useTasksFetch } from '../../hooks';

const InProgress = () => {
  const { tasks, loading, error } = useTasksFetch('IN_PROGRESS');
  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

  return (
    <div>
      <Table tasks={tasks} currentStatus='IN_PROGRESS' />
    </div>
  );
}

export default InProgress
