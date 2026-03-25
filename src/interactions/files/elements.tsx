'use client'

import Image from 'next/image';

import { ViewMode, InteractionProps, InteractionPackage, Interaction } from "@/lib/types/general";
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { Delete, Folder } from '@mui/icons-material';
import { useState } from "react";
import { Type } from '@google/genai';

export interface InteractionType extends Interaction {
  files: File[]
};

type File = {
  source: string,
  isDownloadable: boolean
};

const defaultValue: InteractionType = {
  files: [
    {
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

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);

  function addFile() {
    const newFiles = value.files;
    newFiles.push({
      source: "",
      isDownloadable: false
    });

    setValue({ ... value, files: newFiles });
  }

  function removeFile(index: number) {
    const newFiles = value.files;
    newFiles.splice(index, 1);

    setValue({ ... value, files: newFiles });
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
        {value.files.map((item, index) => (
          <FileItem
            key={index}
            props={props}
            item={item}
            index={index}
            removeItem={removeFile}
          />
        ))}
      </Stack>

      {props.mode == ViewMode.Edit && (
        <Button
          onClick={(e) => { addFile() }}
          variant="contained"
        >
          Add File
        </Button>
      )}
    </Box>
  );
}

function FileItem({ props, item, index, removeItem }: { props: InteractionProps<InteractionType>, item: File, index: number, removeItem: (index: number) => void }) {
  const [ value, setValue ] = useState(item);
  
  const extension = value.source.substring(value.source.length - 3);

  return (
    <Stack>
      {props.mode == ViewMode.Edit && (
        <>
          <TextField
            label="Source"
            autoComplete="off"
            value={value.source}
            onChange={(e) => {
              setValue({ ... value, source: e.target.value });
            }}
          />

          <IconButton
            onClick={(e) => {}}
          >
            <Delete />
          </IconButton>
        </>
      )}
      
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

const interaction: InteractionPackage<InteractionType> = {
  id: "files",
  prettyName: "Files",
  category: "Miscellaneous",
  icon: Folder,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
