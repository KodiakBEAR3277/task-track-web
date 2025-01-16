import React, { useState, useEffect } from 'react';
import { Calendar, Bell, LayoutGrid, Save } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      if (response.ok) {
        setProjects(data.data);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Add new project
  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewProject({ title: '', description: '' });
        fetchProjects(); // Refresh projects list
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to add project');
    }
  };

  // Add delete handler
  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== projectId));
      }
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  // Add completion toggle handler
  const handleToggleComplete = async (projectId, isCompleted) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_completed: !isCompleted })
      });

      if (response.ok) {
        setProjects(projects.map(project => 
          project.id === projectId 
            ? {...project, is_completed: !isCompleted}
            : project
        ));
      }
    } catch (err) {
      setError('Failed to update project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowAddModal(true)} className="bg-yellow-400 text-black hover:bg-yellow-500">
            Add Project
          </Button>
          <Button variant="outline">Show All</Button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={project.is_completed}
                  onChange={() => handleToggleComplete(project.id, project.is_completed)}
                  className="mr-2"
                />
                <span>Completed</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Bar */}      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-around items-center">
          <Button variant="ghost" className="flex flex-col items-center">
            <LayoutGrid className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center">
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Calendar</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center">
            <Bell className="h-6 w-6" />
            <span className="text-xs mt-1">Notifications</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center">
            <Save className="h-6 w-6" />
            <span className="text-xs mt-1">Save</span>
          </Button>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Project</h2>
              <input
                type="text"
                placeholder="Project Title"
                className="w-full p-2 mb-4 bg-gray-700 rounded"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              />
              <textarea
                placeholder="Project Description"
                className="w-full p-2 mb-4 bg-gray-700 rounded h-32"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-yellow-400 text-black hover:bg-yellow-500"
                  onClick={handleAddProject}
                >
                  Add Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Projects;