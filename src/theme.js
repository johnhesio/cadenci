import { createTheme } from "@mui/material/styles";

const palette = {
  ink: "#1E2A28",
  paper: "#EFEAE0",
  card: "#FFFDF8",
  pine: "#24534A",
  pineDark: "#173630",
  gold: "#B8842C",
  rose: "#AD5850",
  sage: "#5C7F5A",
  line: "#DED6C4",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: palette.pine, dark: palette.pineDark, contrastText: palette.paper },
    secondary: { main: palette.gold, contrastText: palette.ink },
    error: { main: palette.rose },
    success: { main: palette.sage },
    background: { default: palette.paper, paper: palette.card },
    text: { primary: palette.ink, secondary: "#6B756F" },
    divider: palette.line,
    cadenci: palette,
  },
  typography: {
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: palette.card,
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: palette.line,
        },
        head: {
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#6B756F",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
        },
        containedPrimary: {
          "&:hover": { backgroundColor: palette.pineDark },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
