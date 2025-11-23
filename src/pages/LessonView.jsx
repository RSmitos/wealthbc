import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { 
  Home, BookOpen, ChevronRight, Download, FileText, 
  CheckCircle, Circle, ArrowLeft, ArrowRight, Lock,
  Calculator, MessageSquare, HelpCircle, ExternalLink,
  Play, Users
} from 'lucide-react';

export default function LessonView() {
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson') || urlParams.get('id');

        if (!lessonId) {
          setLoading(false);
          return;
        }

        const lessonData = await base44.entities.Lesson.filter({ id: lessonId });
        if (lessonData.length === 0) {
          setLoading(false);
          return;
        }

        const currentLesson = lessonData[0];
        setLesson(currentLesson);

        // Load course
        const courseData = await base44.entities.Course.filter({ id: currentLesson.course });
        if (courseData.length > 0) {
          setCourse(courseData[0]);
        }

        // Load sections for proper ordering
        const courseSections = await base44.entities.Section.filter({ course: currentLesson.course });
        setSections(courseSections);

        // Load all lessons in this course
        const courseLessons = await base44.entities.Lesson.filter({ course: currentLesson.course });
        
        // Sort lessons by section number, then lesson index
        const sortedLessons = courseLessons.sort((a, b) => {
          const sectionA = courseSections.find(s => s.id === a.section);
          const sectionB = courseSections.find(s => s.id === b.section);
          
          if (sectionA?.sectionNumber !== sectionB?.sectionNumber) {
            return (sectionA?.sectionNumber || 0) - (sectionB?.sectionNumber || 0);
          }
          return (a.lessonIndex || 0) - (b.lessonIndex || 0);
        });
        
        setAllLessons(sortedLessons);

        // Initialize checklist (V1: static)
        setChecklist([
          { id: 1, text: 'Review the lesson content', completed: false },
          { id: 2, text: 'Complete the action steps', completed: false },
          { id: 3, text: 'Download relevant resources', completed: false },
          { id: 4, text: 'Apply what you learned', completed: false }
        ]);
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, []);

  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lesson?.id);
  };

  const getPreviousLesson = () => {
    const index = getCurrentLessonIndex();
    return index > 0 ? allLessons[index - 1] : null;
  };

  const getNextLesson = () => {
    const index = getCurrentLessonIndex();
    return index < allLessons.length - 1 ? allLessons[index + 1] : null;
  };

  const sampleResources = [
    { name: 'Credit Report Analysis Template', type: 'PDF', icon: FileText },
    { name: 'Dispute Letter Template', type: 'DOC', icon: FileText },
    { name: 'Credit Utilization Tracker', type: 'XLS', icon: Calculator }
  ];

  const recommendedTools = [
    { name: 'Credit Report Analyzer', description: 'Analyze your full credit profile', icon: Calculator },
    { name: 'Hard Inquiry Tracker', description: 'Monitor credit inquiries', icon: FileText },
    { name: 'Credit Profile Snapshot', description: 'Get a complete overview', icon: BookOpen }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37] font-semibold">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lesson Not Found</h2>
          <Link to={createPageUrl('MyCourses')}>
            <button className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const previousLesson = getPreviousLesson();
  const nextLesson = getNextLesson();
  const currentIndex = getCurrentLessonIndex();
  
  // Use numerical order
  const currentLessonLabel = lesson.order || (currentIndex + 1);

  return (
    <div className="min-h-screen bg-black">
      {/* 1. Lesson Header */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-b border-[#D4AF37]/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to={createPageUrl('Dashboard')} className="hover:text-[#D4AF37]">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={createPageUrl('MyCourses')} className="hover:text-[#D4AF37]">Courses</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={createPageUrl('CourseView') + '?id=' + course?.id} className="hover:text-[#D4AF37]">{course?.title}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#D4AF37]">Lesson {currentLessonLabel}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#D4AF37] font-semibold mb-1">{course?.title}</div>
              <h1 className="text-2xl font-bold text-white">
                {currentLessonLabel} — {lesson.title}
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              Lesson {currentIndex + 1} of {allLessons.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Two-Column Layout */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* LEFT COLUMN - Main Content */}
          <div className="space-y-8">
            {/* 3. Lesson Title + Summary */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{lesson.title}</h2>
              <p className="text-xl text-[#E3E3E3]">
                {lesson.description || 'Master the fundamentals and take actionable steps toward your financial goals.'}
              </p>
            </div>

            {/* 5. Video Player (Placeholder) */}
            {lesson.videoUrl && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden">
                <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                  <Play className="w-20 h-20 text-[#D4AF37] opacity-80" />
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 rounded text-sm text-white">
                    Video Lesson
                  </div>
                </div>
              </div>
            )}

            {/* 4. Main Content Block */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Lesson Content</h3>
              {lesson.content ? (
                <div 
                  className="prose prose-invert prose-lg max-w-none
                    [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4
                    [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3
                    [&>h4]:text-xl [&>h4]:font-bold [&>h4]:text-white [&>h4]:mt-4 [&>h4]:mb-2
                    [&>p]:text-[#E3E3E3] [&>p]:leading-relaxed [&>p]:mb-4
                    [&>ul]:text-[#E3E3E3] [&>ul]:space-y-2 [&>ul]:my-4
                    [&>ol]:text-[#E3E3E3] [&>ol]:space-y-2 [&>ol]:my-4
                    [&>li]:text-[#E3E3E3]
                    [&>strong]:text-white [&>strong]:font-semibold
                    [&>code]:text-[#D4AF37] [&>code]:bg-black/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded
                    [&>pre]:bg-black/50 [&>pre]:border [&>pre]:border-[#D4AF37]/20 [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:overflow-x-auto
                    [&>blockquote]:border-l-4 [&>blockquote]:border-[#D4AF37] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              ) : (
                <div className="text-[#E3E3E3] text-center py-12">
                  <p>Content is being prepared for this lesson.</p>
                </div>
              )}
            </div>

            {/* 6. Downloadable Resources */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Lesson Resources</h3>
              <div className="space-y-3">
                {sampleResources.map((resource, idx) => {
                  const Icon = resource.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#D4AF37]/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{resource.name}</div>
                          <div className="text-sm text-gray-400">{resource.type}</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. Action Checklist */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Action Steps for This Lesson</h3>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left"
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#E3E3E3] flex-shrink-0" />
                    )}
                    <span className={`${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4">
              {previousLesson ? (
                <Link to={createPageUrl('LessonView') + '?lesson=' + previousLesson.id} className="flex-1">
                  <button className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-lg hover:border-[#D4AF37]/30 transition-all font-semibold flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Previous Lesson
                  </button>
                </Link>
              ) : (
                <div className="flex-1"></div>
              )}
              {nextLesson ? (
                <Link to={createPageUrl('LessonView') + '?lesson=' + nextLesson.id} className="flex-1">
                  <button className="w-full px-6 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold flex items-center justify-center gap-2">
                    Next Lesson
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              ) : (
                <Link to={createPageUrl('CourseView') + '?id=' + course?.id} className="flex-1">
                  <button className="w-full px-6 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold flex items-center justify-center gap-2">
                    Complete Course
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Navigation & Support */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* 9. Step Overview Panel */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">{course?.title}</h3>
              <div className="space-y-2">
                {allLessons.map((l, idx) => {
                  const lessonLabel = l.order || (idx + 1);
                  
                  return (
                    <Link 
                      key={l.id}
                      to={createPageUrl('LessonView') + '?lesson=' + l.id}
                      className={`block p-3 rounded-lg transition-all ${
                        l.id === lesson.id 
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37]' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {idx < currentIndex ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : idx === currentIndex ? (
                          <div className="w-5 h-5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        )}
                        <div className={`text-sm ${l.id === lesson.id ? 'text-[#D4AF37] font-semibold' : 'text-[#E3E3E3]'}`}>
                          {lessonLabel} — {l.title}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* 10. Full Course Map Link */}
              <Link to={createPageUrl('MyCourses')} className="block mt-4 pt-4 border-t border-white/10">
                <div className="text-[#D4AF37] hover:text-[#C4A137] transition-colors font-medium text-sm flex items-center gap-2">
                  View Full Course Map
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* 11. Tool Recommendations */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tools for This Lesson</h3>
              <div className="space-y-3">
                {recommendedTools.map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={idx} to={createPageUrl('Tools')}>
                      <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-[#D4AF37]/30">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm mb-1">{tool.name}</div>
                            <div className="text-xs text-gray-400">{tool.description}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 12. Support Panel */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-[#E3E3E3] hover:text-[#D4AF37]">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Ask in Facebook Group</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
                <Link to={createPageUrl('Contact')} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-[#E3E3E3] hover:text-[#D4AF37]">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Open Support Ticket</span>
                </Link>
                <a href="#" className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-[#E3E3E3] hover:text-[#D4AF37]">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">View Related FAQs</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}