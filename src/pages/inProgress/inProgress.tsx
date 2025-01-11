import { Table } from '../../components';
import { useTasksFetch } from '../../hooks';

const InProgress = () => {
  const { tasks, loading, error } = useTasksFetch('IN_PROGRESS');
  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

  return (
    <div>
      <h1 >InProgress</h1>
      <Table tasks={tasks} />
    </div>
  );
}

export default InProgress
