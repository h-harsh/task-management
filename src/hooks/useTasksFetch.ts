import { useEffect } from 'react';
import { useTaskStore } from '../store';
import { fetchTasksHandler } from '../api/handlers';
import { ITaskStatus } from '../types'; // Assuming you have this type defined

const useTasksFetch = (status: ITaskStatus) => {
  const { fetchTasksState } = useTaskStore();
  const { data, loading, error } = fetchTasksState;

  useEffect(() => {
    fetchTasksHandler({ 
      status, 
      page: { size: 10, offset: 0 } 
    });
  }, [status]);

  return {
    tasks: data?.tasks || [],
    pagination: data?.pagination || {},
    loading,
    error
  };
}; 

export default useTasksFetch;