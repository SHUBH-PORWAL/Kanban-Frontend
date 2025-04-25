import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = ({ columnId, onTaskAdded, onCancel }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskData.title.trim()) {
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/task`,
                {
                    columnId,
                    title: taskData.title,
                    description: taskData.description
                },
                {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                }
            );

            if (onTaskAdded) {
                onTaskAdded(res.data);
            }

            // Reset form and close
            setTaskData({ title: '', description: '' });
            onCancel();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    name="title"
                    placeholder="Task title"
                    className="form-control"
                    value={taskData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <textarea
                    name="description"
                    placeholder="Description (optional)"
                    className="form-control"
                    value={taskData.description}
                    onChange={handleChange}
                    rows={3}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={onCancel} style={{ backgroundColor: '#ddd' }}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary">
                    Add Task
                </button>
            </div>
        </form>
    );
};

export default AddTaskForm;