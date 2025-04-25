import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import Column from './Column';
import AddColumnForm from './AddColumnForm';

const Board = () => {
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const fetchBoard = async () => {
        try {
            setLoading(true);
            const userData = JSON.parse(localStorage.getItem('userData'));

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/board`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });

            setBoard(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching board:', err);
            setError('Failed to load board data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoard();
    }, []);

    const handleTaskAdded = (columnId, task) => {
        setBoard(prevBoard => {
            const updatedColumns = prevBoard.columns.map(col => {
                if (col._id === columnId) {
                    return {
                        ...col,
                        tasks: [...col.tasks, task]
                    };
                }
                return col;
            });

            return {
                ...prevBoard,
                columns: updatedColumns
            };
        });
    };

    const handleTaskDeleted = (taskId) => {
        setBoard(prevBoard => {
            const updatedColumns = prevBoard.columns.map(col => {
                return {
                    ...col,
                    tasks: col.tasks.filter(task => task._id !== taskId)
                };
            });

            return {
                ...prevBoard,
                columns: updatedColumns
            };
        });
    };

    const handleColumnAdded = (column) => {
        setBoard(prevBoard => {
            return {
                ...prevBoard,
                columns: [...prevBoard.columns, { ...column, tasks: [] }]
            };
        });
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        let draggedTask = null;
        let sourceColumn = null;

        board.columns.forEach(column => {
            column.tasks.forEach(task => {
                if (task._id === draggableId) {
                    draggedTask = task;
                    sourceColumn = column;
                }
            });
        });

        if (!draggedTask) return;

        const newBoard = {
            ...board,
            columns: board.columns.map(column => {
                if (column._id === source.droppableId) {
                    const newTasks = [...column.tasks];
                    newTasks.splice(source.index, 1);
                    return { ...column, tasks: newTasks };
                }

                if (column._id === destination.droppableId) {
                    const newTasks = [...column.tasks];

                    if (source.droppableId === destination.droppableId) {
                        newTasks.splice(destination.index, 0, draggedTask);
                    } else {
                        newTasks.splice(destination.index, 0, { ...draggedTask, column: destination.droppableId });
                    }

                    return { ...column, tasks: newTasks };
                }

                return column;
            })
        };

        setBoard(newBoard);

        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/task/${draggableId}`,
                {
                    columnId: destination.droppableId,
                    order: destination.index
                },
                {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                }
            );
        } catch (error) {
            console.error('Error updating task position:', error);
            fetchBoard();
        }
    };

    if (loading) {
        return <div className="container">Loading board...</div>;
    }

    if (error) {
        return <div className="container" style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="container">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="board-container">
                    {board?.columns?.map(column => (
                        <Column
                            key={column._id}
                            column={column}
                            tasks={column.tasks}
                            onTaskAdded={handleTaskAdded}
                            onTaskDeleted={handleTaskDeleted}
                        />
                    ))}

                    {isAddingColumn ? (
                        <AddColumnForm
                            onColumnAdded={handleColumnAdded}
                            onCancel={() => setIsAddingColumn(false)}
                        />
                    ) : (
                        <div style={{ minWidth: '280px', padding: '10px' }}>
                            <button
                                className="add-column-btn"
                                style={{ width: '100%' }}
                                onClick={() => setIsAddingColumn(true)}
                            >
                                + Add Column
                            </button>
                        </div>
                    )}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;