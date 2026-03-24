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

import { IconButton, Dialog, Typography, Stack, List, ListItem, ListItemButton, ListItemText, Button, TextField, Tooltip, Snackbar, LinearProgress, AppBar, Drawer, MenuItem, DialogActions, Divider, FormControl, InputLabel, Toolbar, Select, Box, Tabs, Tab, Switch, FormControlLabel, ListItemIcon, Link, DialogTitle, DialogContentText, DialogContent, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { ViewMode, InteractionProps, Sharable, InteractionPackageBase, Interaction, InteractionPackage } from '../lib/types/general';
import { AutoAwesome, School, LocalLibrary, Delete, MoreVert, Save, Quiz, Share, Refresh, SwapHoriz } from '@mui/icons-material';
import { Fragment, Children, useState, MouseEventHandler, Dispatch, SetStateAction } from 'react';
import { Component as TextComponent } from '@/interactions/text/elements'; 
import { save, remove } from '../lib/miscellaneous/database';
import { Verification } from '@/lib/ai/types';
import { Element } from '@/lib/types/skill';

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

export function SharableInfo<T extends Sharable>({ slug, mode, type, progress, showProgress, hideLogo, value, showSave, linkType, children }: { slug: string, mode: ViewMode, type: string, progress: number, showProgress: boolean, hideLogo: boolean, value: T, showSave: boolean, linkType: string, children?: React.ReactNode }) {
  const [ headerTitle, setHeaderTitle ] = useState(value.title);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ hideLogoState, setHideLogoState ] = useState(true);
  const [ width, setWidth ] = useState(800);
  const [ height, setHeight ] = useState(600);
  const [ isAIOpen, setIsAIOpen ] = useState(false);
  const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
  const [ description, setDescription] = useState("");

  const link = `https://myskillstudy.com/${linkType}/${slug}?mode=view&hideLogo=${hideLogoState}`;
  const iframe = `<iframe src="https://myskillstudy.com/${linkType}/${slug}?mode=view&hideLogo=${hideLogoState}" width=${width} height=${height}></iframe>`;

  return (
    <Fragment>
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
            {["Link", "IFrame"].map((label, index) => (
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
              <DialogContentText>
                {"Copy the link below and send it to give anyone access this content."}
              </DialogContentText>
              
              <br />

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
              <DialogContentText>
                {"Copy the code below and paste it into your website/LMS to give users access to this skill."}
              </DialogContentText>

              <br />

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
              setIsSnackbarOpen(true);
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

      <Dialog
        open={isAIOpen}
        onClose={(e) => setIsAIOpen(false)}
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
            onClick={(e) => setIsAIOpen(false)}
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

      <Dialog
        open={isDeleteOpen}
        onClose={(e) => setIsDeleteOpen(false)}
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
            onClick={(e) => setIsDeleteOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={async (e) => {
              await remove(slug, linkType);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={3000}
        open={isSnackbarOpen}
        message={snackbarText}
        onClose={(e, reason?) => {
          if (reason === 'clickaway') {
            return;
          }

          setIsSnackbarOpen(false);
        }}
      />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {!hideLogo && (
            <Link
              variant="h6"
              sx={{ width: '400px', textDecoration: 'none' }}
              href="/"
            >
              MySkillStudy.com
            </Link>
          )}

          <Stack
            spacing={2}
          >
            {mode == ViewMode.Edit ? (
              <TextField
                label="Title"
                autoComplete="off"
                value={headerTitle}
                onChange={(e) => {
                  setHeaderTitle(e.target.value);
                }}
              />
            ) : (
              <Link
                variant="h6"
                sx={{ textAlign: 'center', textDecoration: 'none' }}
                href={`./?mode=${mode}&hideLogo=${hideLogo}`}
              >
                {headerTitle}
              </Link>
            )}

            {showProgress && mode == ViewMode.View && (
              <LinearProgress
                variant="determinate"
                value={progress * 100}
                sx={{ width: '200px' }}
                style={{ marginTop: '6px' }}
              />
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: '400px', justifyContent: 'flex-end' }}
          >
            {type != "" && (
              <FormControl
                size="small"
              >
                <InputLabel id="mode-label">Mode</InputLabel>

                <Select
                  labelId="mode-label"
                  value={type}
                  label="Mode"
                >
                  <MenuItem
                    value="Learn"
                  >
                    <ListItemButton
                      href={`./learn?mode=${mode}&hideLogo=${hideLogo}`}
                      sx={{ padding: '0px' }}
                    >
                      <ListItemIcon>
                        <School />
                      </ListItemIcon>

                      <ListItemText>
                        Learn
                      </ListItemText>
                    </ListItemButton>
                  </MenuItem>

                  <MenuItem
                    value="Practice"
                  >
                    <ListItemButton
                      href={`./practice?mode=${mode}&hideLogo=${hideLogo}`}
                      sx={{ padding: '0px' }}
                    >
                      <ListItemIcon>
                        <LocalLibrary />
                      </ListItemIcon>

                      <ListItemText>
                        Practice
                      </ListItemText>
                    </ListItemButton>
                  </MenuItem>

                  <MenuItem
                    value="Quiz"
                  >
                    <ListItemButton
                      href={`./quiz?mode=${mode}&hideLogo=${hideLogo}`}
                      sx={{ padding: '0px' }}
                    >
                      <ListItemIcon>
                        <Quiz />
                      </ListItemIcon>

                      <ListItemText>
                        Quiz
                      </ListItemText>
                    </ListItemButton>
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {slug != "" && hideLogo == false && (
              <Tooltip
                title="Share or embed this content"
              >
                <IconButton
                  onClick={async (e) => {
                    setIsOpen(true);
                    setTabIndex(0);
                    setHideLogoState(true);
                    setWidth(800);
                    setHeight(600);
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            )}

            {(mode == ViewMode.Edit) && (
              <Tooltip
                title="Generate using AI"
              >
                <IconButton
                  onClick={(e) => {
                    setIsAIOpen(true);
                  }}
                >
                  <AutoAwesome />
                </IconButton>
              </Tooltip>
            )}

            {(showSave || mode == ViewMode.Edit) && (
              <Tooltip
                title="Save changes"
              >
                <IconButton
                  onClick={async (e) => {
                    await save(type, slug, value);

                    setSnackbarText("Saved");
                    setIsSnackbarOpen(true);
                  }}
                >
                  <Save />
                </IconButton>
              </Tooltip>
            )}
            
            {(mode == ViewMode.Edit) && (
              <Tooltip
                title="Delete permanently"
              >
                <IconButton
                  onClick={(e) => {
                    setIsDeleteOpen(true);
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}

export function Sidebar({ children, label }: { children?: React.ReactNode, label: string }) {
  const [ isOpen, setIsOpen ] = useState(true);

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
        sx={{  overflow: 'auto' }}
      >
        <Typography
          variant='h6'
          sx={{ margin: 'auto', textAlign: 'center', height: '48px', alignContent: 'center' }}
        >
          {label}
        </Typography>

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

export function ElementComponent({ element, mode, isThinking, elementsCompleted, currentPageIndex, currentElementIndex, totalElementsInPage, setIsThinking, setCurrentElementIndex, setSnackbarText, setIsSnackbarOpen, setIsElementComplete }: { element: Element, mode: ViewMode, isThinking: boolean, elementsCompleted: boolean[][], currentPageIndex: number, currentElementIndex: number, totalElementsInPage: number, setIsThinking: Dispatch<SetStateAction<boolean>>, setCurrentElementIndex: Dispatch<SetStateAction<number>>, setSnackbarText: Dispatch<SetStateAction<string>>, setIsSnackbarOpen: Dispatch<SetStateAction<boolean>>, setIsElementComplete: (isComplete: boolean) => void }) {
  const [ text, setText ] = useState(element.text.text);

  function complete() {
    if (mode == ViewMode.View) {
      setSnackbarText("Good job! Click the next page to continue");
      setIsSnackbarOpen(true);
      setIsElementComplete(true);
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      <Toolbar />

      <TextComponent
        originalText={text}
        originalValue={element.text}
        pageIndex={currentPageIndex}
        elementIndex={currentElementIndex}
        totalElementsInPage={totalElementsInPage}
        isThinking={isThinking}
        elementsCompleted={elementsCompleted}
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

      <Stack
        direction="row"
      >
        {element.interactions.map((interaction, index) => (
          <InteractionComponent
            key={index}
            originalText={element.text.text}
            originalValue={interaction.value}
            pageIndex={currentPageIndex}
            elementIndex={currentElementIndex}
            totalElementsInPage={totalElementsInPage}
            isThinking={isThinking}
            elementsCompleted={elementsCompleted}
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
    </Stack>
  );
}

export function InteractionComponent(props: InteractionProps<Interaction>) {
  const [ type, setType ] = useState("text"); // TODO: Get type

  const Component = (interactionMap[type] as InteractionPackage<Interaction>).Component;

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

export function TypeSwitcher({ props, type, setType }: { props: InteractionProps<Interaction>, type: string, setType: Dispatch<SetStateAction<string>> }) {
  function setTypeAndUpdate(type: string) {
    setType(type);
    props.originalValue = (interactionMap[type] as InteractionPackage<Interaction>).defaultValue;
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
