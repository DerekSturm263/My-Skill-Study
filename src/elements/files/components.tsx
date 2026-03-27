'use client'

import Image from 'next/image';

import { ElementProps, ElementPackage, Element } from "@/lib/types/element";
import { Box, Button, Stack } from '@mui/material';
import { useState } from "react";
import { Folder } from '@mui/icons-material';
import { Type } from '@google/genai';

export interface ElementType extends Element {
  files: File[]
};

type File = {
  name: string,
  source: string,
  isDownloadable: boolean
};

const defaultValue: ElementType = {
  files: [
    {
      name: "New File",
      source: "",
      isDownloadable: false
    }
  ],
  requiresCompletion: false
}

const schema = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: {
            type: Type.STRING
          },
          isDownloadable: {
            type: Type.BOOLEAN
          }
        },
        required: [
          "source",
          "isDownloadable"
        ],
        propertyOrdering: [
          "source",
          "isDownloadable"
        ]
      },
      minItems: 1,
      maxItems: 3
    }
  },
  required: [
    "files"
  ],
  propertyOrdering: [
    "files"
  ]
};

function Component(props: ElementProps<ElementType>) {
  function addFile() {
    const newFiles = props.currentValue.files;
    newFiles.push(defaultValue.files[0]);

    props.setCurrentValue({ ... props.currentValue, files: newFiles });
  }

  function removeFile(index: number) {
    const newFiles = props.currentValue.files;
    newFiles.splice(index, 1);

    props.setCurrentValue({ ... props.currentValue, files: newFiles });
  }

  return (
    <Box
      sx={{ height: "100%", alignSelf: "center", alignContent: "center" }}
    >
      <Stack
        sx={{ flexGrow: 1, justifyContent: 'center' }}
        direction="row"
        spacing={2}
      >
        {props.currentValue.files.map((item, index) => (
          <FileItem
            key={item.name} // TODO: Replace with constant ID. File names can change!
            props={props}
            item={item}
            index={index}
            removeItem={removeFile}
          />
        ))}
      </Stack>
    </Box>
  );
}

function FileItem({ props, item, index, removeItem }: { props: ElementProps<ElementType>, item: File, index: number, removeItem: (index: number) => void }) {
  const [ value, setValue ] = useState(item);
  
  const extension = value.source.substring(value.source.length - 3);

  return (
    <Stack>
      {extension == "png" ? (
        <Image
          src={value.source}
          alt={value.source}
        />
      ) : extension == "mp4" ? (
        <video
          src={value.source}
          controls
        ></video>
      ) : extension == "mp3" ? (
        <audio
          src={value.source}
          controls
        ></audio>
      ) : (
        <></>
      )}

      {value.isDownloadable && (
        <Button
          onClick={(e) => removeItem(index)}
        >
          Download
        </Button>
      )}
    </Stack>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "files",
  prettyName: "Files",
  description: "Provide files for the user to view and optionally download. Certain file types are viewable without downloading.",
  category: "Miscellaneous",
  icon: Folder,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
