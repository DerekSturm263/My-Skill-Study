'use client'

import { Element, ElementPackage, ElementProps } from '@/lib/types/element';
import { useState } from 'react';
import { Brush } from '@mui/icons-material';
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
  id: "drawing",
  prettyName: "Drawing",
  description: "Let users create drawings on a canvas. Feedback will be generated for the user based on their work.",
  category: "Art",
  icon: Brush,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
