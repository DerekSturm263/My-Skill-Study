'use client'

import { Element, ElementPackage, ElementProps } from '@/lib/types/general';
import { GraphicEq } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface ElementType extends Element {
  placeholder: boolean
};

const defaultValue: ElementType = {
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

function Component(props: ElementProps<ElementType>) {
  const [ value, setValue ] = useState(props.originalValue);
  
  return (
    <Box
      sx={{ height: "100%" }}
    >
      
    </Box>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "daw",
  prettyName: "DAW",
  description: "Let users create music using a digital audio workstation. Feedback will be generated for the user based on their work.",
  category: "Audio",
  icon: GraphicEq,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
