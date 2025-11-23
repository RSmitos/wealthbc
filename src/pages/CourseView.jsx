import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { BookOpen, Clock, CheckCircle, PlayCircle, Lock, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CourseView() {
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSectionId, setOpenSectionId] = useState(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');

        if (!courseId) {
          setLoading(false);
          return;
        }

        // Check if user is admin
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAdmin(currentUser?.role === 'admin');

      const courseData = await base44.entities.Course.filter({ id: courseId });
        if (courseData.length > 0) {
          setCourse(courseData[0]);

          const courseSections = await base44.entities.Section.filter({ course: courseId });
          courseSections.sort((a, b) => a.sectionNumber - b.sectionNumber);
          setSections(courseSections);

          const courseLessons = await base44.entities.Lesson.filter({ course: courseId });
          setLessons(courseLessons);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourseData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/5 rounded w-1/2"></div>
            <div className="h-64 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Course Not Found</h3>
            <p className="text-gray-400">The course you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get letter from index (0->a, 1->b, etc.)
  const getLetter = (index) => String.fromCharCode(97 + index);

  // Group lessons by section
  const getLessonsForSection = (sectionId) => {
    return lessons
      .filter(lesson => lesson.section === sectionId)
      .sort((a, b) => a.lessonIndex - b.lessonIndex);
  };

  const toggleSection = (sectionId) => {
    setOpenSectionId(openSectionId === sectionId ? null : sectionId);
  };

  const totalLessons = lessons.length;
  const totalSections = sections.length;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
        {/* Course Header */}
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-8 lg:p-12 mb-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-sm font-medium mb-6 text-[#D4AF37]">
              {!isAdmin ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Admin Only</span>
                </>
              ) : (
                <span>Course</span>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{course.title}</h1>
            <p className="text-xl text-gray-400 mb-8">
              {course.description || 'Comprehensive course to advance your skills and knowledge.'}
            </p>
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <span>{totalSections} Modules • {totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Self-paced</span>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span>Certificate upon completion</span>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Course Content - Accordion Sections */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Course Curriculum</h2>

          {sections.length > 0 ? (
            <div className="space-y-4">
              {sections.map((section) => {
                const sectionLessons = getLessonsForSection(section.id);
                const isOpen = openSectionId === section.id;
                
                return (
                  <div 
                    key={section.id}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[#D4AF37] font-bold text-lg">{section.sectionNumber}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {sectionLessons.length} {sectionLessons.length === 1 ? 'Lesson' : 'Lessons'}
                          </p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-6 h-6 text-gray-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Section Lessons */}
                    {isOpen && (
                      <div className="border-t border-[#D4AF37]/10 bg-black/20">
                        <div className="p-4 space-y-2">
                          {sectionLessons.map((lesson, lessonIdx) => {
                            const lessonLabel = `${section.sectionNumber}${getLetter(lessonIdx)}`;
                            return isAdmin ? (
                              <Link
                                key={lesson.id}
                                to={createPageUrl('LessonView') + `?lesson=${lesson.id}`}
                              >
                                <div className="bg-gradient-to-br from-[#0a0a0a] to-black border border-[#D4AF37]/10 rounded-lg p-4 transition-all ml-4 hover:border-[#D4AF37]/30 group cursor-pointer">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors">
                                      <PlayCircle className="w-4 h-4 text-[#D4AF37]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                                        {lessonLabel}. {lesson.title}
                                      </h4>
                                      {lesson.description && (
                                        <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div
                                key={lesson.id}
                                className="bg-gradient-to-br from-[#0a0a0a] to-black border border-[#D4AF37]/10 rounded-lg p-4 transition-all ml-4 opacity-60 cursor-default"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-400">
                                      {lessonLabel}. {lesson.title}
                                    </h4>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Course content coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}