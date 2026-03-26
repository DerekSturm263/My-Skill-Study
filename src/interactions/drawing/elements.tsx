'use client'

import { Interaction, InteractionPackage, InteractionProps } from '@/lib/types/general';
import { useState } from 'react';
import { Brush } from '@mui/icons-material';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface InteractionType extends Interaction {
  placeholder: boolean
};

const defaultValue: InteractionType = {
  placeholder: false,
  requiresCompletion: true
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
      sx={{ height: "100%" }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "drawing",
  prettyName: "Drawing",
  description: "Let users create drawings on a canvas. Feedback will be generated for the user based on their work.",
  category: "Art",
  icon: Brush,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
