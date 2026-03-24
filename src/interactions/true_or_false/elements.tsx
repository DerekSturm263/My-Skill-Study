'use client'

import verify from './functions';

import { Box, Button, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ViewMode, InteractionPackage, InteractionProps } from '@/lib/types/general';
import { ToggleOn } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

export type InteractionType = {
  isCorrect: boolean
};

const defaultValue: InteractionType = {
  isCorrect: true
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
      sx={{ flexGrow: 1, alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        sx={{ alignItems: "center" }}
        disabled={isDisabled}
      >
        <RadioGroup
          defaultValue=""
          name="true-false-group"
          value={props.mode == ViewMode.Edit ? value.isCorrect : userIsCorrect}
          onChange={(e) => {
            if (props.mode == ViewMode.Edit) {
              setValue({ ... value, isCorrect: e.target.value == "true" });
            } else {
              setUserIsCorrect(e.target.value == "true");
            }
          }}
        >
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>

        {props.mode == ViewMode.View && (
          <>
            <br />
          
            <Button
              variant="contained"
              onClick={(e) => props.evaluateAndReply(verify(props.text, userIsCorrect, value))}
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

const interaction: InteractionPackage<InteractionType> = {
  id: "trueOrFalse",
  prettyName: "True or False",
  category: "Assessments",
  icon: ToggleOn,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
