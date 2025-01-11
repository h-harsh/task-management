import { Table } from '../../components';
import { useTasksFetch } from '../../hooks';

const Closed = () => {
  const { tasks, loading, error } = useTasksFetch('CLOSED');
  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

  return (
    <div>
      <Table tasks={tasks} currentStatus='CLOSED' />
    </div>
  );
}

export default Closed
