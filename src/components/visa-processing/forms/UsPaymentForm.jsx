import React, { useState } from 'react';
import axios from '../../../api/axios';
import { FiLock } from 'react-icons/fi';
import styled from 'styled-components';
import Button from '../ui/Button';
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


// Reuse styled components from DsRetrieveForm.js

const UsPaymentForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    securityQuestion1: '',
    securityQuestion2: '',
    securityQuestion3: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/visa/us-payment', formData);
      onSuccess(response.data.message);
      setFormData({
        userName: '',
        password: '',
        securityQuestion1: '',
        securityQuestion2: '',
        securityQuestion3: ''
      });
    } catch (err) {
      onError(err.message || 'Failed to submit US payment form');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/visa/us-payment');
      onSuccess('Entries fetched successfully', response.data.data);
    } catch (err) {
      onError(err.message || 'Failed to fetch entries');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      
      <FormGroup>
        <Label>Security Question 1</Label>
        <Input
          type="text"
          name="securityQuestion1"
          value={formData.securityQuestion1}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Security Question 2</Label>
        <Input
          type="text"
          name="securityQuestion2"
          value={formData.securityQuestion2}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Security Question 3</Label>
        <Input
          type="text"
          name="securityQuestion3"
          value={formData.securityQuestion3}
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

export default UsPaymentForm;