import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const VolunteerManager = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteer, setVolunteer] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    skills: '',
    availability: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedVolunteer, setFetchedVolunteer] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const baseUrl = `${import.meta.env.VITE_API_URL}/volunteerapi`;

  useEffect(() => {
    if (activeSection === 'all') {
      fetchAllVolunteers();
    }
  }, [activeSection]);

  const fetchAllVolunteers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setVolunteers(res.data);
    } catch (err) {
      setMessage('Failed to fetch volunteers.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVolunteer(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (let key in volunteer) {
      if (!volunteer[key] || volunteer[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addVolunteer = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, { ...volunteer, id: parseInt(volunteer.id) });
      setMessage('Volunteer added successfully.');
      resetForm();
      setActiveSection('all');
    } catch {
      setMessage('Error adding volunteer.');
    }
  };

  const updateVolunteer = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, { ...volunteer, id: parseInt(volunteer.id) });
      setMessage('Volunteer updated successfully.');
      resetForm();
      setActiveSection('all');
    } catch {
      setMessage('Error updating volunteer.');
    }
  };

  const deleteVolunteer = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data || 'Volunteer deleted.');
      fetchAllVolunteers();
    } catch {
      setMessage('Error deleting volunteer.');
    }
  };

  const getVolunteerById = async () => {
    if (!idToFetch || idToFetch.toString().trim() === '') {
      setMessage('Please enter an ID to fetch.');
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedVolunteer(res.data);
      setMessage('');
    } catch {
      setFetchedVolunteer(null);
      setMessage('Volunteer not found.');
    }
  };

  const handleEdit = (vol) => {
    setVolunteer({ ...vol });
    setEditMode(true);
    setActiveSection('add');
    setMessage(`Editing volunteer with ID ${vol.id}`);
  };

  const resetForm = () => {
    setVolunteer({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: '',
      skills: '',
      availability: ''
    });
    setEditMode(false);
  };

  const VolunteerCard = ({ v }) => (
    <article className="card-mini">
      <div className="card-head">
        <div>
          <div className="card-title">{v.name}</div>
          <div className="card-sub">{v.role}</div>
        </div>
        <div className="card-id">#{v.id}</div>
      </div>
      <div className="card-body">
        <div><b>Email:</b> {v.email}</div>
        <div><b>Phone:</b> {v.phone}</div>
        <div><b>Skills:</b> {v.skills}</div>
        <div><b>Availability:</b> {v.availability}</div>
      </div>
      <div className="card-actions">
        <button className="btn small success" onClick={() => handleEdit(v)}>Edit</button>
        <button className="btn small danger" onClick={() => deleteVolunteer(v.id)}>Delete</button>
      </div>
    </article>
  );

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">V</div>
          <div className="brand-name">Volunteer Tracker</div>
        </div>

        <nav className="topnav">
          <button className={activeSection === 'dashboard' ? 'navlink active' : 'navlink'} onClick={() => setActiveSection('dashboard')}>Dashboard</button>
          <button className={activeSection === 'add' ? 'navlink active' : 'navlink'} onClick={() => { setActiveSection('add'); resetForm(); }}>Add</button>
          <button className={activeSection === 'fetch' ? 'navlink active' : 'navlink'} onClick={() => setActiveSection('fetch')}>Fetch</button>
          <button className={activeSection === 'all' ? 'navlink active' : 'navlink'} onClick={() => setActiveSection('all')}>All</button>
        </nav>
      </header>

      <main className="container">
        {activeSection === 'add' && message && (
          <div className={`toast ${message.toLowerCase().includes('error') ? 'err' : 'ok'}`}>
            {message}
            <button className="toast-close" onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {activeSection === 'dashboard' && (
          <section className="panel">
            <h2>Dashboard</h2>
            <p className="muted">Quick overview of your volunteers</p>
            <div className="stats">
              <div className="stat">
                <div className="stat-num">{volunteers.length}</div>
                <div className="stat-label">Total Volunteers</div>
              </div>
              <div className="stat">
                <div className="stat-num">
                  {volunteers.filter(v => v.availability && v.availability.toString().toLowerCase().includes('yes')).length}
                </div>
                <div className="stat-label">Available</div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'add' && (
          <section className="panel">
            <h2>{editMode ? 'Edit Volunteer' : 'Add Volunteer'}</h2>
            <div className="form-grid">
              <input type="number" name="id" placeholder="ID" value={volunteer.id} onChange={handleChange} />
              <input type="text" name="name" placeholder="Name" value={volunteer.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={volunteer.email} onChange={handleChange} />
              <input type="text" name="phone" placeholder="Phone" value={volunteer.phone} onChange={handleChange} />
              <input type="text" name="role" placeholder="Role" value={volunteer.role} onChange={handleChange} />
              <input type="text" name="skills" placeholder="Skills" value={volunteer.skills} onChange={handleChange} />
              <input
                type="text"
                name="availability"
                placeholder="Availability"
                value={volunteer.availability}
                onChange={handleChange}
              />
            </div>
            <div className="panel-actions">
              {!editMode ? (
                <button className="btn primary" onClick={addVolunteer}>Add Volunteer</button>
              ) : (
                <>
                  <button className="btn success" onClick={updateVolunteer}>Update</button>
                  <button className="btn secondary" onClick={resetForm}>Cancel</button>
                </>
              )}
            </div>
          </section>
        )}

        {activeSection === 'fetch' && (
          <section className="panel">
            <h2>Fetch Volunteer by ID</h2>
            <div className="fetch-row">
              <input
                type="number"
                placeholder="Volunteer ID"
                value={idToFetch}
                onChange={(e) => setIdToFetch(e.target.value)}
              />
              <button className="btn primary" onClick={getVolunteerById}>Fetch</button>
            </div>

            {fetchedVolunteer ? (
              <div className="details">
                <h3>{fetchedVolunteer.name} <span className="muted">({fetchedVolunteer.role})</span></h3>
                <div><b>Email:</b> {fetchedVolunteer.email}</div>
                <div><b>Phone:</b> {fetchedVolunteer.phone}</div>
                <div><b>Skills:</b> {fetchedVolunteer.skills}</div>
                <div><b>Availability:</b> {fetchedVolunteer.availability}</div>
              </div>
            ) : (
              <p className="muted">No volunteer loaded.</p>
            )}
          </section>
        )}

        {activeSection === 'all' && (
          <section className="panel">
            <h2>All Volunteers</h2>
            {volunteers.length === 0 ? (
              <p className="muted">No volunteers found. Add one from the Add section.</p>
            ) : (
              <div className="cards-grid">
                {volunteers.map(v => <VolunteerCard key={v.id} v={v} />)}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default VolunteerManager;