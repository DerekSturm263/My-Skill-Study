'use client'

import { Interaction, InteractionPackage, InteractionProps } from '@/lib/types/general';
import { GraphicEq } from '@mui/icons-material';
import { useState } from 'react';
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
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "daw",
  prettyName: "Digital Audio Workstation",
  category: "Audio",
  icon: GraphicEq,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
