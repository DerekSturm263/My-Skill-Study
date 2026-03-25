'use client'

import { ViewMode, InteractionPackage, InteractionProps, Interaction } from '@/lib/types/general';
import { Stack, TextField } from '@mui/material';
import { FilterFrames } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';

export interface InteractionType extends Interaction {
  source: string
};

const defaultValue: InteractionType = {
  source: "",
  requiresCompletion: false
}

const schema = {
  type: Type.OBJECT,
  properties: {
    source: {
      type: Type.STRING
    }
  },
  required: [
    "source"
  ],
  propertyOrdering: [
    "source"
  ]
};

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  const [ isDisabled, setIsDisabled ] = useState(false);

  return (
    <Stack
      sx={{ height: "100%" }}
    >
      {props.mode == ViewMode.Edit && (
        <TextField
          label="Source"
          name="source"
          autoComplete="off"
          disabled={isDisabled}
          value={value.source}
          onChange={(e) => {
            setValue({ ... value, source: e.target.value });
          }}
        />
      )}

      <iframe
        src={value.source}
        width="100%"
        height="100%"
      ></iframe>
    </Stack>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "iframe",
  prettyName: "IFrame",
  category: "Miscellaneous",
  icon: FilterFrames,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
