'use client'

import verify from './functions';

import { Box, Button, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ViewMode, InteractionPackage, InteractionProps, Interaction } from '@/lib/types/general';
import { ToggleOn } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

export interface InteractionType extends Interaction {
  isCorrect: boolean
};

const defaultValue: InteractionType = {
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

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  const [ userIsCorrect, setUserIsCorrect ] = useState(false);
  const [ isDisabled, setIsDisabled ] = useState(false);

  return (
    <Box
      sx={{ height: "100%", alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        sx={{ alignItems: "center" }}
        disabled={isDisabled}
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
          onClick={(e) => props.evaluateAndReply(verify(props.text, userIsCorrect, value))}
          sx={{ width: '120px' }}
          disabled={isDisabled || props.mode == ViewMode.Edit}
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "trueOrFalse",
  prettyName: "True or False",
  description: "Ask users true or false questions. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: ToggleOn,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
