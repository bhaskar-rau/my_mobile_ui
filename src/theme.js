import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#757575",
    },
    divider: "#000000",
  },
  typography: {
    fontFamily: "Monospace, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
  },
  spacing: 8,
});

export default theme;
