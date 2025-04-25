import React, { useState } from 'react';
import axios from 'axios';

const AddColumnForm = ({ onColumnAdded, onCancel }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/column`,
                { title },
                {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                }
            );

            if (onColumnAdded) {
                onColumnAdded(res.data);
            }

            setTitle('');
            onCancel();
        } catch (error) {
            console.error('Error adding column:', error);
        }
    };

    return (
        <div className="column">
            <form className="add-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Column title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" onClick={onCancel} style={{ backgroundColor: '#ddd' }}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                        Add Column
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddColumnForm;