'use client'

import { LinearProgress, LinearProgressProps, Stack, Typography } from "@mui/material";

function WordWrapper({ children }: { children?: React.ReactNode }) {
  async function define(word: string) {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  
    if (!response.ok) {
      console.error(`Could not define ${word}`);
    }

    const data = JSON.parse(await response.json());
    // TODO: Return defintion in dialog box
  }

  return (
    <>
      {/*{text.split(/\s+/).map((word, i) => (
        <span
          key={i}
          className="word"
          onDoubleClick={(e) => define(word)}
          title="Double click to define this word"
          style={{"--index": `${globalIndex++ / 8}s`} as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}*/}
    </>
  );
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Stack
      sx={{ display: 'flex', alignItems: 'center' }}
      style={{ margin: 'auto' }}
    >
      <LinearProgress
        {...props}
      />

      <Typography
        variant="body2"
      >
        {`${Math.round(props.value)}% Complete`}
      </Typography>
    </Stack>
  );
}
