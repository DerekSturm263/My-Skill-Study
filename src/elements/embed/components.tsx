'use client'

import { ElementPackage, ElementProps, Element } from '@/lib/types/element';
import { FilterFrames } from '@mui/icons-material';
import { useState } from 'react';
import { Stack } from '@mui/material';
import { Type } from '@google/genai';

export interface ElementType extends Element {
  source: string
};

const defaultValue: ElementType = {
  source: "",
  requiresCompletion: false
}

const schema = {
  type: Type.OBJECT,
  properties: {
    source: {
      type: Type.STRING
    }
  },
  required: [
    "source"
  ],
  propertyOrdering: [
    "source"
  ]
};

function Component(props: ElementProps<ElementType>) {
  const [ isDisabled, setIsDisabled ] = useState(false);

  return (
    <Stack
      sx={{ height: "100%" }}
    >
      <iframe
        src={props.value.source}
        width="100%"
        height="100%"
      ></iframe>
    </Stack>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "embed",
  prettyName: "Embed",
  description: "Display an embed for the user to interact with. Can embed any website with a public link.",
  category: "Miscellaneous",
  icon: FilterFrames,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
