'use client'

import Text from '@/interactions/text/elements';
import Files from '@/interactions/files/elements';
import Drawing from '@/interactions/drawing/elements';
import Graph from '@/interactions/graph/elements';
import DAW from '@/interactions/daw/elements';
import Codespace from '@/interactions/codespace/elements';
import Engine from '@/interactions/engine/elements';
import ShortAnswer from '@/interactions/short_answer/elements';
import TrueOrFalse from '@/interactions/true_or_false/elements';
import MultipleChoice from '@/interactions/multiple_choice/elements';
import Ordering from '@/interactions/ordering/elements';
import Matching from '@/interactions/matching/elements';
import IFrame from '@/interactions/iframe/elements';

import { IconButton, Dialog, Typography, Stack, List, ListItem, ListItemButton, ListItemText, Button, TextField, LinearProgress, Drawer, MenuItem, DialogActions, Divider, FormControl, InputLabel, Toolbar, Select, Box, Tabs, Tab, Switch, FormControlLabel, ListItemIcon, Link, DialogTitle, DialogContentText, DialogContent, SpeedDial, SpeedDialAction, SpeedDialIcon, Menu, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { ViewMode, InteractionProps, InteractionPackageBase, InteractionPackage, Sharable } from '../lib/types/general';
import { Delete, MoreVert, Refresh, SwapHoriz, SvgIconComponent } from '@mui/icons-material';
import { Fragment, Children, useState, MouseEventHandler, Dispatch, SetStateAction } from 'react';
import { Component as TextComponent } from '@/interactions/text/elements'; 
import { remove } from '../lib/miscellaneous/database';
import { Verification } from '@/lib/ai/types';
import { Page } from '@/lib/types/skill';

const interactionMap: Record<string, InteractionPackageBase> = {
  "text": Text,
  "files": Files,
  "drawing": Drawing,
  "graph": Graph,
  "daw": DAW,
  "codespace": Codespace,
  "engine": Engine,
  "shortAnswer": ShortAnswer,
  "trueOrFalse": TrueOrFalse,
  "multipleChoice": MultipleChoice,
  "ordering": Ordering,
  "matching": Matching,
  "iframe": IFrame
};

export function SuccessDialog({ title, text, isOpen, setIsOpen }: { title: string, text: string, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
    
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
    
      <DialogActions>
        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Close
        </Button>
    
        <Button
          href="./practice"
        >
          Practice Skill
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function DetailsDialog({ value, isOpen, setIsOpen }: { value: Sharable, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        {value.title}
      </DialogTitle>
    
      <DialogContent>
        <DialogContentText
          gutterBottom
        >
          {value.tagLine}
        </DialogContentText>
        
        <DialogContentText>
          {value.description}
        </DialogContentText>
      </DialogContent>
    
      <DialogActions>
        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ShareDialog({ type, id, setSnackbarText }: { type: string, id: string, setSnackbarText: (text: string) => void }) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ hideLogoState, setHideLogoState ] = useState(true);
  const [ width, setWidth ] = useState(800);
  const [ height, setHeight ] = useState(600);

  const link = `https://myskillstudy.com/${type}/${id}?mode=view&hideLogo=${hideLogoState}`;
  const iframe = `<iframe src="https://myskillstudy.com/${type}/${id}?mode=view&hideLogo=${hideLogoState}" width=${width} height=${height}></iframe>`;

  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        {`Select Share Settings`}
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={tabIndex}
          onChange={(e, value) => { setTabIndex(value); }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {[ "Link", "IFrame" ].map((label, index) => (
            <Tab
              key={index}
              label={label}
            />
          ))}
        </Tabs>

        <br />

        <DialogContentText>
          <Typography
            variant="h6"
          >
            Settings
          </Typography>
        </DialogContentText>
      
        <Stack>
          <FormControlLabel control={
            <Switch
              defaultChecked={true}
              value={hideLogoState}
              onChange={(e, value) => setHideLogoState(value)}
            />}
            label="Hide MySkillStudy.com Logo"
          />

          {tabIndex == 1 && (
            <>
              <TextField
                id="width"
                label="Width"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              
              <TextField
                id="height"
                label="Height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </>
          )}
        </Stack>
          
        <br />
              
        {tabIndex == 0 ? (
          <>
            <DialogContentText
              gutterBottom
            >
              Copy the link below and send it to give anyone access this content.
            </DialogContentText>

            <DialogContentText>
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link}
              </Link>
            </DialogContentText>
          </>
        ) : (
          <>
            <DialogContentText
              gutterBottom
            >
              Copy the code below and paste it into your website/LMS to give users access to this skill.
            </DialogContentText>

            <DialogContentText
              sx={{ backgroundColor: "#1c1c1c", padding: "10px", overflow: "auto", borderRadius: "5px" }}
            >
              <code>
                {iframe}
              </code>
            </DialogContentText>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => {
            navigator.clipboard.writeText(tabIndex == 0 ? link : iframe);

            setSnackbarText("Copied to clipboard");
          }}
        >
          Copy to Clipboard
        </Button>

        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function GenerateDialog({ type, id, setSnackbarText }: { type: string, id: string, setSnackbarText: (text: string) => void }) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ description, setDescription ] = useState("");

  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        Generation Settings
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Your content will be generated based on the description you enter below. All existing settings will be overriden by the generated content.
        </DialogContentText>
      
        <Stack>
          <TextField
            id="description"
            label="Description"
            value={description}
            multiline={true}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Cancel
        </Button>

        <Button
          onClick={async (e) => {
            
          }}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteDialog({ type, id, setSnackbarText }: { type: string, id: string, setSnackbarText: (text: string) => void }) {
  const [ isOpen, setIsOpen ] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        Delete Content?
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this content permanently? You will not be able to bring it back.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Cancel
        </Button>

        <Button
          onClick={async (e) => {
            await remove(type, id);
            setSnackbarText("Content deleted");
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Sidebar({ children, label, options, selectedOption, actions }: { children?: React.ReactNode, label: string, options: { label: string, tooltip: string, link: string, id: string }[], selectedOption: string, actions: { label: string, icon: SvgIconComponent, action: () => void }[] }) {
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
      <Toolbar />

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
            <Fragment>
              {child}
            </Fragment>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export function SidebarButton({ selected, ogTitle, isDisabled, mode, progress, onClick }: { selected: boolean, ogTitle: string, isDisabled: boolean, mode: ViewMode, progress: number, onClick: MouseEventHandler<HTMLDivElement> | undefined }) {
  const [ title, setTitle ] = useState(ogTitle);

  return (
    <ListItem
      secondaryAction={ mode == ViewMode.Edit ? <IconButton><MoreVert /></IconButton> : null }
    >
      <ListItemButton
        disabled={isDisabled}
        selected={selected}
        onClick={onClick}
      >
        <ListItemText
          primary={title}
          secondary={mode == ViewMode.View ? <LinearProgress variant="determinate" value={progress * 100} /> : <Fragment></Fragment> }
        />
      </ListItemButton>
    </ListItem>
  );
}

export function PageComponent({ element, mode, isThinking, elementsCompleted, currentPageIndex, currentElementIndex, totalElementsInPage, setIsThinking, setCurrentElementIndex, setSnackbarText, setIsElementComplete }: { element: Page, mode: ViewMode, isThinking: boolean, elementsCompleted: boolean[][], currentPageIndex: number, currentElementIndex: number, totalElementsInPage: number, setIsThinking: Dispatch<SetStateAction<boolean>>, setCurrentElementIndex: Dispatch<SetStateAction<number>>, setSnackbarText: (text: string) => void, setIsElementComplete: (isComplete: boolean) => void }) {
  const [ text, setText ] = useState(element.text.text);

  function complete() {
    if (mode == ViewMode.View) {
      setSnackbarText("Good job! Click the next page to continue");
      setIsElementComplete(true);
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      <Toolbar />

      <Stack
        direction="row"
        sx={{ flexGrow: 1 }}
      >
        {element.interactions.map((interaction, index) => (
          <InteractionComponent
            key={index}
            thisType={interaction.type}
            text={element.text.text}
            originalValue={interaction.value}
            chapterIndex={currentPageIndex}
            pageIndex={currentElementIndex}
            totalElementsInChapter={totalElementsInPage}
            isThinking={isThinking}
            pagesCompleted={elementsCompleted}
            mode={mode}
            setText={setText}
            evaluateAndReply={async (promise: Promise<Verification>) => {
              setIsThinking(true);

              const verification = await promise;
              setText(verification.feedback);
    
              setIsThinking(false);

              if (verification.isValid) {
                complete();
              }
            }}
            setCurrentElementIndex={setCurrentElementIndex}
          />
        ))}
      </Stack>

      <TextComponent
        text={text}
        originalValue={element.text}
        chapterIndex={currentPageIndex}
        pageIndex={currentElementIndex}
        totalElementsInChapter={totalElementsInPage}
        isThinking={isThinking}
        pagesCompleted={elementsCompleted}
        mode={mode}
        setText={setText}
        evaluateAndReply={async (promise: Promise<Verification>) => {
          setIsThinking(true);

          const verification = await promise;
          setText(verification.feedback);
    
          setIsThinking(false);
        }}
        setCurrentElementIndex={setCurrentElementIndex}
      />
    </Stack>
  );
}

export function InteractionComponent(props: InteractionProps<object> & { thisType: string }) {
  const [ type, setType ] = useState(props.thisType);

  const Component = (interactionMap[type] as InteractionPackage<object>).Component;

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      <Component
        {...props}
      />

      {props.mode == ViewMode.Edit && (
        <SpeedDial
          ariaLabel="Interaction Options"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<Delete />}
            slotProps={{
              tooltip: {
                title: "Delete",
              },
            }}
          />

          <SpeedDialAction
            icon={<Refresh />}
            slotProps={{
              tooltip: {
                title: "Reset",
              },
            }}
          />

          <SpeedDialAction
            icon={<SwapHoriz />}
            slotProps={{
              tooltip: {
                title: "Replace",
              },
            }}
          />
        </SpeedDial>
      )}
    </Stack>
  );
}

export function TypeSwitcher({ props, type, setType }: { props: InteractionProps<object>, type: string, setType: Dispatch<SetStateAction<string>> }) {
  function setTypeAndUpdate(type: string) {
    setType(type);
    props.originalValue = (interactionMap[type] as InteractionPackage<object>).defaultValue;
  }

  return (
    <FormControl
      size="small"
    >
      <InputLabel id="type-label">Type</InputLabel>

      <Select
        labelId="type-label"
        value={type}
        label="Type"
        onChange={(e) => setTypeAndUpdate(e.target.value)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: '400px'
            }
          }
        }}
      >
        {(Object.values(interactionMap).map((item, index) => (
          <MenuItem
            key={index}
            value={item.id}
          >
            <ListItemButton>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>

              <ListItemText>
                {item.prettyName}
              </ListItemText>
            </ListItemButton>
          </MenuItem>
        )))}
      </Select>
    </FormControl>
  );
}
