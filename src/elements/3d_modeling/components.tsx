'use client'

import { Element, ElementPackage, ElementProps } from '@/lib/types/element';
import { Landscape } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface InteractionType extends Element {
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

function Component(props: ElementProps<InteractionType>) {
  return (
    <Box
      sx={{ height: "100%" }}
    >
      
    </Box>
  );
}

const elementPackage: ElementPackage<InteractionType> = {
  id: "3dModeling",
  prettyName: "3D Modeling",
  description: "Let users create 3D models in a workspace. Feedback will be generated for the user based on their work.",
  category: "Art",
  icon: Landscape,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
