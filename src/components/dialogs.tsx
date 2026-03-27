/* eslint-disable  @typescript-eslint/no-explicit-any */

'use client'

import NumberField from './helpers';
import Link from 'next/link';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, Switch, Tab, Tabs, TextField, ToggleButton, Typography } from '@mui/material';
import { Element, ElementPackage, elementMap } from '@/lib/types/element';
import { Dispatch, SetStateAction, useState } from 'react';
import { Sharable } from '@/lib/types/general';
import { Masonry } from '@mui/lab';
import { remove } from '../lib/miscellaneous/database';
import { Add, Delete, DragHandle, Reorder } from '@mui/icons-material';
import ReorderList, { ReorderIcon } from 'react-reorder-list';

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
          {[ "Link", "IFrame" ].map(label => (
            <Tab
              key={label}
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

export function SettingsDialog({ value, type, isOpen, setValue, setIsOpen, resetElement, deleteElement }: { value: Element, type: string, isOpen: boolean, setValue: Dispatch<SetStateAction<Element>>, setIsOpen: Dispatch<SetStateAction<boolean>>, resetElement: () => void, deleteElement: () => void }) {
  const elementPackage = elementMap[type] as ElementPackage<Element>;

  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        {`${elementPackage.prettyName} Settings`}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {elementPackage.description}
        </DialogContentText>

        <br />

        <ElementValue
          type={typeof value}
          id=""
          value={value}
          setValue={newValue => {
            setValue(newValue);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => resetElement()}
        >
          Reset
        </Button>

        <Button
          onClick={(e) => deleteElement()}
        >
          Delete
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

function ElementValue({ type, id, value, setValue }: { type: string, id: string, value: any, setValue: (newValue: any) => void }) {
  console.log(type);

  return (
    <>
      {type == "boolean" ? (
        <FormControlLabel
          control={
            <Switch
              defaultChecked={true}
              value={(value as any)[id]}
              onChange={(e) => setValue(e.target.checked)}
            />
          }
          label={id}
        />
      ) : type == "string" ? (
        <TextField
          label={id}
          value={(value as any)[id]}
          fullWidth
          multiline
          onChange={(e) => setValue(e.target.value)}
        />
      ) : type == "number" ? (
        <NumberField
          label={id}
          value={(value as any)[id]}
        />
      ) : Array.isArray(value) ? (
        <ReorderList
          useOnlyIconToDrag
          props={{ style: {
            gap: '8px', padding: '8px'
          }}}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <Stack
              direction="row"
            >
                <ReorderIcon
                draggable={true}
              >
                <DragHandle
                  sx={{ height: "100%" }}
                />
              </ReorderIcon>

              <Typography
                variant='subtitle1'
              >
                {id}
              </Typography>
            </Stack>
            
            <IconButton
              onClick={() => {
                (value as Array<any>).push();
                setValue(value);
              }}
            >
              <Add />
            </IconButton>
          </Stack>

          {(value as Array<any>).map((item, index) => (
            <Stack
              key={item}
              spacing={1}
              borderRadius={1}
              direction="row"
              sx={{ backgroundColor: (theme) => theme.palette.grey[800], padding: '8px', justifyContent: "space-between" }}
            >
              <ElementValue
                type={item}
                id={`Element ${index}`}
                value={item}
                setValue={(newValue) => {
                  setValue(newValue);
                }}
              />

              <IconButton
                onClick={() => {
                  (value as Array<any>).splice(index, 1);
                  setValue(value);
                }}
              >
                <Delete />
              </IconButton>
            </Stack>
          ))}

          
        </ReorderList>
      ) : type == "object" ? (
        <Stack
          spacing={1}
        >
          <Typography>
            {id}
          </Typography>

          {Object.keys(value).map(key => (
            <ElementValue
              key={key}
              type={typeof (value as any)[key]}
              id={key}
              value={(value as any)[key]}
              setValue={(newValue) => {
                (value as any)[key] = newValue;
                setValue(value);
              }}
            />
          ))}
        </Stack>
      ) : (
        <DialogContentText>
          This type is not supported yet!
        </DialogContentText>
      )}
    </>
  )
}

export function NewElementDialog({ isOpen, setIsOpen, createElement }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, createElement: (type: string) => void }) {
  return (
    <Dialog
      open={isOpen}
      onClose={(e) => setIsOpen(false)}
    >
      <DialogTitle>
        Create New Element
      </DialogTitle>
    
      <DialogContent>
        <DialogContentText>
          Choose one of the following element types to add to this page.
        </DialogContentText>

        <br />

        <Masonry
          columns={2}
        >
          {Object.values(elementMap).map(element => (
            <ToggleButton
              key={element.id}
              value={element.id}
              onClick={(e) => {
                createElement(element.id);
                setIsOpen(false);
              }}
            >
              <Stack>
                <element.icon
                  sx={{ margin: "auto" }}
                />

                {element.prettyName}
              </Stack>
            </ToggleButton>
          ))}
        </Masonry>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => setIsOpen(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
