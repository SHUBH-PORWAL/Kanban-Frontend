import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import AddTaskForm from './AddTaskForm';

const Column = ({ column, tasks, onTaskAdded, onTaskDeleted }) => {
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handleTaskAdded = (task) => {
        onTaskAdded(column._id, task);
    };

    return (
        <div className="column">
            <div className="column-header">{column.title}</div>
            <Droppable droppableId={column._id}>
                {(provided) => (
                    <div
                        className="column-tasks"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => (
                            <Task
                                key={task._id}
                                task={task}
                                index={index}
                                onTaskDeleted={onTaskDeleted}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <div className="column-add-task">
                {isAddingTask ? (
                    <AddTaskForm
                        columnId={column._id}
                        onTaskAdded={handleTaskAdded}
                        onCancel={() => setIsAddingTask(false)}
                    />
                ) : (
                    <button
                        className="add-task-btn"
                        style={{ width: '100%' }}
                        onClick={() => setIsAddingTask(true)}
                    >
                        + Add Task
                    </button>
                )}
            </div>
        </div>
    );
};

export default Column;