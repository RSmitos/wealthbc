import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Users, BookOpen, Package, ShoppingCart, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, courses, products, orders] = await Promise.all([
          base44.entities.User.list(),
          base44.entities.Course.list(),
          base44.entities.Product.list(),
          base44.entities.Order.list()
        ]);

        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          totalProducts: products.length,
          totalOrders: orders.length
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'indigo',
      link: 'AdminUsers'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'purple',
      link: 'AdminCourses'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'green',
      link: 'AdminProducts'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'orange',
      link: 'AdminOrders'
    }
  ];

  const quickLinks = [
    { name: 'Manage Courses', icon: BookOpen, path: 'AdminCourses', description: 'Create and edit courses' },
    { name: 'Manage Lessons', icon: Activity, path: 'AdminLessons', description: 'Add lessons to courses' },
    { name: 'Manage Products', icon: Package, path: 'AdminProducts', description: 'Configure products and pricing' },
    { name: 'View Orders', icon: ShoppingCart, path: 'AdminOrders', description: 'Track all orders' },
    { name: 'Manage Users', icon: Users, path: 'AdminUsers', description: 'User roles and permissions' },
    { name: 'View Activity', icon: TrendingUp, path: 'AdminDashboard', description: 'Platform analytics' }
  ];

  return (
    <div className="p-6 lg:p-12">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Admin Dashboard</h1>
        <p className="text-xl text-slate-600">Welcome to the WealthBC administration panel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            indigo: 'bg-indigo-100 text-indigo-600',
            purple: 'bg-purple-100 text-purple-600',
            green: 'bg-green-100 text-green-600',
            orange: 'bg-orange-100 text-orange-600'
          };

          return (
            <Link
              key={stat.title}
              to={createPageUrl(stat.link)}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${colorClasses[stat.color]}`}>
                  {loading ? '...' : stat.value}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {loading ? '...' : stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.title}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all group"
              >
                <Icon className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {link.name}
                </h3>
                <p className="text-slate-600 text-sm">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}