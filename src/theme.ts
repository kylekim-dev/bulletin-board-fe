import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red, pink, blue, grey } from '@mui/material/colors';

// export const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif'],
// });

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      // light: '#0d6efd',
      main: "#007bff",
      // dark: '#002884',
      // contrastText: '#fff',
    },
    secondary: {
      // light: '#757ce8',
      main: "#6c757d",
      // dark: '#002884',
      // contrastText: '#fff',
    },
    success: {
      main: '#28a745',
    },
    info: {
      main: '#17a2b8',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
  // typography: {
  //   fontFamily: roboto.style.fontFamily,
  // },
});

export default theme;