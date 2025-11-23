import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { BookOpen, Clock, PlayCircle, Lock } from 'lucide-react';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAdmin(currentUser?.role === 'admin');
        
        const publishedCourses = await base44.entities.Course.filter({ status: 'published' });
        setCourses(publishedCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/5 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">My Courses</h1>
          <p className="text-xl text-gray-400">
            {courses.length > 0
              ? `You have access to ${courses.length} course${courses.length === 1 ? '' : 's'}.`
              : 'No courses available yet. Check back soon!'}
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isLocked = !isAdmin;
              
              return (
                <Link
                  key={course.id}
                  to={createPageUrl('CourseView') + '?id=' + course.id}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#D4AF37]/10 to-transparent flex items-center justify-center border-b border-[#D4AF37]/20 relative">
                    {isLocked ? (
                      <>
                        <Lock className="w-16 h-16 text-[#D4AF37] opacity-60" />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full text-xs font-semibold text-[#D4AF37]">
                            Preview
                          </span>
                        </div>
                      </>
                    ) : (
                      <PlayCircle className="w-16 h-16 text-[#D4AF37] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {course.description || 'Start learning with this comprehensive course.'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Self-paced</span>
                      </div>
                    </div>
                    {isLocked ? (
                      <div className="mt-4 pt-4 border-t border-[#D4AF37]/10">
                        <span className="text-sm text-[#D4AF37]">View Preview →</span>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-[#D4AF37]/10">
                        <span className="text-sm text-green-400 font-semibold">FREE — In Your Library</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No Courses Yet</h3>
            <p className="text-gray-400 mb-6">
              New courses are being added regularly. Check back soon to start your learning journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}