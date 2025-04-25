import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const Task = ({ task, index, onTaskDeleted }) => {
    const deleteTask = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/task/${task._id}`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });

            if (onTaskDeleted) {
                onTaskDeleted(task._id);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    className="task"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="task-title">{task.title}</div>
                    {task.description && (
                        <div className="task-description">{task.description}</div>
                    )}
                    <div className="task-actions">
                        <button
                            className="delete-task-btn"
                            onClick={deleteTask}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Task;