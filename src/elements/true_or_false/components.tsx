'use client'

import verify from './functions';

import { Box, Button, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ElementPackage, ElementProps, Element } from '@/lib/types/element';
import { ToggleOn } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

export interface ElementType extends Element {
  isCorrect: boolean
};

const defaultValue: ElementType = {
  isCorrect: true,
  requiresCompletion: true
}

const schema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "isCorrect"
  ],
  propertyOrdering: [
    "isCorrect"
  ]
};

function Component(props: ElementProps<ElementType>) {
  const [ userIsCorrect, setUserIsCorrect ] = useState(false);

  return (
    <Box
      sx={{ height: "100%", alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        sx={{ alignItems: "center" }}
        disabled={props.isDisabled}
      >
        <RadioGroup
          defaultValue=""
          name="true-false-group"
          value={userIsCorrect}
          onChange={(e) => {
            setUserIsCorrect(e.target.value == "true");
          }}
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="True"
          />
          
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="False"
          />
        </RadioGroup>

        <br />
          
        <Button
          variant="contained"
          onClick={(e) => props.evaluateAndReply(verify(props.text, userIsCorrect, props.value))}
          sx={{ width: '120px' }}
          disabled={props.isDisabled}
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "trueOrFalse",
  prettyName: "True or False",
  description: "Ask users true or false questions. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: ToggleOn,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
