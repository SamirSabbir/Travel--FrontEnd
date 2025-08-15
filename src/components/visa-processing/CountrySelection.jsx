import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CountryCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? '#3B82F6' : 'transparent'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CountrySelection = ({ countries, selectedCountry, onSelect }) => {
  return (
    <>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem', color: '#4B5563' }}>
        Select a Country
      </h2>
      
      <CountryGrid>
        {countries.map((country) => (
          <CountryCard
            key={country.code}
            onClick={() => onSelect(country)}
            selected={selectedCountry?.code === country.code}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {country.code === 'us' && '🇺🇸'}
              {country.code === 'jp' && '🇯🇵'}
              {country.code === 'id' && '🇮🇩'}
              {country.code === 'gb' && '🇬🇧'}
              {country.code === 'au' && '🇦🇺'}
              {country.code === 'ca' && '🇨🇦'}
              {country.code === 'my' && '🇲🇾'}
              {country.code === 'th' && '🇹🇭'}
            </div>
            <div style={{ fontWeight: '500' }}>{country.name}</div>
          </CountryCard>
        ))}
      </CountryGrid>
    </>
  );
};

export default CountrySelection;