import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { ProjectsCollection } from "../../db/ProjectsCollection";
import { TasksCollection } from "../../db/TaskCollection";
import Projects from "./components/Projects";

export const GroupTasks = () => {
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState("");

  const { projects, projectTasks, isLoading } = useTracker(() => {
    const projectsSub = Meteor.subscribe("projects");
    const projectTasksSub = Meteor.subscribe("projectTasks");

    return {
      isLoading: !projectsSub.ready() || !projectTasksSub.ready(),
      projects: ProjectsCollection.find(
        {},
        { sort: { createdAt: -1 } },
      ).fetch(),
      projectTasks: TasksCollection.find(
        { projectId: { $exists: true } },
        { sort: { createdAt: 1 } },
      ).fetch(),
    };
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      await Meteor.callAsync("projects.insert", newProjectName);
      setNewProjectName("");
      setError("");
    } catch (err) {
      setError(err.reason || "Failed to create project");
    }
  };

  if (isLoading) return <div className="loading">Loading projects</div>;

  return (
    <div className="projects-section">
      <h2>Projects</h2>
      {error && <p className="error-msg">{error}</p>}

      <form className="project-form" onSubmit={handleCreateProject}>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Project Name"
        />
        <button type="submit">+ New Project</button>
      </form>

      {projects.length === 0 ? (
        <p className="no-projects">No projects yet create one above.</p>
      ) : (
        projects.map((project) => {
          return <Projects key={project._id} project={project} projectTasks={projectTasks} />;
        })
      )}
    </div>
  );
};
