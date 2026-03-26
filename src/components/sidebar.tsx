// @ts-expect-error: Reorder isn't made to work with Typescript.
import Reorder from 'react-reorder';

import { Box, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, Typography } from "@mui/material";
import { DragHandle, MoreVert, SvgIconComponent } from "@mui/icons-material";
import { Children, MouseEventHandler, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ViewMode } from '@/lib/types/general';

export function Sidebar({ children, label, options, selectedOption, actions }: { children?: React.ReactNode, label: string, options: { label: string, tooltip: string, link: string, id: string }[], selectedOption: string, actions: { label: string, icon: SvgIconComponent, action: () => void }[] }) {
  const searchParams = useSearchParams();
  const hideHeader = searchParams.get('hideHeader') === 'true';
    
  const [ isOpen, setIsOpen ] = useState(true);
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  const [ anchorElement, setAnchorElement ] = useState<null | HTMLElement>(null);

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: 300,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 300, boxSizing: 'border-box' }
      }}
    >
      {!hideHeader && <Toolbar />}

      <Box
        sx={{ overflow: 'auto' }}
      >
        <Stack
          direction="row"
          spacing={0}
          sx={{ height: '48px', justifyContent: 'space-between', marginLeft: '8px', marginRight: '8px' }}
        >
          <Typography
            variant='h6'
            sx={{ alignContent: 'center', marginLeft: '8px' }}
          >
            {label}
          </Typography>

          <IconButton
            onClick={(e) => {
              setIsMenuOpen(true);
              setAnchorElement(e.currentTarget);
            }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorElement}
            open={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          >
            {actions.map((action, index) => (
              <MenuItem
                key={index}
                onClick={(e) => action.action()}
              >
                <ListItemIcon>
                  <action.icon />
                </ListItemIcon>
                  
                <ListItemText>
                  {action.label}
                </ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Stack>

        <ToggleButtonGroup
          value={selectedOption}
          size='small'
          exclusive
          fullWidth
          sx={{ width: 'calc(100% - 32px)', marginLeft: '16px', marginBottom: '12px' }}
        >
          {options.map((item, index) => (
            <Tooltip
              key={index}
              title={item.tooltip}
            >
              <ToggleButton
                value={item.id}
                href={item.link}
                sx={{ flex: 1 }}
              >
                {item.label}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>

        <Divider />

        <List>
          {Children.map(children, child => 
            <li>
              {child}
            </li>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export function SidebarButton({ selected, ogTitle, isDisabled, mode, progress, SecondaryIcon, primaryAction, secondaryAction }: { selected: boolean, ogTitle: string, isDisabled: boolean, mode: ViewMode, progress: number, SecondaryIcon: SvgIconComponent, primaryAction: MouseEventHandler<HTMLDivElement> | undefined, secondaryAction: () => void }) {
  const [ title, setTitle ] = useState(ogTitle);

  return (
    <ListItem
      secondaryAction={ mode == ViewMode.Edit ? (
        <IconButton
          onClick={() => secondaryAction()}
        >
          <SecondaryIcon />
        </IconButton>
      ) : (
        null
      )}
    >
      <ListItemButton
        disabled={isDisabled}
        selected={selected}
        onClick={primaryAction}
      >
        {mode == ViewMode.Edit && (
          <ListItemIcon>
            <DragHandle />
          </ListItemIcon>
        )}
        
        {mode == ViewMode.Edit ? (
          <TextField
            value={title}
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            size="small"
          />
        ) : (
          <ListItemText
            primary={title}
            secondary={mode == ViewMode.View ? (
              <LinearProgress
                variant="determinate"
                value={progress * 100}
              />
            ) : (
              <></>
            )}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}
