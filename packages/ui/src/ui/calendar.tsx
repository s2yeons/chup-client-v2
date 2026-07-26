'use client';

import * as React from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { type ChevronProps, DayPicker } from 'react-day-picker';

import { cn } from '../lib/utils';

function Calendar({
  className,
  classNames,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={{
        month_caption: 'flex h-8 items-center justify-center px-8',
        day_button: 'flex size-8 items-center justify-center rounded-md text-sm',
        selected: 'bg-primary text-primary-foreground',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }: ChevronProps) =>
          orientation === 'left' ? (
            <ChevronLeftIcon {...iconProps} />
          ) : (
            <ChevronRightIcon {...iconProps} />
          ),
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
