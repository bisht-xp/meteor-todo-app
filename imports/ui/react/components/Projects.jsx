import React, { useState } from "react";
import Task from "./Task";
import { FolderOpen, Trash2 } from "lucide-react";
import Modal from "./Modal";

const Projects = ({ project, projectTasks }) => {
  const [taskInputs, setTaskInputs] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [hideCompleted, setHide] = useState(false);

  const tasks = projectTasks.filter((t) => t.projectId === project._id);
  const remaining = tasks.filter((t) => !t.isChecked).length;

  const handleConfirmDelete = () => {
    handleDeleteProject(project._id);
    setShowDeleteModal(false);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await Meteor.callAsync("projects.remove", projectId);
      setError("");
    } catch (err) {
      setError(err.reason || "Failed to delete project");
    }
  };

  const handleTaskInput = (projectId, value) => {
    setTaskInputs((prev) => ({ ...prev, [projectId]: value }));
  };

  const handleAddTask = async (e, projectId) => {
    e.preventDefault();
    const text = (taskInputs[projectId] || "").trim();
    if (!text) return;
    try {
      await Meteor.callAsync("tasks.insertInProject", text, projectId);
      setTaskInputs((prev) => ({ ...prev, [projectId]: "" }));
      setError("");
    } catch (err) {
      setError(err.reason || "Failed to add task");
    }
  };

  const handleToggleTask = async (taskId, currentState) => {
    try {
      await Meteor.callAsync("tasks.setIsChecked", taskId, !currentState);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await Meteor.callAsync("tasks.remove", taskId);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const visibleTasks = hideCompleted
    ? tasks.filter((t) => !t.isChecked)
    : tasks;

  return (
    <>
      <div key={project._id} className="project-card">
        <div className="project-header">
          <h3 className="project-title">
            <FolderOpen size={15} color="white" fontWeight={600} />{" "}
            <span>{project.name}</span>
          </h3>
          <button
            className="delete-project"
            onClick={() => setShowDeleteModal(true)}
            title="Delete project"
          >
            <Trash2 size={15}  />
          </button>
        </div>

        <form
          className="task-form"
          onSubmit={(e) => handleAddTask(e, project._id)}
        >
          <input
            type="text"
            value={taskInputs[project._id] || ""}
            onChange={(e) => handleTaskInput(project._id, e.target.value)}
            placeholder="Add a task..."
          />
          <button type="submit">Add</button>
        </form>

        <div className="project-filter">
          <button
            id="hide-completed-button"
            onClick={() => setHide((prev) => !prev)}
            type="button"
          >
            {hideCompleted ? "Show All" : "Hide Completed"}
          </button>
          <div className>
            <span className="task-count">{remaining} remaining</span>
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
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </ul>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This will also delete all ${tasks.length} task${tasks.length !== 1 ? "s" : ""} inside it.`}
        confirmLabel="Yes, delete it"
      />
    </>
  );
};

export default Projects;
