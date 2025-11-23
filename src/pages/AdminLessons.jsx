import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LessonForm from '../components/admin/LessonForm';

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Lesson.list('-created_date');
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await base44.entities.Course.list();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  useEffect(() => {
    loadLessons();
    loadCourses();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingLesson) {
        await base44.entities.Lesson.update(editingLesson.id, formData);
      } else {
        await base44.entities.Lesson.create(formData);
      }
      await loadLessons();
      setShowForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        await base44.entities.Lesson.delete(id);
        await loadLessons();
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown';
  };

  const filteredLessons = selectedCourse === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.course === selectedCourse);

  return (
    <div className="p-6 lg:p-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lessons</h1>
          <p className="text-slate-600">Manage lessons for all courses</p>
        </div>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Lesson
        </Button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Course</label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-64 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="animate-pulse">Loading lessons...</div>
        </div>
      ) : filteredLessons.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Video</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons.map((lesson) => (
                <TableRow key={lesson.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{lesson.title}</div>
                        {lesson.description && (
                          <div className="text-sm text-slate-500 line-clamp-1">{lesson.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {getCourseTitle(lesson.course)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                      {lesson.order || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lesson.videoUrl ? (
                      <span className="text-green-600 text-sm">✓ Available</span>
                    ) : (
                      <span className="text-slate-400 text-sm">No video</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lesson.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {selectedCourse === 'all' ? 'No Lessons Yet' : 'No Lessons in This Course'}
          </h3>
          <p className="text-slate-600 mb-6">Create your first lesson to get started.</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Lesson
          </Button>
        </div>
      )}

      {showForm && (
        <LessonForm
          lesson={editingLesson}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}