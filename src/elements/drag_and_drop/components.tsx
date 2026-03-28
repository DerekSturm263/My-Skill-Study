'use client'

import { Element, ElementPackage, ElementProps } from '@/lib/types/element';
import { useState } from 'react';
import { PanTool } from '@mui/icons-material';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface ElementType extends Element {
  groups: Group[]
};

export type Group = {
  items: string[]
}

const defaultValue: ElementType = {
  groups: [
    {
      items: [
        "New Item"
      ]
    }
  ],
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
  return (
    <Box
      sx={{ height: "100%" }}
    >
      
    </Box>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "dragAndDrop",
  prettyName: "Drag and Drop",
  description: "Let users drag and drop values into different categories. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: PanTool,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
