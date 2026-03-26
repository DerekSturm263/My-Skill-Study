'use client'

import Files from '@/interactions/files/elements';
import Drawing from '@/interactions/drawing/elements';
import Graph from '@/interactions/graph/elements';
import DAW from '@/interactions/daw/elements';
import Codespace from '@/interactions/codespace/elements';
import ThreeDModeling from '@/interactions/3d_modeling/elements';
import GameEngine from '@/interactions/game_engine/elements';
import ShortAnswer from '@/interactions/short_answer/elements';
import TrueOrFalse from '@/interactions/true_or_false/elements';
import MultipleChoice from '@/interactions/multiple_choice/elements';
import Ordering from '@/interactions/ordering/elements';
import Matching from '@/interactions/matching/elements';
import Embed from '@/interactions/embed/elements';

import { IconButton, Dialog, Typography, Stack, List, ListItem, ListItemButton, ListItemText, Button, TextField, LinearProgress, Drawer, MenuItem, DialogActions, Divider, FormControl, InputLabel, Toolbar, Select, Box, Tabs, Tab, Switch, FormControlLabel, ListItemIcon, Link, DialogTitle, DialogContentText, DialogContent, SpeedDial, SpeedDialAction, SpeedDialIcon, Menu, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { ViewMode, InteractionProps, InteractionPackageBase, InteractionPackage, Sharable, Interaction } from '../lib/types/general';
import { Fragment, Children, useState, MouseEventHandler, Dispatch, SetStateAction, useEffect } from 'react';
import { Delete, DragHandle, MoreVert, Settings, SvgIconComponent } from '@mui/icons-material';
import { Component as TextComponent } from '@/interactions/text/elements'; 
import { useSearchParams } from 'next/navigation';
import { Verification } from '@/lib/ai/types';
import { remove } from '../lib/miscellaneous/database';
import { Page } from '@/lib/types/skill';

const interactionMap: Record<string, InteractionPackageBase> = {
  "files": Files,
  "drawing": Drawing,
  "graph": Graph,
  "daw": DAW,
  "codespace": Codespace,
  "3d_modeling": ThreeDModeling,
  "engine": GameEngine,
  "shortAnswer": ShortAnswer,
  "trueOrFalse": TrueOrFalse,
  "multipleChoice": MultipleChoice,
  "ordering": Ordering,
  "matching": Matching,
  "embed": Embed
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

export function ShareDialog({ type, id, isOpen, setIsOpen, setSnackbarText }: { type: string, id: string, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, setSnackbarText: (text: string) => void }) {
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ hideHeaderState, setHideHeaderState ] = useState(true);
  const [ width, setWidth ] = useState(800);
  const [ height, setHeight ] = useState(600);

  const link = `https://myskillstudy.com/${type}/${id}/learn?mode=view&hideHeader=${hideHeaderState}`;
  const iframe = `<iframe src="https://myskillstudy.com/${type}/${id}/learn?mode=view&hideHeader=${hideHeaderState}" width=${width} height=${height}></iframe>`;

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

        <DialogContentText
          variant="h6"
        >
          Settings
        </DialogContentText>
      
        <Stack>
          <FormControlLabel
            control={
              <Switch
                defaultChecked={true}
                value={hideHeaderState}
                onChange={(e, value) => setHideHeaderState(value)}
              />
            }
            label="Hide Header"
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

export function GenerateDialog({ type, id, isOpen, setIsOpen, setSnackbarText }: { type: string, id: string, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, setSnackbarText: (text: string) => void }) {
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
          onClick={async (e) => {
            
          }}
        >
          Generate
        </Button>

        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteDialog({ type, id, isOpen, setIsOpen, setSnackbarText }: { type: string, id: string, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, setSnackbarText: (text: string) => void }) {
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
          onClick={async (e) => {
            await remove(type, id);
            setSnackbarText("Content deleted");
          }}
        >
          Delete
        </Button>

        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
            <Fragment>
              {child}
            </Fragment>
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

export function PageComponent({ element, mode, isThinking, pagesCompleted: elementsCompleted, currentChapterIndex: currentPageIndex, currentPageIndex: currentElementIndex, totalPagesInChapter: totalElementsInPage, setIsThinking, setCurrentPageIndex: setCurrentElementIndex, setSnackbarText, setIsPageComplete: setIsElementComplete }: { element: Page, mode: ViewMode, isThinking: boolean, pagesCompleted: boolean[][], currentChapterIndex: number, currentPageIndex: number, totalPagesInChapter: number, setIsThinking: Dispatch<SetStateAction<boolean>>, setCurrentPageIndex: Dispatch<SetStateAction<number>>, setSnackbarText: (text: string) => void, setIsPageComplete: (isComplete: boolean) => void }) {
  const searchParams = useSearchParams();
  const hideHeader = searchParams.get('hideHeader') === 'true';

  const [ text, setText ] = useState(element.text.text);

  useEffect(() => {
    if (element.interactions.every(interaction => !interaction.value.requiresCompletion)) {
      setIsComplete(true, false);
    }
  }, []);
    
  function setIsComplete(isComplete: boolean, showSnackbar: boolean) {
    setIsElementComplete(isComplete);

    if (showSnackbar && mode == ViewMode.View) {
      setSnackbarText("Good job! Click the next page to continue");
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      {!hideHeader && <Toolbar />}

      <Stack
        direction="row"
        spacing={ mode == ViewMode.Edit ? 1 : 0 }
        sx={{ flexGrow: 1, padding: mode == ViewMode.Edit ? "8px" : "0px" }}
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
                setIsComplete(true, true);
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

export function InteractionComponent(props: InteractionProps<Interaction> & { thisType: string }) {
  const [ type, setType ] = useState(props.thisType);
  const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);

  const Icon = (interactionMap[type] as InteractionPackage<Interaction>).icon;

  function reset() {
    props.originalValue = (interactionMap[type] as InteractionPackage<Interaction>).defaultValue;
  }

  const Component = (interactionMap[type] as InteractionPackage<Interaction>).Component;

  return (
    <Stack
      sx={{ flexGrow: 1, backgroundColor: (theme) => theme.palette.grey[900] }}
    >
      {props.mode == ViewMode.Edit && (<Stack
        direction="row"
        sx={{ justifyContent: "space-between", backgroundColor: (theme) => theme.palette.grey[800] }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ marginTop: "auto", marginBottom: "auto", marginLeft: "8px" }}
        >
          <Icon />

          <Typography
            sx={{ overflow: "hidden", whiteSpace: "nowrap" }}
          >
            {(interactionMap[type] as InteractionPackage<Interaction>).prettyName}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={0}
        >
          <Tooltip
            title="Move this interaction"
          >
            <IconButton>
              <DragHandle />
            </IconButton>
          </Tooltip>
          
          <Tooltip
            title="Edit this interaction"
          >
            <IconButton
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings />
            </IconButton>
          </Tooltip>
          
          <Tooltip
            title="Delete this interaction"
          >
            <IconButton>
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>)}

      <Component
        {...props}
      />

      <SettingsDialog
        props={props}
        type={type}
        isOpen={isSettingsOpen}
        setType={setType}
        setIsOpen={setIsSettingsOpen}
      />
    </Stack>
  );
}

export function SettingsDialog({ props, type, isOpen, setType, setIsOpen }: { props: InteractionProps<Interaction>, type: string, isOpen: boolean, setType: Dispatch<SetStateAction<string>>, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  const interactionPackage = interactionMap[type] as InteractionPackage<Interaction>;

  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        {`${interactionPackage.prettyName} Settings`}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {interactionPackage.description}
        </DialogContentText>

        <br />

        <Stack
          spacing={1}
        >
          {Object.keys(props.originalValue).map(key => {
            const value = props.originalValue[key as keyof Interaction];
            const type = typeof value;

            return (
              type == "boolean" ? (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      defaultChecked={true}
                      value={value}
                    />
                  }
                  label={key}
                />
              ) : type == "string" ? (
                <TextField
                  key={key}
                  label={key}
                  value={value}
                  fullWidth
                  multiline
                />
              ) : type == "number" ? (
                <TextField
                  key={key}
                  label={key}
                  value={value}
                  fullWidth
                  multiline
                  type="number"
                />
              ) : (
                <>
                </>
              )
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function TypeSwitcher({ props, type, setType }: { props: InteractionProps<Interaction>, type: string, setType: Dispatch<SetStateAction<string>> }) {
  function setTypeAndReset(type: string) {
    setType(type);
    props.originalValue = (interactionMap[type] as InteractionPackage<Interaction>).defaultValue;
  }

  return (
    <Select
      value={type}
      label="Type"
      onChange={(e) => setTypeAndReset(e.target.value)}
      autoWidth={true}
      renderValue={(value: string) => {
        const Icon = interactionMap[value].icon;

        return (
          <Stack
            direction="row"
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
                  
            <ListItemText>
              {interactionMap[value].prettyName}
            </ListItemText>
          </Stack>
        );
      }}
    >
      {Object.values(interactionMap).map(interaction => (
        <MenuItem
          key={interaction.id}
          value={interaction.id}
        >
          <ListItemIcon>
            <interaction.icon />
          </ListItemIcon>
                  
          <ListItemText>
            {interaction.prettyName}
          </ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
}
