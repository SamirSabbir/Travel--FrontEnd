import React from 'react';
import Button from './ui/Button';
import styled from 'styled-components';

const EntriesTable = ({ entries, onHideEntries }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem', color: '#4B5563' }}>
        Previous Entries
      </h2>
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F3F4F6' }}>
              {Object.keys(entries[0]).filter(key => !['_id', '__v', 'employeeEmail'].includes(key)).map((key) => (
                <th key={key} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#4B5563' }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry._id} style={{ borderBottom: index !== entries.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                {Object.keys(entry).filter(key => !['_id', '__v', 'employeeEmail'].includes(key)).map((key) => (
                  <td key={key} style={{ padding: '0.75rem 1rem' }}>
                    {entry[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button 
        onClick={onHideEntries} 
        style={{ marginTop: '1rem' }}
        variant="secondary"
      >
        Hide Entries
      </Button>
    </div>
  );
};

export default EntriesTable;