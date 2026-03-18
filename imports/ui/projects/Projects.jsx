import React, { useState } from 'react';
import { useTracker }       from 'meteor/react-meteor-data';
import { Meteor }           from 'meteor/meteor';
import { ProjectsCollection } from '../../db/ProjectsCollection';
import { TasksCollection }    from '../../db/TaskCollection';

export const Projects = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const [taskInputs, setTaskInputs]         = useState({});
  const [error, setError]                   = useState('');

  // ── Reactive MongoDB data ─────────────────────────────
  const { projects, projectTasks, isLoading } = useTracker(() => {
    const projectsSub     = Meteor.subscribe('projects');
    const projectTasksSub = Meteor.subscribe('projectTasks');

    return {
      isLoading:    !projectsSub.ready() || !projectTasksSub.ready(),
      projects:     ProjectsCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
      projectTasks: TasksCollection.find(
        { projectId: { $exists: true } },
        { sort: { createdAt: 1 } }
      ).fetch(),
    };
  });

  // ── Handlers ─────────────────────────────────────────

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      await Meteor.callAsync('projects.insert', newProjectName);
      setNewProjectName('');
      setError('');
    } catch (err) {
      setError(err.reason || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Delete this project and all its tasks?')) {
      try {
        await Meteor.callAsync('projects.remove', projectId);
        setError('');
      } catch (err) {
        setError(err.reason || 'Failed to delete project');
      }
    }
  };

  // ✅ This was missing — updates the input box per project
  const handleTaskInput = (projectId, value) => {
    setTaskInputs(prev => ({ ...prev, [projectId]: value }));
  };

  const handleAddTask = async (e, projectId) => {
    e.preventDefault();
    const text = (taskInputs[projectId] || '').trim();
    if (!text) return;
    try {
      await Meteor.callAsync('tasks.insertInProject', text, projectId);
      // Clear only this project's input after success
      setTaskInputs(prev => ({ ...prev, [projectId]: '' }));
      setError('');
    } catch (err) {
      setError(err.reason || 'Failed to add task');
    }
  };

  const handleToggleTask = async (taskId, currentState) => {
    try {
      await Meteor.callAsync('tasks.setIsChecked', taskId, !currentState);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await Meteor.callAsync('tasks.remove', taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // ── Render ────────────────────────────────────────────

  if (isLoading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-section">
      <h2>📁 Projects</h2>

      {/* Error message */}
      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
      )}

      {/* ── New Project Form ── */}
      <form className="project-form" onSubmit={handleCreateProject}>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name..."
        />
        <button type="submit">+ Add Project</button>
      </form>

      {/* ── Projects List ── */}
      {projects.length === 0 ? (
        <p className="no-projects">No projects yet. Create one above!</p>
      ) : (
        projects.map(project => {
          const tasks     = projectTasks.filter(t => t.projectId === project._id);
          const remaining = tasks.filter(t => !t.isChecked).length;

          return (
            <div key={project._id} className="project-card">

              {/* ── Project Header ── */}
              <div className="project-header">
                <h3>📂 {project.name}</h3>
                <span className="task-count">{remaining} remaining</span>
                <button
                  className="delete-project"
                  onClick={() => handleDeleteProject(project._id)}
                  title="Delete project"
                >
                  &times;
                </button>
              </div>

              {/* ── Add Task to Project ── */}
              <form
                className="task-form"
                onSubmit={(e) => handleAddTask(e, project._id)}
              >
                <input
                  type="text"
                  value={taskInputs[project._id] || ''}
                  onChange={
                    // ✅ handleTaskInput is now defined above
                    (e) => handleTaskInput(project._id, e.target.value)
                  }
                  placeholder="Add a task to this project..."
                />
                <button type="submit">Add Task</button>
              </form>

              {/* ── Task List ── */}
              <ul className="tasks">
                {tasks.length === 0 ? (
                  <li className="no-tasks">No tasks yet</li>
                ) : (
                  tasks.map(task => (
                    <li
                      key={task._id}
                      className={task.isChecked ? 'checked' : ''}
                    >
                      <input
                        type="checkbox"
                        checked={task.isChecked || false}
                        onChange={() => handleToggleTask(task._id, task.isChecked)}
                      />
                      <span>{task.text}</span>
                      <button
                        className="delete"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        &times;
                      </button>
                    </li>
                  ))
                )}
              </ul>

            </div>
          );
        })
      )}
    </div>
  );
};