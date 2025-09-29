import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Car } from '../types/Car';

// Inline SVG Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

const AdminDashboard: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Form state
    const [carName, setCarName] = useState('');
    const [carPrice, setCarPrice] = useState('');
    const [carDesc, setCarDesc] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/cars');
            if (!response.ok) throw new Error('Failed to fetch cars');
            const data: Car[] = await response.json();
            setCars(data);
        } catch (err) {
            setMessage({ text: 'Could not load car data.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setPdfFile(e.target.files[0]);
    };

    const clearForm = () => {
        setCarName('');
        setCarPrice('');
        setCarDesc('');
        setPdfFile(null);
        setEditId(null);
        const fileInput = document.getElementById('pdf_file') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        const formData = new FormData();
        formData.append('car_name', carName);
        formData.append('car_price', carPrice);
        formData.append('car_desc', carDesc);
        if (pdfFile) {
            formData.append('pdf_file', pdfFile);
        }

        const url = editId ? `http://localhost:8000/cars/${editId}` : 'http://localhost:8000/upload_car';
        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || (editId ? 'Failed to update car' : 'Failed to upload car'));
            
            setMessage({ text: result.message, type: 'success' });
            clearForm();
            fetchCars();
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const handleEdit = (car: Car) => {
        setEditId(car.id);
        setCarName(car.name);
        setCarPrice(car.price);
        setCarDesc(car.description);
        setMessage({ text: '', type: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                const response = await fetch(`http://localhost:8000/cars/${id}`, { method: 'DELETE' });
                const result = await response.json();
                if (!response.ok) throw new Error(result.detail || 'Failed to delete car');
                
                setMessage({ text: result.message, type: 'success' });
                fetchCars();
            } catch (error: any) {
                setMessage({ text: error.message, type: 'error' });
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="dashboard-content">
                <div className="form-container">
                    <h3>{editId ? 'Edit Car' : 'Add New Car'}</h3>
                    {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="form-group">
                            <label htmlFor="car_name">Car Name</label>
                            <input type="text" id="car_name" value={carName} onChange={(e) => setCarName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="car_price">Car Price</label>
                            <input type="text" id="car_price" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="car_desc">Car Description</label>
                            <textarea id="car_desc" value={carDesc} onChange={(e) => setCarDesc(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pdf_file">PDF Brochure (optional for updates)</label>
                            <input type="file" id="pdf_file" accept="application/pdf" onChange={handleFileChange} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">{editId ? 'Update Car' : 'Add Car'}</button>
                            {editId && <button type="button" className="btn btn-secondary" onClick={clearForm}>Cancel</button>}
                        </div>
                    </form>
                </div>

                <div className="car-list-container">
                    <h3>Manage Cars</h3>
                    {loading && <p>Loading cars...</p>}
                    {!loading && (
                        <div className="car-grid-admin">
                            {cars.map(car => (
                                <div key={car.id} className="car-card-admin">
                                    <img src={car.image} alt={car.name} />
                                    <div className="car-card-admin-content">
                                        <h4>{car.name}</h4>
                                        <p>{car.price}</p>
                                    </div>
                                    <div className="car-actions">
                                        <button className="btn-icon" onClick={() => handleEdit(car)} aria-label={`Edit ${car.name}`}><EditIcon /></button>
                                        <button className="btn-icon" onClick={() => handleDelete(car.id)} aria-label={`Delete ${car.name}`}><DeleteIcon /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
