import React from "react";
import { Trash2 } from "lucide-react";
import AssignProject from "./AssignProject";

const Task = ({ task, onToggle, onDelete, showAssign = false }) => {
  return (
    <li key={task._id} className={task.isChecked ? "checked" : ""}>
      <input
        type="checkbox"
        checked={task.isChecked || false}
        onChange={() => onToggle(task._id, task.isChecked)}
      />
      <span>{task.text}</span>
      <div className="task-actions">
        {showAssign && <AssignProject taskId={task._id} />}
        <button
          className="delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </li>
  );
};

export default Task;
