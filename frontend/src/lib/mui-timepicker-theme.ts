// lib/mui-timepicker-theme.ts
import { createTheme } from "@mui/material/styles"

export const timePickerTheme = createTheme({
  palette: {
    primary: {
      main: "#111111", // Tailwind yellow-400 (#facc15)
    },
  },

  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500, // match Tailwind default
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500, // match Tailwind default
        },
      },
    },
  },
})
