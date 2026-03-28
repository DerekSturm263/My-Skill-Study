'use client'

import { Element, ElementPackage, ElementProps } from "@/lib/types/element";
import { DragHandle, FormatLineSpacing } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Type } from '@google/genai';
import { Box, FormControlLabel, Stack, Typography } from '@mui/material';
import Markdown from "react-markdown";
import ReorderList, { ReorderIcon } from "react-reorder-list";

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
  useEffect(() => {
    const newOrder = props.value.correctOrder.sort(item => Math.random() - 0.5);
    props.setValue({ ... props.value, correctOrder: newOrder });
  }, [])

  return (
    <Box
      sx={{ height: "100%", alignContent: 'center' }}
    >
      <ReorderList>
        {props.value.correctOrder.map(item => (
          <OrderingItem
            key={item}
            item={item}
          />
        ))}
      </ReorderList>
    </Box>
  );
}

function OrderingItem({ item }: { item: string }) {
  return (
    <Stack
      direction="row"
    >
      <ReorderIcon
        draggable={true}
      >
        <DragHandle />
      </ReorderIcon>

      <Typography>
        {item}
      </Typography>
    </Stack>
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
