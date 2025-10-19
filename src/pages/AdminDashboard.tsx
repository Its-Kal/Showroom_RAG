import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Car } from '../types/Car';

// Inline SVG Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;

type AdminView = 'add' | 'manage' | 'slider' | 'settings';

const AdminDashboard: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<AdminView>('add');

    // Form state
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('new');
    const [acceleration, setAcceleration] = useState('');
    const [fuelConsumption, setFuelConsumption] = useState('');
    const [images, setImages] = useState('[]');
    const [specifications, setSpecifications] = useState('{}');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [brochureFile, setBrochureFile] = useState<File | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    const fetchCars = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/cars/');
            if (!response.ok) throw new Error('Failed to fetch cars');
            const data: Car[] = await response.json();
            setCars(data);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImageFile(e.target.files[0]);
    };

    const handleBrochureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setBrochureFile(e.target.files[0]);
    };

    const clearForm = () => {
        setName('');
        setYear('');
        setPrice('');
        setDescription('');
        setCategory('');
        setStatus('new');
        setAcceleration('');
        setFuelConsumption('');
        setImages('[]');
        setSpecifications('{}');
        setImageFile(null);
        setBrochureFile(null);
        setEditId(null);
        // Reset file inputs
        const imageInput = document.getElementById('image') as HTMLInputElement;
        if(imageInput) imageInput.value = '';
        const brochureInput = document.getElementById('brochure_image') as HTMLInputElement;
        if(brochureInput) brochureInput.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !brochureFile) {
            setMessage({ text: 'Please select both a main image and a brochure image.', type: 'error' });
            return;
        }

        setMessage({ text: '', type: '' });
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('year', year);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('status', status);
        formData.append('acceleration', acceleration);
        formData.append('fuelConsumption', fuelConsumption);
        formData.append('images', images);
        formData.append('specifications', specifications);
        formData.append('image', imageFile);
        formData.append('brochure_image', brochureFile);

        const url = editId ? `http://localhost:8000/cars/${editId}` : 'http://localhost:8000/cars/';
        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || (editId ? 'Failed to update car' : 'Failed to upload car'));
            
            setMessage({ text: editId ? 'Car updated successfully' : 'Car added successfully', type: 'success' });
            clearForm();
            await fetchCars();
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (car: Car) => {
        setEditId(car.id);
        setName(car.name);
        setPrice(String(car.price));
        setYear(String(car.year));
        setDescription(car.description);
        setCategory(car.category);
        setStatus(car.status);
        setAcceleration(car.acceleration);
        setFuelConsumption(car.fuelConsumption);
        setImages(JSON.stringify(car.images));
        setSpecifications(JSON.stringify(car.specifications));
        setMessage({ text: '', type: '' });
        setCurrentView('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/cars/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.detail || 'Failed to delete car');
                }
                setMessage({ text: 'Car deleted successfully', type: 'success' });
                await fetchCars();
            } catch (error: any) {
                setMessage({ text: error.message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleNavClick = (view: AdminView) => {
        setMessage({ text: '', type: '' });
        if (view === 'add' && editId) {
            clearForm();
        }
        setCurrentView(view);
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Showroom Admin</h3>
                    <p>Welcome, Admin</p>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><button onClick={() => handleNavClick('add')} className={`btn-add-new ${currentView === 'add' ? 'active' : ''}`}>Add New Car</button></li>
                        <li><button onClick={() => handleNavClick('manage')} className={currentView === 'manage' ? 'active' : ''}>Manage Cars</button></li>
                        <li><button onClick={() => handleNavClick('slider')} className={currentView === 'slider' ? 'active' : ''}>Manage Hero Slider</button></li>
                        <li><button onClick={() => handleNavClick('settings')} className={currentView === 'settings' ? 'active' : ''}>Settings</button></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <ul>
                        <li><button onClick={() => alert('Logout clicked!')}><LogoutIcon /> Logout</button></li>
                    </ul>
                </div>
            </aside>

            <main className="admin-content">
                {currentView === 'add' && (
                    <div className="content-view">
                        <h2>{editId ? 'Edit Car Details' : 'Add New Car'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                            <div className="form-group">
                                <label htmlFor="name">Car Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="year">Year</label>
                                <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Car Price</label>
                                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g., 1500000000" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Car Description</label>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="acceleration">Acceleration</label>
                                <input type="text" id="acceleration" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fuelConsumption">Fuel Consumption</label>
                                <input type="text" id="fuelConsumption" value={fuelConsumption} onChange={(e) => setFuelConsumption(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="images">Images (JSON array of strings)</label>
                                <textarea id="images" value={images} onChange={(e) => setImages(e.target.value)} required rows={2} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="specifications">Specifications (JSON object)</label>
                                <textarea id="specifications" value={specifications} onChange={(e) => setSpecifications(e.target.value)} required rows={4} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Main Car Image</label>
                                <input type="file" id="image" accept="image/*" onChange={handleImageFileChange} required={!editId} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="brochure_image">Brochure Image</label>
                                <input type="file" id="brochure_image" accept="image/*" onChange={handleBrochureFileChange} required={!editId} />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-submit-car">{editId ? 'Update Car' : 'Submit Car'}</button>
                                {editId && <button type="button" className="btn btn-secondary" onClick={clearForm}>Cancel Edit</button>}
                            </div>
                        </form>
                    </div>
                )}

                {currentView === 'manage' && (
                    <div className="content-view">
                        <h2>Manage Cars</h2>
                        {isLoading ? <p>Loading cars...</p> : (
                            <table className="car-management-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Year</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cars.map(car => (
                                        <tr key={car.id}>
                                            <td>{car.name}</td>
                                            <td>{car.year}</td>
                                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(car.price)}</td>
                                            <td className="car-actions">
                                                <button className="btn-edit" onClick={() => handleEdit(car)}>Edit</button>
                                                <button className="btn-delete" onClick={() => handleDelete(car.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {currentView === 'slider' && (
                    <div className="content-view">
                        <h2>Update Hero Section Images</h2>
                        <div className="admin-form">
                            <div className="form-group">
                                <label htmlFor="hero_image_upload">Upload New Hero Image</label>
                                <input type="file" id="hero_image_upload" accept="image/*" multiple />
                            </div>
                            <button className="btn-submit-car">Upload Images</button>
                        </div>
                        <div className="hero-upload-note">
                            <p><strong>Important:</strong> Images uploaded here will automatically be added to the automatic hero slider on the public homepage. No navigation clicks are required for the slider to work.</p>
                        </div>
                    </div>
                )}

                {currentView === 'settings' && <div className="content-view"><h2>Settings</h2><p>Settings page is under construction.</p></div>}
            </main>
        </div>
    );
};

export default AdminDashboard;