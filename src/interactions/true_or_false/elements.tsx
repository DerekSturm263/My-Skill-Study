'use client'

import verify from './functions';

import { Box,  Button, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ComponentMode, InteractionPackage, InteractionProps } from '@/lib/types';
import { ToggleOn } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

import * as helpers from '@/lib/helpers';

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

function Component(props: InteractionProps) {
  const [ isCorrect, setIsCorrect ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).isCorrect);
  const [ userIsCorrect, setUserIsCorrect ] = useState(false);

  async function submit() {
    props.setIsThinking(true);

    const feedback = await verify(props.originalText, userIsCorrect, helpers.getInteractionValue<InteractionType>(props.elementID));
    props.setText(feedback.feedback);
    props.setIsThinking(false);

    if (feedback.isValid) {
      props.setComplete(true);
    }
  }

  return (
    <Box
      sx={{ flexGrow: 1, alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        id={`interaction${helpers.getAbsoluteIndex(props.elementID)}`}
        className='multipleOptions'
        sx={{ alignItems: "center" }}
        disabled={props.isDisabled}
      >
        <RadioGroup
          defaultValue=""
          name="true-false-group"
          value={props.mode == ComponentMode.Edit ? isCorrect : userIsCorrect}
          onChange={(e) => {
            const isCorrect = e.target.value == "true";

            if (props.mode == ComponentMode.Edit) {
              setIsCorrect(isCorrect);
              helpers.getInteractionValue<InteractionType>(props.elementID).isCorrect = isCorrect;
            } else {
              setUserIsCorrect(e.target.value == "true");
            }
          }}
        >
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>

        {props.mode == ComponentMode.View && (
          <>
            <br />
          
            <Button
              variant="contained"
              onClick={(e) => submit()}
              sx={{ width: '120px' }}
              disabled={props.isDisabled}
            >
              Submit
            </Button>
          </>
        )}
      </FormControl>
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "trueOrFalse",
  prettyName: "True or False",
  category: "Assessments",
  icon: ToggleOn,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
