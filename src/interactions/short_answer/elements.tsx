'use client'

import verify from "./functions";

import { ViewMode, InteractionProps, InteractionPackage } from "@/lib/types/general";
import { Box, TextField, Button, Stack } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

export type InteractionType = {
  correctAnswer: string | null
};

const defaultValue: InteractionType = {
  correctAnswer: null
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

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  const [ userResponse, setUserResponse ] = useState("");
  const [ isDisabled, setIsDisabled ] = useState(false);

  return (
    <Box
      sx={{ flexGrow: 1, alignContent: 'center' }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginLeft: '150px', marginRight: '150px' }}
      >
        {props.mode == ViewMode.Edit ? (
          <TextField
            label="Correct Answer"
            name="correctAnswer"
            autoComplete="off"
            value={value.correctAnswer}
            onChange={(e) => {
              const newCorrectAnswer = e.target.value === "" ? null : e.target.value;
              setValue({ ... value, correctAnswer: newCorrectAnswer });
            }}
            sx={{ flexGrow: 1, marginLeft: '150px', marginRight: '150px' }}
          />
        ) : (
          <>
            <TextField
              label="Write your response here"
              name="response"
              autoComplete="off"
              disabled={isDisabled}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              sx={{ flexGrow: 1 }}
            />

            <Button
              variant="contained"
              onClick={(e) => props.evaluateAndReply(verify(props.text, userResponse, value))}
              sx={{ width: '120px' }}
              disabled={isDisabled}
            >
              Submit
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "shortAnswer",
  prettyName: "Short Answer",
  category: "Assessments",
  icon: FormatQuote,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
