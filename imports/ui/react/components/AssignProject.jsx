import React, { useState, useEffect, useRef } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { ProjectsCollection } from "../../../db/ProjectsCollection";
import { Folder } from "lucide-react";

/**
 * AssignProject — dropdown to move a task into a project
 * Appears on hover of each task in the main list
 */
const AssignProject = ({ taskId, onAssigned }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(null);

  // Get all projects reactively
  const projects = useTracker(() => {
    Meteor.subscribe("projects");
    return ProjectsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleAssign = async (projectId) => {
    try {
      await Meteor.callAsync("tasks.assignToProject", taskId, projectId);
      setIsOpen(false);
      setError("");
      if (onAssigned) onAssigned(); // notify parent
    } catch (err) {
      setError(err.reason || "Failed to assign task");
    }
  };

  return (
    <div className="assign-wrapper" ref={ref}>

      <button
        className="assign-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Assign to project"
        type="button"
      >
        <Folder size={15} />
        <span>Assign</span>
      </button>

      {isOpen && (
        <div className="assign-dropdown">
          <p className="assign-label">Move to project</p>

          {error && <p className="assign-error">{error}</p>}

          {projects.length === 0 ? (
            <p className="assign-empty">No projects yet</p>
          ) : (
            projects.map((project) => (
              <button
                key={project._id}
                className="assign-option"
                onClick={() => handleAssign(project._id)}
                type="button"
              >
                <Folder size={15} />
                {project.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AssignProject;
