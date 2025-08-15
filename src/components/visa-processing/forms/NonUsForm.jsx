import React, { useState } from 'react';
import axios from '../../../api/axios';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import styled from 'styled-components';
import Button from '../ui/Button';

// Reuse styled components from DsRetrieveForm.js
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4B5563;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;
const NonUsForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userName: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/visa/non-us', formData);
      onSuccess(response.data.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        userName: '',
        password: ''
      });
    } catch (err) {
      onError(err.message || 'Failed to submit non-US form');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/visa/non-us');
      onSuccess('Entries fetched successfully', response.data.data);
    } catch (err) {
      onError(err.message || 'Failed to fetch entries');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Full Name</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Phone Number</Label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Username</Label>
        <Input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
        <Button type="button" onClick={fetchEntries} variant="secondary">
          View Entries
        </Button>
      </div>
    </form>
  );
};

export default NonUsForm;