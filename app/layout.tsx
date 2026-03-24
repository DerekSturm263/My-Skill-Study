'use client'

import CssBaseline from '@mui/material/CssBaseline';
import Link from "next/link";
import theme from "./theme";

import { AppBar, Avatar, Badge, Divider, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { Logout, Notifications, Person, QuestionMark, Search } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { ThemeProvider } from '@mui/material/styles';

export default function RootLayout({ children, params }: Readonly<{ children: React.ReactNode }> & { params: { hideHeader: string } }) {
  const hideHeader = params.hideHeader == "true";
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <header>
        {!hideHeader && (
          <Header
            presetSearchTerms=""
          />
        )}
      </header>

      <html lang="en">
        <body>
          {children}
        </body>
      </html>

      <footer>
        <Footer />
      </footer>
    </ThemeProvider>
  );
}

function Header({ presetSearchTerms }: { presetSearchTerms: string }) {
  const [ searchTerms, setSearchTerms ] = useState(presetSearchTerms);
  const [ isNotificationsOpen, setIsNotificationsOpen ] = useState(false);
  const [ isProfileOpen, setIsProfileOpen ] = useState(false);
  const [ anchorElement, setAnchorElement ] = useState<null | HTMLElement>(null);

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
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
          onSubmit={(e) => {}}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">
                <Tooltip
                  title="Search for what you typed"
                >
                  <IconButton
                    href={`/search?query=${searchTerms}`}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>
                
                <Tooltip
                  title="I'm feeling lucky"
                >
                  <IconButton>
                    <QuestionMark />
                  </IconButton>
                </Tooltip>
              </InputAdornment>,
            },
          }}
          sx={{ flexGrow: 1, maxWidth: 600 }}
        />
          
        <Stack
          direction="row"
          width={200}
          spacing={0}
          sx={{ alignItems: "center", justifyContent: "end" }}
        >
          <IconButton
            onClick={(e) => {
              setIsNotificationsOpen(true);
              setAnchorElement(e.currentTarget);
            }}
          >
            <Badge
              badgeContent={0}
              color="primary"
            >
              <Notifications
                fontSize="large"
              />
            </Badge>
          </IconButton>
            
          <NotificationsMenu
            anchorElement={anchorElement}
            isOpen={isNotificationsOpen}
            setIsOpen={setIsNotificationsOpen}
          />
          
          <IconButton
            onClick={(e) => {
              setIsProfileOpen(true);
              setAnchorElement(e.currentTarget);
            }}
          >
            <Avatar />
          </IconButton>

          <ProfileMenu
            anchorElement={anchorElement}
            isOpen={isProfileOpen}
            setIsOpen={setIsProfileOpen}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function NotificationsMenu({ anchorElement, isOpen, setIsOpen }: { anchorElement: null | HTMLElement, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <Menu
      anchorEl={anchorElement}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <MenuItem>
        Test
      </MenuItem>
    </Menu>
  );
}

function ProfileMenu({ anchorElement, isOpen, setIsOpen }: { anchorElement: null | HTMLElement,isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <Menu
      anchorEl={anchorElement}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <MenuItem>
        <ListItemIcon>
          <Person />
        </ListItemIcon>

        <ListItemText>
          Profile
        </ListItemText>
      </MenuItem>

      <Divider />
      
      <MenuItem>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        
        <ListItemText>
          Sign Out
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}

function Footer() {
  return (
    <>
    
    </>
  );
}
