import { useState } from "react";
import clsx from "clsx";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTimeout } from "../hooks";

export type FuseCircularLoadingProps = {
  delay?: number;
  className?: string;
  size?: number;
};

/**
 * FuseCircularLoading displays a centered CircularProgress with optional delay
 */
function CircularLoading({
  delay = 0,
  className,
  size = 40,
}: FuseCircularLoadingProps) {
  const [showLoading, setShowLoading] = useState(!delay);

  useTimeout(() => {
    setShowLoading(true);
  }, delay);

  return (
    <div
      className={clsx(
        className,
        "flex flex-1 min-h-full h-full w-full items-center justify-center p-6",
        !showLoading && "hidden"
      )}
    >
      <Box>
        <CircularProgress size={size} />
      </Box>
    </div>
  );
}

export default CircularLoading;
