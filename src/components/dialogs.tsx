import Link from 'next/link';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, Switch, Tab, Tabs, TextField } from '@mui/material';
import { Interaction, InteractionPackage, InteractionProps, Sharable } from '@/lib/types/general';
import { Dispatch, SetStateAction, useState } from 'react';
import { interactionMap } from './general';
import { remove } from '../lib/miscellaneous/database';

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
