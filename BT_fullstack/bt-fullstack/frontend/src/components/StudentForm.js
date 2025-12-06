import React, { useState, useEffect } from 'react';
import './StudentForm.css';
import { studentService } from '../services/api';

const StudentForm = ({ student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    class: '',
    address: '',
    phone: '',
    email: '',
    gpa: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      const dateStr = new Date(student.dateOfBirth).toISOString().split('T')[0];
      setFormData({
        ...student,
        dateOfBirth: dateStr
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Mã học sinh là bắt buộc';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Lớp là bắt buộc';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.gpa < 0 || formData.gpa > 10) {
      newErrors.gpa = 'Điểm trung bình phải từ 0 đến 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      if (student) {
        await studentService.update(student._id, formData);
      } else {
        await studentService.create(formData);
      }
      onSubmit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      alert(errorMessage);
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{student ? 'Sửa Thông Tin Học Sinh' : 'Thêm Học Sinh Mới'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">Mã Học Sinh *</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                disabled={!!student}
                className={errors.studentId ? 'error' : ''}
              />
              {errors.studentId && <span className="error-text">{errors.studentId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Họ và Tên *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Ngày Sinh *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Giới Tính *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class">Lớp *</label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className={errors.class ? 'error' : ''}
              />
              {errors.class && <span className="error-text">{errors.class}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gpa">Điểm Trung Bình</label>
              <input
                type="number"
                id="gpa"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                className={errors.gpa ? 'error' : ''}
              />
              {errors.gpa && <span className="error-text">{errors.gpa}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa Chỉ *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Số Điện Thoại *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Đang lưu...' : (student ? 'Cập Nhật' : 'Thêm Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;

