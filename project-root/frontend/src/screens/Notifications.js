import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Bell, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate();

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  // Send browser notification
  const sendNotification = (project) => {
    if (!notificationsEnabled) return;

    const timeUntilDeadline = new Date(project.deadline) - new Date();
    const hoursUntilDeadline = Math.floor(timeUntilDeadline / (1000 * 60 * 60));
    
    new Notification('Project Deadline Reminder', {
      body: `"${project.title}" is due in ${hoursUntilDeadline} hours`,
      icon: '/path/to/your/icon.png' // Add your notification icon
    });
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter projects with notifications enabled and upcoming deadlines
        const notificationProjects = data.data.filter(project => {
          if (!project.notifications || !project.deadline || project.is_completed) {
            return false;
          }
          const deadline = new Date(project.deadline);
          const now = new Date();
          return deadline > now;
        }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        setProjects(notificationProjects);

        // Check for projects due soon and send notifications
        notificationProjects.forEach(project => {
          const deadline = new Date(project.deadline);
          const now = new Date();
          const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);
          
          // Notify if deadline is within 24 hours
          if (hoursUntilDeadline <= 24 && hoursUntilDeadline > 0) {
            sendNotification(project);
          }
        });
      }
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchProjects();
    // Check for updates every minute
    const interval = setInterval(fetchProjects, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = Math.floor((deadlineDate - now) / (1000 * 60 * 60));
    
    if (diffHours <= 24) {
      return {
        text: `Due in ${diffHours} hours`,
        color: 'text-red-400'
      };
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return {
        text: `Due in ${diffDays} days`,
        color: 'text-blue-400'
      };
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-6">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-white p-6">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex gap-4">
          <Button 
            onClick={requestNotificationPermission}
            className={`${
              notificationsEnabled ? 'bg-green-500' : 'bg-yellow-400'
            } text-black hover:opacity-90`}
          >
            {notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
          </Button>
          <Button 
            onClick={fetchProjects}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Refresh
          </Button>
        </div>
      </div>

      {projects.length > 0 ? (
        <>
          <Alert className="mb-6 bg-yellow-400/10 border-yellow-400">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <AlertDescription>
              You have {projects.length} upcoming deadline{projects.length !== 1 ? 's' : ''}!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => {
              const deadlineStatus = getDeadlineStatus(project.deadline);
              return (
                <Card 
                  key={project.id}
                  className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => navigate(`/projects?id=${project.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-400 mb-2">{project.description}</p>
                      </div>
                      <Bell className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className={deadlineStatus.color}>
                        {deadlineStatus.text}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-400 mt-8">
          No upcoming deadlines
        </div>
      )}
    </div>
  );
};

export default Notifications;
