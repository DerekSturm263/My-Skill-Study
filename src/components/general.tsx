'use client'

import Markdown from 'react-markdown';
import generateText from '../lib/ai/functions';
import ShortAnswer from '@/interactions/short_answer/elements';
import MultipleChoice from '@/interactions/multiple_choice/elements';
import TrueOrFalse from '@/interactions/true_or_false/elements';
import Matching from '@/interactions/matching/elements';
import Ordering from '@/interactions/ordering/elements';
import Files from '@/interactions/files/elements';
import Drawing from '@/interactions/drawing/elements';
import Graph from '@/interactions/graph/elements';
import DAW from '@/interactions/daw/elements';
import Codespace from '@/interactions/codespace/elements';
import Engine from '@/interactions/engine/elements';
import IFrame from '@/interactions/iframe/elements';

import { IconButton, Dialog, Typography, Stack, List, ListItem, ListItemButton, ListItemText, Button, TextField, Tooltip, Snackbar, LinearProgress, Chip, AppBar, Drawer, Pagination, MenuItem, DialogActions, PaginationItem, Divider, CardActions, CardContent, Card, FormControl, InputLabel, Toolbar, Select, Box, Menu, Tabs, Tab, Switch, FormControlLabel, ListItemIcon, Link, DialogTitle, DialogContentText, DialogContent} from '@mui/material';
import { Refresh, VolumeUp, AutoAwesome, Fullscreen, School, LocalLibrary, Delete, MoreVert, RecordVoiceOver, VoiceOverOff, Psychology, Assignment, Book, Save, Add, Quiz, Share } from '@mui/icons-material';
import { ElementID, ComponentMode, InteractionPackage, Learn, InteractionProps, Project, Course, Practice, TextProps, Sharable } from '../lib/types';
import { Fragment, Children, useState, MouseEventHandler } from 'react';
import { save, remove } from '../lib/database';
import { ModelType } from '../lib/ai/types';

import * as helpers from '../lib/helpers';

const interactionMap: Record<string, InteractionPackage> = {
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
  "iframe": IFrame,
};

