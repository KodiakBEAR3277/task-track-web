import React, { useState, useEffect } from 'react';
import { Calendar, Bell, LayoutGrid, Save, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline_date: '',
    deadline_time: '',
    notifications: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    deadline_date: '',
    deadline_time: '',
    is_completed: false,
    notifications: false
  });

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

  // Helper function to format datetime for API
  const formatDeadlineForAPI = (date, time) => {
    if (!date) return null;
    const combinedDateTime = time 
      ? `${date}T${time}:00` 
      : `${date}T00:00:00`;
    return combinedDateTime;
  };

  // Update handleAddProject to include deadline
  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedDeadline = formatDeadlineForAPI(
        newProject.deadline_date,
        newProject.deadline_time
      );

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          deadline: formattedDeadline,
          notifications: newProject.notifications
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        await fetchProjects(); // Refresh the projects list
        
        // Reset form
        setNewProject({
          title: '',
          description: '',
          deadline_date: '',
          deadline_time: '',
          notifications: false
        });
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
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

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
        await fetchProjects();
        setShowEditModal(false);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  // Update handleUpdateProject to include completion toggle
  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedDeadline = formatDeadlineForAPI(
        editedProject.deadline_date,
        editedProject.deadline_time
      );

      const response = await fetch(`http://localhost:5000/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editedProject.title,
          description: editedProject.description,
          deadline: formattedDeadline,
          notifications: editedProject.notifications,
          is_completed: editedProject.is_completed
        })
      });

      if (response.ok) {
        await fetchProjects(); // Refresh the projects list
        setShowEditModal(false);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update project');
    }
  };

  // Update handleProjectClick to properly parse existing deadline
  const handleProjectClick = (project) => {
    let deadline_date = '';
    let deadline_time = '';

    if (project.deadline) {
      const deadlineDate = new Date(project.deadline);
      deadline_date = deadlineDate.toISOString().split('T')[0];
      deadline_time = deadlineDate.toTimeString().slice(0, 5);
    }

    setSelectedProject(project);
    setEditedProject({
      ...project,
      deadline_date,
      deadline_time,
      notifications: project.notifications || false
    });
    setShowEditModal(true);
  };

  // Add navigation handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Add this helper function at the top of your component
  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Update the deadline display in the project card
  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'text-gray-400';
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    if (deadlineDate < now) {
      return 'text-red-500'; // Past due
    } else if (deadlineDate <= threeDaysFromNow) {
      return 'text-yellow-400'; // Due soon (within 3 days)
    } else {
      return 'text-blue-400'; // Future deadline
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
          <Card 
            key={project.id}
            className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
            onClick={() => handleProjectClick(project)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-gray-400 mt-1">{project.description}</p>
                </div>
                {project.notifications && (
                  <Bell className="h-5 w-5 text-yellow-400" />
                )}
              </div>
              
              {project.deadline && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className={getDeadlineColor(project.deadline)}>
                    Due: {formatDeadline(project.deadline)}
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.is_completed 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {project.is_completed ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Update Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Project</h2>
              <input
                type="text"
                placeholder="Project Title"
                className="w-full p-2 mb-4 bg-gray-700 rounded"
                value={editedProject.title}
                onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
              />
              <textarea
                placeholder="Project Description"
                className="w-full p-2 mb-4 bg-gray-700 rounded h-32"
                value={editedProject.description}
                onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
              />
              <div className="mb-4">
                <label className="block mb-2">Deadline Date</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-700 rounded mb-2"
                  value={editedProject.deadline_date}
                  onChange={(e) => setEditedProject({...editedProject, deadline_date: e.target.value})}
                />
                <label className="block mb-2">Deadline Time</label>
                <input
                  type="time"
                  className="w-full p-2 bg-gray-700 rounded"
                  value={editedProject.deadline_time}
                  onChange={(e) => setEditedProject({...editedProject, deadline_time: e.target.value})}
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={editedProject.notifications}
                  onChange={(e) => setEditedProject({...editedProject, notifications: e.target.checked})}
                  className="mr-2"
                />
                <span>Enable notifications</span>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={editedProject.is_completed}
                  onChange={(e) => setEditedProject({...editedProject, is_completed: e.target.checked})}
                  className="mr-2"
                />
                <span>Mark as completed</span>
              </div>
              <div className="flex justify-between gap-4">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteProject(selectedProject.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                    onClick={handleUpdateProject}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Bar */}      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-around items-center">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center"
            onClick={() => handleNavigation('/home')}
          >
            <LayoutGrid className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center"
            onClick={() => handleNavigation('/calendar')}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Calendar</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center"
            onClick={() => handleNavigation('/notifications')}
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs mt-1">Notifications</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center"
          >
            <Save className="h-6 w-6" />
            <span className="text-xs mt-1">Save</span>
          </Button>
        </div>
      </div>

      {/* Update Add Project Modal */}
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
              <div className="mb-4">
                <label className="block mb-2">Deadline Date</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-700 rounded mb-2"
                  value={newProject.deadline_date}
                  onChange={(e) => setNewProject({...newProject, deadline_date: e.target.value})}
                />
                <label className="block mb-2">Deadline Time</label>
                <input
                  type="time"
                  className="w-full p-2 bg-gray-700 rounded"
                  value={newProject.deadline_time}
                  onChange={(e) => setNewProject({...newProject, deadline_time: e.target.value})}
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={newProject.notifications}
                  onChange={(e) => setNewProject({...newProject, notifications: e.target.checked})}
                  className="mr-2"
                />
                <span>Enable notifications</span>
              </div>
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