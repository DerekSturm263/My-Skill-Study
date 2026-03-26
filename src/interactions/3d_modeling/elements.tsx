'use client'

import { Interaction, InteractionPackage, InteractionProps } from '@/lib/types/general';
import { Landscape } from '@mui/icons-material';
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
      sx={{ height: "100%" }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "3dModeling",
  prettyName: "3D Modeling",
  description: "Let users create 3D models in a workspace. Feedback will be generated for the user based on their work.",
  category: "Art",
  icon: Landscape,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
