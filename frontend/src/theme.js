import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#6B7280',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F6F7F9',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
        },
        notchedOutline: {
          borderColor: '#E5E7EB',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6B7280',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 10px rgba(0,0,0,0.06)',
        },
      },
    },
  },
})

export default theme
