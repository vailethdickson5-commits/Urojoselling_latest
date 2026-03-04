import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#0E7490',
    },
    secondary: {
      main: '#F97316',
    },
    background: {
      default: '#F2FBFF',
      paper: '#FFFFFF',
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
          border: '1px solid #D8EEF5',
          boxShadow: '0px 8px 24px rgba(7, 89, 133, 0.08)',
        },
      },
    },
  },
})

export default theme
