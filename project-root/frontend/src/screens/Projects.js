import React, { useState } from 'react';
import { Calendar, Bell, LayoutGrid, Save } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Projects = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Static project data for development
  const projects = [
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete overhaul of company website with modern UI/UX",
      is_completed: false
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Build native mobile app for iOS and Android platforms",
      is_completed: true
    }
  ];

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
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://via.placeholder.com/400x200"
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={project.is_completed}
                  className="mr-2"
                />
                <span>Completed</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
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
              />
              <textarea
                placeholder="Project Description"
                className="w-full p-2 mb-4 bg-gray-700 rounded h-32"
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
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