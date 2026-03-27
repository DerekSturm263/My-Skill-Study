'use client'

import verify from "./functions";

import { Box, TextField, Stack, Tooltip, InputAdornment, IconButton } from '@mui/material';
import { ViewMode, ElementProps, ElementPackage, Element } from "@/lib/types/general";
import { Done, FormatQuote } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

export interface ElementType extends Element {
  correctAnswer: string | null
};

const defaultValue: ElementType = {
  correctAnswer: null,
  requiresCompletion: true
}

const schema = {
  type: Type.OBJECT,
  properties: {
    correctAnswer: {
      type: Type.STRING
    }
  },
  propertyOrdering: [
    "correctAnswer"
  ]
};

function Component(props: ElementProps<ElementType>) {
  const [ value, setValue ] = useState(props.originalValue);
  const [ userResponse, setUserResponse ] = useState("");
  const [ isDisabled, setIsDisabled ] = useState(false);

  return (
    <Box
      sx={{ height: "100%", alignContent: 'center' }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginLeft: '150px', marginRight: '150px' }}
      >
        <TextField
          label="Write your response here"
          name="response"
          autoComplete="off"
          disabled={isDisabled || props.mode == ViewMode.Edit}
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          onSubmit={(e) => props.evaluateAndReply(verify(props.text, userResponse, value))}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">
                <Tooltip
                  title="Submit your response"
                >
                  <IconButton
                    onClick={(e) => props.evaluateAndReply(verify(props.text, userResponse, value))}
                    disabled={isDisabled || props.mode == ViewMode.Edit}
                  >
                    <Done />
                  </IconButton>
                </Tooltip>
              </InputAdornment>,
            },
          }}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
    </Box>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "shortAnswer",
  prettyName: "Short Answer",
  description: "Ask users short answer questions. An optional \"correct answer\" can be specified which the user has to match exactly if used. If not, the response will be validated automatically. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: FormatQuote,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
