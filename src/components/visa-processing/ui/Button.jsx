import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.variant === 'secondary' ? '#4B5563' : '#3B82F6'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.variant === 'secondary' ? '#374151' : '#2563EB'};
  }

  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;