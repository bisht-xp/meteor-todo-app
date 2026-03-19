import { Trash2 } from "lucide-react";
import React from "react";

const Task = ({ task, onToggle, onDelete }) => {
  return (
    <li key={task._id} className={task.isChecked ? "checked" : ""}>
      <input
        type="checkbox"
        checked={task.isChecked || false}
        onChange={() => onToggle(task._id, task.isChecked)}
      />
      <span>{task.text}</span>
      <button
        className="delete"
        onClick={() => onDelete(task._id)}
        title="Delete task"
      >
        <Trash2 size={12}  />
      </button>
    </li>
  );
};

export default Task;
