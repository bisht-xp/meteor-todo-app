import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
// import { useTaskList } from "../hooks/useTaskList";
import Task from "./Task";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "../../../db/TaskCollection";

const TaskList = () => {
  const [text, setText] = useState("");
  const [hideCompleted, setHide] = useState(false);

  const { tasks, isLoading } = useTracker(() => {
    const sub = Meteor.subscribe("tasks");
    return {
      isLoading: !sub.ready(),
      // Only tasks with NO projectId belong to the main list
      tasks: TasksCollection.find(
        { projectId: { $exists: false } },
        { sort: { createdAt: -1 } },
      ).fetch(),
    };
  });

  const toggleTask = async (taskId, currentState) => {
    try {
      await Meteor.callAsync("tasks.setIsChecked", taskId, !currentState);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await Meteor.callAsync("tasks.remove", taskId);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await Meteor.callAsync("tasks.insert", text.trim());
      setText("");
    } catch (err) {
      alert(err.reason || "Failed to add task");
    }
  };

  if (isLoading) return <div className="loading">Loading tasks</div>;

  const visibleTasks = hideCompleted
    ? tasks.filter((t) => !t.isChecked)
    : tasks;

  const incompleteCount = tasks.filter((t) => !t.isChecked).length;

  return (
    <div className="tasklist-section">
      {/* ── Add Task Form ── */}
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
        />
        <button type="submit">Add Task</button>
      </form>

      
      <div className="filter">
        <button
          id="hide-completed-button"
          onClick={() => setHide((prev) => !prev)}
          type="button"
        >
          {hideCompleted ? "Show All" : "Hide Completed"}
        </button>
        <div className>
          <span className="task-count">{incompleteCount} remaining</span>
        </div>
      </div>

      <ul className="tasks">
        {visibleTasks.length === 0 ? (
          <li className="no-tasks">
            {hideCompleted ? "No pending tasks" : "No tasks yet"}
          </li>
        ) : (
          visibleTasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;
