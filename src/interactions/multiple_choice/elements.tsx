'use client'

import Markdown from 'react-markdown';
import verify from './functions';

import { Box, Stack, Button, TextField, InputLabel, MenuItem, Radio, RadioGroup, Select, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { ViewMode, InteractionProps, InteractionPackage } from '@/lib/types/general';
import { useEffect, useState } from 'react';
import { CheckBox } from '@mui/icons-material';
import { Type } from '@google/genai';

export type InteractionType = {
  items: MultipleChoiceItem[],
  choiceType: ChoiceType
};

export type MultipleChoiceItem = {
  value: string,
  isCorrect: boolean
};

export enum ChoiceType {
  NeedsAllCorrect = 'needsAllCorrect',
  NeedsOneCorrect = 'needsOneCorrect'
}

const defaultValue: InteractionType = {
  items: [
    {
      value: "New Item",
      isCorrect: true
    }
  ],
  choiceType: ChoiceType.NeedsAllCorrect,
}

const schema = {
  type: Type.OBJECT,
  properties: {
    choices: {
      type: Type.OBJECT,
      properties: {
        value: {
          type: Type.STRING
        },
        isCorrect: {
          type: Type.BOOLEAN
        }
      },
      required: [
        "value",
        "isCorrect"
      ],
      propertyOrdering: [
        "value",
        "isCorrect"
      ]
    },
    choiceType: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "choices",
    "choiceType"
  ],
  propertyOrdering: [
    "choices",
    "choiceType"
  ]
};

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  const [ selected, setSelected ] = useState([ ] as string[]);
  const [ isDisabled, setIsDisabled ] = useState(false);

  useEffect(() => {
    const newItems = value.items.toSorted((item1, item2) => Math.random() - 0.5);
    setValue({ ... value, items: newItems });
  }, []);

  function addItem() {
    const newItems = value.items;
    newItems.push({
      value: "New Multiple Choice Item",
      isCorrect: false
    });

    setValue({ ... value, items: newItems });
  }

  function removeItem(index: number) {
    const newItems = value.items;
    newItems.splice(index, 1);

    setValue({ ... value, items: newItems });
  }

  function selectItem(item: string) {
    const newSelected = selected;
    newSelected.push(item);

    setSelected(newSelected);
  }

  function unselectItem(item: string) {
    const newSelected = selected;
    newSelected.splice(newSelected.indexOf(item), 1);

    setSelected(newSelected);
  }

  return (
    <Box
      sx={{ flexGrow: 1, alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        disabled={isDisabled}
      >
        {props.mode == ViewMode.Edit && value.items.filter(item => item.isCorrect).length > 1 && (
          <FormControl
            size="small"
          >
            <InputLabel id="mode-label">Type</InputLabel>
          
            <Select
              labelId="choice-label"
              value={value.choiceType}
              label="Choice Type"
              onChange={(e) => {
                setValue({ ... value, choiceType: e.target.value as ChoiceType });
              }}
            >
              {(Object.values(ChoiceType).map((item, index) => (
                <MenuItem
                  value={item}
                  key={index}
                >
                  {item}
                </MenuItem>
              )))}
            </Select>
          </FormControl>
        )}
        
        <RadioGroup>
          {value.items.map((item, index) => (
            <MultipleChoiceItem
              key={index}
              props={props}
              item={item}
              isRadio={value.items.filter((item) => item.isCorrect).length == 1}
              index={index}
              toggle={(item: string, toggleState: boolean) => {
                if (toggleState)
                  selectItem(item);
                else
                  unselectItem(item);
              }}
              setSelected={(item: string) => {
                setSelected([ item ]);
              }}
            />
          ))}
        </RadioGroup>

        {props.mode == ViewMode.View && (
          <>
            <br />
          
            <Button
              variant="contained"
              onClick={(e) => props.evaluateAndReply(verify(props.text, selected, value))}
              sx={{ width: '120px' }}
              disabled={isDisabled}
            >
              Submit
            </Button>
          </>
        )}
      </FormControl>
    </Box>
  );
}

function MultipleChoiceItem({ props, item, index, isRadio, toggle, setSelected }: { props: InteractionProps<InteractionType>, item: MultipleChoiceItem, index: number, isRadio: boolean, toggle: (item: string, toggleState: boolean) => void, setSelected: (value: string) => void }) {
  const [ value, setValue ] = useState(item);
  const [ isCorrect, setIsCorrect ] = useState(item.isCorrect);

  return (
    <>
      {(props.mode == ViewMode.Edit ? (
        <Stack
          direction="row"
        >
          <TextField
            label="Value"
            name="value"
            value={value}
            onChange={(e) => {
              setValue({ ... value, value: e.target.value });
            }}
          />

          <FormControlLabel label="Is Correct" control={
            <Checkbox
              name="isCorrect"
              checked={isCorrect}
              onChange={(e) => {
                setValue({ ... value, isCorrect: e.target.checked });
              }}
            />}
          />
        </Stack>
      ) : (
        <FormControlLabel
          value={item.value}
          control={(isRadio ?
          <Radio
            onChange={(e) => {
              setSelected(item.value);
            }}
          />
          :
          <Checkbox
            onChange={(e) => {
              toggle(item.value, e.target.checked);
            }}
          />)}
          label={<Markdown>{item.value}</Markdown>}
        />
      ))}
    </>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "multipleChoice",
  prettyName: "Multiple Choice",
  category: "Assessments",
  icon: CheckBox,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
