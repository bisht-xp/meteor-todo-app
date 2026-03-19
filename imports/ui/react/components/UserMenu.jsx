import React, { useState, useEffect, useRef } from "react";
import { Meteor } from "meteor/meteor";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";

const UserMenu = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    Meteor.logout();
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className={`user-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="user-avatar">{username?.charAt(0).toUpperCase()}</div>
        <span className="user-name">{username}</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-profile">
            <div className="dropdown-avatar">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="dropdown-info">
              <span className="dropdown-username">{username}</span>
              <span className="dropdown-role">Member</span>
            </div>
          </div>

          <div className="dropdown-divider" />

          <button className="dropdown-item logout" onClick={handleLogout}>
            <LogOut />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
