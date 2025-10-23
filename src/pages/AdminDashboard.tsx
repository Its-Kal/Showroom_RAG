import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Car } from '../types/Car';
import { useLoading } from '../contexts/LoadingContext';
import { useNavigate } from 'react-router-dom';

// Inline SVG Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.5 1.5m-1.5 1.5l-1.5-1.5M3 3.75c0-.621.504-1.125 1.125-1.125h16.5c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504-1.125-1.125-1.125H4.125A1.125 1.125 0 013 19.125V3.75z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

type AdminView = 'add' | 'manage' | 'slider' | 'settings';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [cars, setCars] = useState<Car[]>([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { isLoading, showLoading, hideLoading } = useLoading();
    const [currentView, setCurrentView] = useState<AdminView>('add');
    const navigate = useNavigate();

    // State untuk validasi error form
    const [formErrors, setFormErrors] = useState({
        carName: '',
        carYear: '',
        carPrice: '',
        carDesc: '',
    });

    // Form state
    const [carName, setCarName] = useState('');
    const [carYear, setCarYear] = useState('');
    const [carPrice, setCarPrice] = useState('');
    const [carDesc, setDescription] = useState('');
    const [category, setCategory] = useState('SUV');
    const [status, setStatus] = useState('new'); // 'new' or 'used'
    const [acceleration, setAcceleration] = useState(''); // e.g., "0-100 km/h in 4.5s"
    const [fuelConsumption, setFuelConsumption] = useState(''); // e.g., "10 km/l"
    const [imageFile, setImageFile] = useState<File | null>(null); // For main image upload
    const [editId, setEditId] = useState<number | null>(null);
    const [heroImages, setHeroImages] = useState<File[]>([]);

    const fetchCars = async () => {
        showLoading();
        try {
            const response = await fetch('http://localhost:8000/cars');
            if (!response.ok) throw new Error('Failed to fetch cars');
            const data: Car[] = await response.json();
            setCars(data);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImageFile(e.target.files[0]);
    };

    const handleHeroImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setHeroImages(Array.from(e.target.files));
    };

    const clearForm = () => {
        setCarName('');
        setCarYear('');
        setCarPrice('');
        setDescription('');
        setCategory('SUV');
        setStatus('new');
        setAcceleration('');
        setFuelConsumption('');
        setImageFile(null);
        setEditId(null);

        const fileInput = document.getElementById('imageFile') as HTMLInputElement;
        // Reset juga semua pesan error
        setFormErrors({
            carName: '', carYear: '', carPrice: '', carDesc: ''
        });
        // Hapus pesan sukses/gagal global
        setMessage({ text: '', type: '' });
        if(fileInput) fileInput.value = '';
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            onLogout();
            navigate('/login');
        }
    };

    const validateForm = () => {
        const errors = { carName: '', carYear: '', carPrice: '', carDesc: '' };
        let isValid = true;
    
        if (!carName.trim()) {
            errors.carName = 'Nama mobil tidak boleh kosong.';
            isValid = false;
        }
        if (!carYear) {
            errors.carYear = 'Tahun mobil tidak boleh kosong.';
            isValid = false;
        } else if (isNaN(Number(carYear)) || Number(carYear) < 1900 || Number(carYear) > new Date().getFullYear() + 1) {
            errors.carYear = 'Tahun mobil tidak valid.';
            isValid = false;
        }
        if (!carPrice) {
            errors.carPrice = 'Harga mobil tidak boleh kosong.';
            isValid = false;
        }
        if (!carDesc.trim()) { // Assuming description is carDesc
            errors.carDesc = 'Deskripsi mobil tidak boleh kosong.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return; // Hentikan submit jika validasi gagal

        showLoading();

        const formData = new FormData();
        formData.append('name', carName);
        formData.append('year', carYear);
        formData.append('price', carPrice);
        formData.append('description', carDesc);
        formData.append('category', category);
        formData.append('status', status);
        formData.append('acceleration', acceleration);
        formData.append('fuelConsumption', fuelConsumption);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const url = editId ? `http://localhost:8000/cars/${editId}` : 'http://localhost:8000/cars';
        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || (editId ? 'Failed to update car' : 'Failed to add car'));
            
            setMessage({ text: result.message, type: 'success' });
            clearForm();
            await fetchCars();
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            hideLoading();
        }
    };

    const handleEdit = (car: Car) => {
        setEditId(car.id);
        setCarName(car.name);
        setCarPrice(String(car.price));
        setCarYear(String(car.year));
        setDescription(car.description);
        setCategory(car.category);
        setStatus(car.status);
        setAcceleration(car.acceleration);
        setFuelConsumption(car.fuelConsumption);
        setMessage({ text: '', type: '' });
        setCurrentView('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            showLoading();
            try {
                const response = await fetch(`http://localhost:8000/cars/${id}`, { method: 'DELETE' });
                const result = await response.json();
                if (!response.ok) throw new Error(result.detail || 'Failed to delete car');
                
                setMessage({ text: result.message, type: 'success' });
                await fetchCars();
            } catch (error: any) {
                setMessage({ text: error.message, type: 'error' });
            } finally {
                hideLoading();
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
                        <li><button onClick={() => handleNavClick('add')} className={currentView === 'add' ? 'active' : ''}>Add New Car</button></li>
                        <li><button onClick={() => handleNavClick('manage')} className={currentView === 'manage' ? 'active' : ''}>Manage Cars</button></li>
                        <li><button onClick={() => handleNavClick('slider')} className={currentView === 'slider' ? 'active' : ''}>Manage Hero Slider</button></li>
                        <li><button onClick={() => handleNavClick('settings')} className={currentView === 'settings' ? 'active' : ''}>Settings</button></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <ul>
                        <li><button onClick={handleLogout}><LogoutIcon /> Logout</button></li>
                    </ul>
                </div>
            </aside>

            <main className="admin-content">
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                {currentView === 'add' && (
                    <div className="content-view">
                        <h2>{editId ? 'Edit Car Details' : 'Add New Car'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="car_name">Car Name</label>
                                    <input type="text" id="car_name" value={carName} onChange={(e) => { setCarName(e.target.value); setFormErrors({...formErrors, carName: ''}); }} />
                                    {formErrors.carName && <span className="form-error-feedback">{formErrors.carName}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="car_year">Year</label>
                                    <input type="number" id="car_year" value={carYear} onChange={(e) => { setCarYear(e.target.value); setFormErrors({...formErrors, carYear: ''}); }} />
                                    {formErrors.carYear && <span className="form-error-feedback">{formErrors.carYear}</span>}
                                </div>
                            </div>
                             <div className="form-group">
                                <label htmlFor="car_price">Car Price</label>
                                <input type="text" id="car_price" value={carPrice} onChange={(e) => { setCarPrice(e.target.value); setFormErrors({...formErrors, carPrice: ''}); }} placeholder="e.g., 1500000000" />
                                {formErrors.carPrice && <span className="form-error-feedback">{formErrors.carPrice}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="car_desc">Car Description</label>
                                <textarea id="car_desc" value={carDesc} onChange={(e) => { setDescription(e.target.value); setFormErrors({...formErrors, carDesc: ''}); }} rows={4} />
                                {formErrors.carDesc && <span className="form-error-feedback">{formErrors.carDesc}</span>}
                            </div>
                             <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="SUV">SUV</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Sport">Sport</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                             <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Main Car Image</label>
                                <input type="file" id="imageFile" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-submit-car">{editId ? 'Update Car' : 'Submit Car'}</button>
                                {editId && <button type="button" className="btn-cancel-edit" onClick={clearForm}>Cancel Edit</button>}
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
                                            <td data-label="Name">{car.name}</td>
                                            <td data-label="Year">{car.year}</td>
                                            <td data-label="Price">{car.price}</td>
                                            <td className="car-actions">
                                                <button className="btn-edit" onClick={() => handleEdit(car)}><EditIcon /> <span>Edit</span></button>
                                                <button className="btn-delete" onClick={() => handleDelete(car.id)}><DeleteIcon /> <span>Delete</span></button>
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
                            <div className="form-group file-upload-group">
                                <label>Upload New Hero Images (select multiple)</label>
                                <div className="file-upload-wrapper">
                                    <input type="file" id="hero_image_upload" accept="image/*" multiple onChange={handleHeroImagesChange} className="file-input-hidden" />
                                    <label htmlFor="hero_image_upload" className="custom-file-upload">
                                        {heroImages.length > 0 ? (
                                            <>
                                                <span className="file-name-text">{`${heroImages.length} image(s) selected`}</span>
                                                <button type="button" className="btn-remove-file" onClick={() => setHeroImages([])}><CloseIcon /></button>
                                            </>
                                        ) : (
                                            <><ImageIcon /> <span>Choose Images</span></>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <button className="btn-submit-car">Upload Images</button>
                        </div>
                        <div className="hero-upload-note">
                            <p><strong>Important:</strong> Images uploaded here will automatically be added to the automatic hero slider on the public homepage. No navigation clicks are required for the slider to work.</p>
                        </div>
                    </div>
                )}

                {currentView === 'settings' && (
                    <div className="content-view">
                        <h2>Settings</h2>
                        <p>Here you can manage various settings for your showroom website.</p>
                        <div className="admin-form">
                            <div className="form-group">
                                <label htmlFor="site_name">Showroom Name</label>
                                <input type="text" id="site_name" value="Garasix Showroom" readOnly />
                            </div>
                            <button className="btn-submit-car">Save Settings</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;