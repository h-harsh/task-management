import { Table } from '../../components';
import { useTasksFetch } from '../../hooks';

const Open = () => {
  const { tasks, loading, error } = useTasksFetch('OPEN');

  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

  return (
    <div>
      <Table tasks={tasks} currentStatus='OPEN' />
    </div>
  );
};

export default Open;
