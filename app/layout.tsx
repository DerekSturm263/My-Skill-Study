'use client'

import Link from "next/link";
import CssBaseline from '@mui/material/CssBaseline';
import theme from "./theme";

import { AppBar, Avatar, IconButton, InputAdornment, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { Notifications, Search } from "@mui/icons-material";
import { ThemeProvider } from '@mui/material/styles';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Header />
        <Toolbar />
        
        <body>
          {children}
        </body>

        <Footer />
      </ThemeProvider>
    </html>
  );
}

function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Link
          href="/"
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="h6"
            width={200}
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            MySkillStudy
          </Typography>
        </Link>

        <TextField
          placeholder="What do you want to learn?"
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>,
            },
          }}
          sx={{ flexGrow: 1, maxWidth: 600 }}
        />
          
        <Stack
          direction="row"
          width={200}
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "end" }}
        >
          <IconButton>
            <Notifications
              fontSize="large"
            />
          </IconButton>
            
          <Avatar />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  return (
    <>
    
    </>
  );
}
