'use client'

import { InteractionPackage, InteractionProps } from '@/lib/types';
import { GraphicEq } from '@mui/icons-material';
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

function Component(props: InteractionProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "daw",
  prettyName: "Digital Audio Workstation",
  category: "Audio",
  icon: GraphicEq,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
