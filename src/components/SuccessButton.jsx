import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1300, // above other content
}));

export default function SuccessButton({ message, onClose }) {
  return (
    <StyledButton variant="contained" color="success" onClick={onClose} aria-label="Success notification">
      {message}
    </StyledButton>
  );
}
