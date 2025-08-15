import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCreditCard, FiGlobe } from 'react-icons/fi';
import styled from 'styled-components';
import EntriesTable from './EntriesTable';

const OptionCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    background: #F8FAFC;
  }
`;

const VisaOptions = ({ country, onOptionSelect, entries, showEntries, onHideEntries }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem', color: '#4B5563' }}>
        {country.name} Visa Options
      </h2>
      
      {country.code === 'us' ? (
        <>
          <OptionCard
            onClick={() => onOptionSelect('ds-retrieve')}
            whileHover={{ x: 5 }}
          >
            <FiUser size={24} />
            <div>
              <div style={{ fontWeight: '500' }}>Retrieve a DS-160 Application</div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Recover your existing DS-160 application</div>
            </div>
          </OptionCard>
          
          <OptionCard
            onClick={() => onOptionSelect('us-payment')}
            whileHover={{ x: 5 }}
          >
            <FiCreditCard size={24} />
            <div>
              <div style={{ fontWeight: '500' }}>Application for a US Visa - Payment & Date</div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Schedule your visa appointment</div>
            </div>
          </OptionCard>
        </>
      ) : (
        <OptionCard
          onClick={() => onOptionSelect('non-us')}
          whileHover={{ x: 5 }}
        >
          <FiGlobe size={24} />
          <div>
            <div style={{ fontWeight: '500' }}>{country.name} Visa Application</div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Apply for a {country.name} visa</div>
          </div>
        </OptionCard>
      )}
      
      {showEntries && entries.length > 0 && (
        <EntriesTable 
          entries={entries} 
          onHideEntries={onHideEntries} 
        />
      )}
    </div>
  );
};

export default VisaOptions;