import { Button } from "../../../packages/ui/src/components/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useFontSize } from "@/app/hooks/use-font-size";

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function FontSizeControl() {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseFontSize}
              className="h-8 w-8"
              aria-label="Decrease font size"
            >
              <MinusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Decrease font size</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetFontSize}
              className="h-8 w-8 text-xs"
              aria-label="Reset font size"
            >
              <span>{fontSize}px</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset font size</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={increaseFontSize}
              className="h-8 w-8"
              aria-label="Increase font size"
            >
              <PlusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Increase font size</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
} 