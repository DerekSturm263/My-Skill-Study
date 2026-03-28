'use client'

import Markdown from 'react-markdown';
import verify from './functions';

import { Box, Button, Radio, RadioGroup, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { ElementProps, ElementPackage, Element } from '@/lib/types/element';
import { useEffect, useState } from 'react';
import { CheckBox } from '@mui/icons-material';
import { Type } from '@google/genai';

export interface ElementType extends Element {
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

const defaultValue: ElementType = {
  items: [
    {
      value: "New Item",
      isCorrect: true
    }
  ],
  choiceType: ChoiceType.NeedsAllCorrect,
  requiresCompletion: true
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

function Component(props: ElementProps<ElementType>) {
  const [ selected, setSelected ] = useState([ ] as string[]);

  useEffect(() => {
    const newItems = props.value.items.toSorted((item1, item2) => Math.random() - 0.5);
    props.setValue({ ... props.value, items: newItems });
  }, []);

  function addItem() {
    const newItems = props.value.items;
    newItems.push({
      value: "New Multiple Choice Item",
      isCorrect: false
    });

    props.setValue({ ... props.value, items: newItems });
  }

  function removeItem(index: number) {
    const newItems = props.value.items;
    newItems.splice(index, 1);

    props.setValue({ ... props.value, items: newItems });
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
      sx={{ height: "100%", alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        disabled={props.isDisabled}
      >
        <RadioGroup>
          {props.value.items.map((item, index) => (
            <MultipleChoiceItem
              key={item.value}
              props={props}
              item={item}
              isRadio={props.value.items.filter((item) => item.isCorrect).length == 1}
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

        <br />
          
        <Button
          variant="contained"
          onClick={(e) => props.evaluateAndReply(verify(props.text, selected, props.value))}
          sx={{ width: '120px' }}
          disabled={props.isDisabled}
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
}

function MultipleChoiceItem({ props, item, index, isRadio, toggle, setSelected }: { props: ElementProps<ElementType>, item: MultipleChoiceItem, index: number, isRadio: boolean, toggle: (item: string, toggleState: boolean) => void, setSelected: (value: string) => void }) {
  const [ value, setValue ] = useState(item);
  const [ isCorrect, setIsCorrect ] = useState(item.isCorrect);

  return (
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
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "multipleChoice",
  prettyName: "Multiple Choice",
  description: "Ask users multiple choice questions. Can be configured to make certain responses optional or for multiple to be required. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: CheckBox,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
