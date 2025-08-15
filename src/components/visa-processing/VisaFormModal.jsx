import React, { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiCheck, FiUser, FiCreditCard, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import DsRetrieveForm from './forms/DsRetrieveForm';
import UsPaymentForm from './forms/UsPaymentForm';
import NonUsForm from './forms/NonUsForm';

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled(motion.div)`
  background: #D1FAE5;
  color: #065F46;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled(motion.div)`
  background: #FEE2E2;
  color: #B91C1C;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VisaFormModal = ({ isOpen, onClose, country, option, onUpdateEntries }) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const getModalTitle = () => {
    if (!country || !option) return 'Visa Processing';
    
    if (country.code === 'us') {
      if (option === 'ds-retrieve') {
        return (
          <>
            <FiUser /> Retrieve a DS-160 Application
          </>
        );
      } else {
        return (
          <>
            <FiCreditCard /> US Visa Payment & Date
          </>
        );
      }
    } else {
      return (
        <>
          <FiGlobe /> {country.name} Visa Application
        </>
      );
    }
  };

  const handleSuccess = (message, entries) => {
    setSuccess(message);
    setError(null);
    if (entries) {
      onUpdateEntries(entries);
    }
  };

  const handleError = (message) => {
    setError(message);
    setSuccess(null);
  };

  const renderForm = () => {
    if (!country || !option) return null;

    if (country.code === 'us') {
      if (option === 'ds-retrieve') {
        return (
          <DsRetrieveForm 
            onSuccess={handleSuccess}
            onError={handleError}
            onClose={onClose}
          />
        );
      } else {
        return (
          <UsPaymentForm 
            onSuccess={handleSuccess}
            onError={handleError}
          />
        );
      }
    } else {
      return (
        <NonUsForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Visa Application Form"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          maxWidth: '600px',
          width: '90%',
          border: 'none',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <ModalHeader>
        <ModalTitle>
          {getModalTitle()}
        </ModalTitle>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: '#6B7280'
          }}
        >
          <FiX />
        </button>
      </ModalHeader>
      
      {success && (
        <SuccessMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiCheck /> {success}
        </SuccessMessage>
      )}
      
      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiX /> {error}
        </ErrorMessage>
      )}
      
      {renderForm()}
    </Modal>
  );
};

export default VisaFormModal;