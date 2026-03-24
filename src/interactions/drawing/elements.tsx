'use client'

import { InteractionPackage, InteractionProps } from '@/lib/types/general';
import { useState } from 'react';
import { Brush } from '@mui/icons-material';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export type InteractionType = {
  placeholder: boolean
};

const defaultValue: InteractionType = {
  placeholder: false
}

const schema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [

  ]
};

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "drawing",
  prettyName: "Drawing",
  category: "Art",
  icon: Brush,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