export function Header2() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Link
          variant="h6"
          sx={{ width: '400px', textDecoration: 'none' }}
          href="/"
        >
          MySkillStudy.com
        </Link>

        <Button
          onClick={handleClick}
        >
          Learn
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <ListItemButton
              href="myskillstudy.com/courses"
              sx={{ padding: '0px' }}
            >
              <ListItemIcon>
                <Book />
              </ListItemIcon>

              <ListItemText>
                Courses
              </ListItemText>
            </ListItemButton>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemButton
              href="myskillstudy.com/skills"
              sx={{ padding: '0px' }}
            >
              <ListItemIcon>
                <Psychology />
              </ListItemIcon>

              <ListItemText>
                Skills
              </ListItemText>
            </ListItemButton>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemButton
              href="myskillstudy.com/projects"
              sx={{ padding: '0px' }}
            >
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>

              <ListItemText>
                Projects
              </ListItemText>
            </ListItemButton>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export function Header<T extends Sharable>({ slug, mode, type, progress, showProgress, hideLogo, value, showSave, linkType, children }: { slug: string, mode: ComponentMode, type: string, progress: number, showProgress: boolean, hideLogo: boolean, value: T, showSave: boolean, linkType: string, children?: React.ReactNode }) {
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
            {mode == ComponentMode.Edit ? (
              <TextField
                label="Title"
                autoComplete="off"
                value={headerTitle}
                onChange={(e) => {
                  setHeaderTitle(e.target.value);
                  // TODO: Add code to actually set it.
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

            {showProgress && mode == ComponentMode.View && (
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

            {(mode == ComponentMode.Edit) && (
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

            {(showSave || mode == ComponentMode.Edit) && (
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
            
            {(mode == ComponentMode.Edit) && (
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

export function SidebarButton({ selected, ogTitle, isDisabled, mode, progress, onClick }: { selected: boolean, ogTitle: string, isDisabled: boolean, mode: ComponentMode, progress: number, onClick: MouseEventHandler<HTMLDivElement> | undefined }) {
  const [ title, setTitle ] = useState(ogTitle);

  return (
    <ListItem
      secondaryAction={ mode == ComponentMode.Edit ? <IconButton><MoreVert /></IconButton> : null }
    >
      <ListItemButton
        disabled={isDisabled}
        selected={selected}
        onClick={onClick}
      >
        <ListItemText
          primary={title}
          secondary={mode == ComponentMode.View ? <LinearProgress variant="determinate" value={progress * 100} /> : <Fragment></Fragment> }
        />
      </ListItemButton>
    </ListItem>
  );
}

export function Interaction(props: InteractionProps) {
  const [ type, setType ] = useState(props.elementID.learn.chapters[props.elementID.chapterIndex].elements[props.elementID.elementIndex].type);

  const Component = interactionMap[type].Component;

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      {props.mode == ComponentMode.Edit && (
        <TypeSwitcher
          elementID={props.elementID}
          type={type}
          setType={setType}
        />
      )}

      <Component
        {...props}
      />
    </Stack>
  );
}

export function TypeSwitcher({ elementID, type, setType }: { elementID: ElementID, type: string, setType: (type: string) => void }) {
  function setTypeAndUpdate(type: string) {
    setType(type);
    
    elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].type = type;
    elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].value = interactionMap[type].defaultValue;
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

export function Text(props: TextProps) {
  async function rephrase() {
    props.setIsThinking(true);

    const newText = await generateText({
      model: ModelType.Quick,
      prompt:
      `TASK:
      Rephrase a given TEXT. 
      
      TEXT:
      ${props.text}`,
      systemInstruction: `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.`
    });
    
    props.setText(newText);
    props.setIsThinking(false);
  }

  return (
    <Card
      id={`text${helpers.getAbsoluteIndex(props.elementID)}`}
    >
      <CardContent
        style={{ height: '20vh', overflowY: 'auto' }}
      >
        {props.isThinking && <LinearProgress />}

        {(props.mode == ComponentMode.Edit ? (
          <TextField
            hiddenLabel={true}
            multiline
            defaultValue={props.text}
            rows={4}
            onChange={(e) => {
              props.setText(e.target.value);
              props.elementID.learn.chapters[props.elementID.chapterIndex].elements[props.elementID.elementIndex].text = e.target.value;
            }}
            fullWidth={true}
          />
        ) : (
          <Markdown>
            {props.isThinking ? "Thinking..." : props.text}
          </Markdown>
        ))}
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Pagination
          count={helpers.getChapterLength(props.elementID)}
          page={props.elementID.elementIndex + 1}
          disabled={!props.isNavigationEnabled}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              disabled={!props.isNavigationEnabled || (item.page ?? 0) <= 0 || (item.page ?? 0) > helpers.getChapterLength(props.elementID) || (!props.elementsCompleted[helpers.getAbsoluteIndex({ learn: props.elementID.learn, chapterIndex: props.elementID.chapterIndex, elementIndex: 0, keys: props.elementID.keys }) + (item.page ?? 0) - 2] && (item.page ?? 0) != 1)}
              onClick={() => props.setCurrentElement({ learn: props.elementID.learn, chapterIndex: props.elementID.chapterIndex, elementIndex: (item.page ?? 0) - 1, keys: props.elementID.keys })}
            />
          )}
        />

        <Stack
          direction="row"
          spacing={1}
        >
          {props.mode == ComponentMode.Edit ? (
            <>
              <Tooltip
                title="Insert a new element after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Element Before"
                  onClick={props.insertElementBefore.call}
                />
              </Tooltip>

              <Tooltip
                title="Insert a new element after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Element After"
                  onClick={props.insertElementAfter.call}
                />
              </Tooltip>

              <Tooltip
                title="Delete this element"
              >
                <Chip
                  icon={<Delete />}
                  label="Delete"
                  onClick={props.deleteElement.call}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip
                title="Rephrase this text in simpler terms"
              >
                <Chip
                  icon={<AutoAwesome />}
                  label="Rephrase"
                  onClick={(e) => rephrase()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Read this text out loud"
              >
                <Chip
                  icon={<VolumeUp />}
                  label="Read Aloud"
                  onClick={(e) => props.readAloud()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title={`Turn ${props.doReadAloud ? "off" : "on"} immediately reading new text aloud`}
              >
                <Chip
                  icon={props.doReadAloud ? <VoiceOverOff /> : <RecordVoiceOver />}
                  label={`Turn ${props.doReadAloud ? "Off" : "On"} Auto Read`}
                  onClick={(e) => props.toggleAutoReadAloud()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Reset this element back to its original state"
              >
                <Chip
                  icon={<Refresh />}
                  label="Reset"
                  onClick={(e) => props.reset()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Bring this text to the main focus"
              >
                <Chip
                  icon={<Fullscreen />}
                  label="Fullscreen"
                  onClick={(e) => {}}
                  disabled={props.isThinking}
                />
              </Tooltip>
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}
