'use client'

import { LinearProgress, LinearProgressProps, Stack, Typography } from "@mui/material";

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
