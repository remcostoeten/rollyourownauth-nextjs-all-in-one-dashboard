'use client';

import { FontSizeControl } from "./font-size-control";


export function CustomNav(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex items-center justify-between w-full">
      <nav {...props} />
      <div className="flex items-center gap-2">
        <FontSizeControl />
      </div>
    </div>
  );
} 