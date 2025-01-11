import styles from './open.module.css';
import { Table } from '../../components';
import { useTasksFetch } from '../../hooks';

const Open = () => {
  const { tasks, loading, error } = useTasksFetch('OPEN');

  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

  return (
    <div>
      <h1 className={styles.title}>Open</h1>
      <Table tasks={tasks} />
    </div>
  );
};

export default Open;
