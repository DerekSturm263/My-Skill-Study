import { Typography } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MySkillStudy',
    default: 'MySkillStudy',
  },
  description: 'Learn anything by taking courses, practicing skills, and creating projects.',
}

export default async function Home() {
  return (
    <div>
      <main>
        <Typography
          variant="h3"
        >
          {`Welcome back, ${"username"}. Let's get learning`}
        </Typography>
      </main>
    </div>
  );
}
