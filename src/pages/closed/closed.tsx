import { Table } from '../../components';
import { useTasksFetch } from '../../hooks';

const Closed = () => {
  const { tasks, loading, error } = useTasksFetch('CLOSED');
  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

  return (
    <div>
      <h1 >Closed</h1>
      <Table tasks={tasks} />
    </div>
  );
}

export default Closed
