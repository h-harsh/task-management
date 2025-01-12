import { useEffect, useCallback, useState } from 'react';
import { useTaskStore } from '../store';
import { fetchTasksHandler } from '../api/handlers';
import { ITaskStatus, ITask } from '../types';
import { PAGE_SIZE } from '../constants/table';

const useTasksFetch = (status: ITaskStatus) => {
  const { fetchTasksState } = useTaskStore();
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, error } = fetchTasksState;

  const fetchTask = useCallback(({ status, page }: { 
    status: ITaskStatus, 
    page: { size: number, offset: number } 
  }) => {
    fetchTasksHandler({ 
      status, 
      page
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    setAllTasks([]);
    setCurrentPage(0);
    setHasMore(true);
    
    fetchTask({ 
      status, 
      page: { size: PAGE_SIZE, offset: 0 } 
    });
  }, [status, fetchTask]);

  // Update allTasks when new data arrives
  useEffect(() => {
    if (data?.tasks) {
      if (currentPage === 0) {
        setAllTasks(data.tasks);
      } else {
        setAllTasks(prev => {
          const newTasks = data.tasks.filter(
            newTask => !prev.some(existingTask => existingTask.id === newTask.id)
          );
          return [...prev, ...newTasks];
        });
      }
      setHasMore(data.pagination.has_next);
    }
  }, [data, currentPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) {return;}
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    fetchTask({
      status,
      page: { 
        size: PAGE_SIZE, 
        offset: nextPage * PAGE_SIZE 
      }
    });
  }, [currentPage, hasMore, loading, status, fetchTask]);

  return {
    tasks: allTasks,
    loading,
    error,
    hasMore,
    loadMore
  };
};

export default useTasksFetch;