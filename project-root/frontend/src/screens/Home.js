import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Calendar, Bell, Save, Clipboard, X } from 'lucide-react';
import heroImage from '../assets/images/hero.jpg';
import projectImage from '../assets/images/project.jpg';
import taskImage from '../assets/images/task.jpg';
import notificationImage from '../assets/images/notification.jpg';
import clipboardIcon from '../assets/icons/clipboard.svg';

export default function HomePage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    
    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const features = [
        {
            title: "Manage Projects",
            description: "Create, edit, and track your projects.",
            image: projectImage,
            path: '/projects' // Add this line
        },
        {
            title: "Track Tasks",
            description: "Organize tasks within projects and set priorities.",
            image: taskImage,
            path: '/tasks' // Add this line
        },
        {
            title: "Set Notifications",
            description: "Receive notifications for due dates and completion times.",
            image: notificationImage,
            path: '/notifications' // Add this line
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="sticky top-0 w-full bg-gray-800 shadow-lg p-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-700 rounded-md"
                    >
                        <img src={clipboardIcon} alt="Menu" className="w-6 h-6 text-yellow-400" />
                    </button>
                    <span className="text-yellow-400 font-bold text-xl">Task Track</span>
                </div>
                <button 
                    onClick={() => handleNavigation('/login')}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors"
                >
                    Login →
                </button>
            </header>

            {/* Sidebar */}
            <div 
                className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-4">
                    <button 
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-md"
                    >
                        <X className="text-gray-300" />
                    </button>
                    <div className="mt-12 flex flex-col gap-4">
                        <button 
                            onClick={() => handleNavigation('/home')}
                            className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 py-2"
                        >
                            <HomeIcon />
                            <span>Home</span>
                        </button>
                        <button 
                            onClick={() => handleNavigation('/calendar')}
                            className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 py-2"
                        >
                            <Calendar />
                            <span>Calendar</span>
                        </button>
                        <button 
                            onClick={() => handleNavigation('/notifications')}
                            className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 py-2"
                        >
                            <Bell />
                            <span>Notifications</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section 
                className="relative h-[600px] flex items-center justify-center"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Welcome to Task Track</h1>
                    <p className="text-xl text-gray-200 mb-8">Manage and track your assignments efficiently.</p>
                    <button 
                        onClick={() => handleNavigation('/signup')}
                        className="px-8 py-4 bg-yellow-400 text-black text-lg font-semibold rounded-md hover:bg-yellow-300 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-16 bg-gray-800">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                            onClick={() => feature.path && handleNavigation(feature.path)}
                            style={{ cursor: feature.path ? 'pointer' : 'default' }}
                        >
                            <img 
                                src={feature.image} 
                                alt={feature.title} 
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}