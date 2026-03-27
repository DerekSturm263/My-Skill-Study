'use client'

import { Element, ElementPackage, ElementProps } from "@/lib/types/element";
import { FormatLineSpacing } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface ElementType extends Element {
  correctOrder: string[]
};

const defaultValue: ElementType = {
  correctOrder: [
    "New Item"
  ],
  requiresCompletion: true
}

const schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      minItems: 2,
      maxItems: 6
    }
  },
  required: [
    "items"
  ],
  propertyOrdering: [
    "items"
  ]
};

function Component(props: ElementProps<ElementType>) {
  const [ value, setValue ] = useState(props.originalValue);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  return (
    <Box
      sx={{ height: "100%", alignContent: 'center' }}
    >
      
    </Box>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "ordering",
  prettyName: "Ordering",
  description: "Let users order a list of text. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: FormatLineSpacing,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
