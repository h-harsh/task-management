# Task Management Application

A web-based task management tool

## 🌐 Live Demo
[[Link](https://task-management-tm.netlify.app/open)]

## ✨ Features

### Task Views
- Three tab views: Open, In Progress, and Closed tasks
- Task count display for each status
- Persistent tab selection across page reloads
- Retained sorting and search preferences between tab switches

### Task Table
- Columns: Priority, ID, Status, Labels, Name, Due Date, Created At, Assignee
- Infinite scroll pagination
- Keyboard navigation:
  - ↑/↓: Navigate through tasks
  - Enter: Open task details modal
- Global controls with persistence:
  - Sorting by Created At (default), can also sort any column
  - Search by any column
  - Clear options for both search and sort
  - persist sort and filter on page reload

### Focus Mode (Modal View)
- Detailed task view with comments
- Status management with required comments
- Keyboard shortcuts:
  - ←/→: Navigate between tasks
  - 1: Set status to Open
  - 2: Set status to In Progress
  - 3: Set status to Closed


## 🛠️ Technical Details

- React.js
- TypeScript

### Key Libraries
- wouter: For routing
- mantine: UI components
- zustand: state management

### Installation and Run

```yarn install```
```yarn run dev```


## 🔍 Implementation Details

- The backend is mocked using static data and JavaScript promises
1. fetchTasks
2. updateTaskStatus
3. fetchTaskDetails
4. updateTaskComment
- All sorting and filtering operations are performed on the frontend
- The application is designed with keyboard accessibility as a primary focus