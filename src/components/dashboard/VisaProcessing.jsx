import React, { useState } from 'react';
import CountrySelection from '../visa-processing/CountrySelection';
import VisaOptions from '../visa-processing/VisaOptions';
import VisaFormModal from '../visa-processing/VisaFormModal';
import { FiGlobe } from 'react-icons/fi';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const countries = [
  { name: 'USA', code: 'us' },
  { name: 'Japan', code: 'jp' },
  { name: 'Indonesia', code: 'id' },
  { name: 'UK', code: 'gb' },
  { name: 'Australia', code: 'au' },
  { name: 'Canada', code: 'ca' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Thailand', code: 'th' },
];

const VisaProcessing = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [showEntries, setShowEntries] = useState(false);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedOption(null);
    setEntries([]);
    setShowEntries(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
  };

  const updateEntries = (newEntries) => {
    setEntries(newEntries);
    setShowEntries(true);
  };

  return (
    <Container>
      <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '2rem', color: '#1F2937' }}>
        <FiGlobe style={{ marginRight: '0.5rem' }} /> Visa Processing
      </h1>
      
      <CountrySelection 
        countries={countries} 
        selectedCountry={selectedCountry} 
        onSelect={handleCountrySelect} 
      />
      
      {selectedCountry && (
        <VisaOptions 
          country={selectedCountry} 
          onOptionSelect={handleOptionSelect} 
          entries={entries}
          showEntries={showEntries}
          onHideEntries={() => setShowEntries(false)}
        />
      )}
      
      <VisaFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        country={selectedCountry}
        option={selectedOption}
        onUpdateEntries={updateEntries}
      />
    </Container>
  );
};

export default VisaProcessing;