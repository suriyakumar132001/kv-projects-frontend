// ===============================================
// projectRoutes.jsx
// Construction ERP Project Routes
// ===============================================

import React from "react";
import { Routes, Route } from "react-router-dom";

// Project Pages

import ProjectDashboard from "../pages/projects/ProjectDashboard";

import ProjectList from "../pages/projects/ProjectList";

import CreateProject from "../pages/projects/CreateProject";

import ProjectDetails from "../pages/projects/ProjectDetails";

import EditProject from "../pages/projects/EditProject";

// ===============================================
// Component
// ===============================================

const ProjectRoutes = () => {
  return (
    <Routes>
      {/* Project Dashboard */}

      <Route path="/projects/dashboard" element={<ProjectDashboard />} />

      {/* Project List */}

      <Route path="/projects" element={<ProjectList />} />

      {/* Create Project */}

      <Route path="/projects/create" element={<CreateProject />} />

      {/* Project Details */}

      <Route path="/projects/:id" element={<ProjectDetails />} />

      {/* Edit Project */}

      <Route path="/projects/edit/:id" element={<EditProject />} />
    </Routes>
  );
};

export default ProjectRoutes;
