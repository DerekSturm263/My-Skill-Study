'use client'

import Markdown from "react-markdown";
import verify from './functions';
import ReorderList, { ReorderIcon } from "react-reorder-list";

import { Element, ElementPackage, ElementProps } from "@/lib/types/element";
import { DragHandle, FormatLineSpacing } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Type } from '@google/genai';
import theme from "../../../app/theme";

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
    "correctOrder"
  ],
  propertyOrdering: [
    "correctOrder"
  ]
};

function Component(props: ElementProps<ElementType>) {
  useEffect(() => {
    const newOrder = props.value.correctOrder.sort(item => Math.random() - 0.5);
    props.setValue({ ... props.value, correctOrder: newOrder });
  }, [])

  return (
    <Box
      sx={{ height: "100%", alignSelf: "center", alignContent: 'center' }}
    >
      <ReorderList>
        {props.value.correctOrder.map(item => (
          <OrderingItem
            key={item}
            item={item}
            isDisabled={props.isDisabled}
          />
        ))}
      </ReorderList>

      <br />
          
      <Button
        variant="contained"
        onClick={(e) => props.evaluateAndReply(verify(props.text, [], props.value))}
        sx={{ width: '120px' }}
        disabled={props.isDisabled}
      >
        Submit
      </Button>
    </Box>
  );
}

function OrderingItem({ item, isDisabled }: { item: string, isDisabled: boolean }) {
  return (
    <ReorderIcon
      draggable={!isDisabled}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ height: '56px', alignItems: "center" }}
      >
        <DragHandle
          sx={{ color: (theme) => isDisabled ? theme.palette.text.disabled : theme.palette.text.primary }}
        />

        <Typography
          component={Markdown}
          sx={{ color: (theme) => isDisabled ? theme.palette.text.disabled : theme.palette.text.primary }}
        >
          {item}
        </Typography>
      </Stack>
    </ReorderIcon>
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
