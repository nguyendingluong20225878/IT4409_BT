import React, { useState, useEffect } from 'react';
import './StudentList.css';
import StudentForm from './StudentForm';
import { studentService } from '../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách học sinh. Vui lòng thử lại.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      try {
        await studentService.delete(id);
        fetchStudents();
      } catch (err) {
        alert('Không thể xóa học sinh. Vui lòng thử lại.');
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleFormSubmit = () => {
    fetchStudents();
    handleFormClose();
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Danh Sách Học Sinh</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Thêm Học Sinh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {students.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có học sinh nào. Hãy thêm học sinh mới!</p>
        </div>
      ) : (
        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ và Tên</th>
                <th>Ngày Sinh</th>
                <th>Giới Tính</th>
                <th>Lớp</th>
                <th>Địa Chỉ</th>
                <th>SĐT</th>
                <th>Email</th>
                <th>Điểm TB</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.fullName}</td>
                  <td>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  <td>{student.gender}</td>
                  <td>{student.class}</td>
                  <td>{student.address}</td>
                  <td>{student.phone}</td>
                  <td>{student.email}</td>
                  <td>{student.gpa.toFixed(2)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(student)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(student._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <StudentForm
          student={editingStudent}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default StudentList;

