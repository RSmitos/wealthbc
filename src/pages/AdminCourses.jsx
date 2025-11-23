import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CourseForm from '../components/admin/CourseForm';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Course.list('-created_date');
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingCourse) {
        await base44.entities.Course.update(editingCourse.id, formData);
      } else {
        await base44.entities.Course.create(formData);
      }
      await loadCourses();
      setShowForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await base44.entities.Course.delete(id);
        await loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  return (
    <div className="p-6 lg:p-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Courses</h1>
          <p className="text-slate-600">Manage all courses and their content</p>
        </div>
        <Button
          onClick={() => {
            setEditingCourse(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="animate-pulse">Loading courses...</div>
        </div>
      ) : courses.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{course.title}</div>
                        {course.description && (
                          <div className="text-sm text-slate-500 line-clamp-1">{course.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {course.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        course.status === 'published'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(course.created_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
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
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Yet</h3>
          <p className="text-slate-600 mb-6">Create your first course to get started.</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </Button>
        </div>
      )}

      {showForm && (
        <CourseForm
          course={editingCourse}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
}