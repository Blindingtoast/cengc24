import React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-card text-card-foreground shadow-sm",
        className
      )}
      {...otherProps}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-4", className)}
      {...otherProps}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "text-lg font-bold leading-none tracking-tight p-4",
        className
      )}
      {...otherProps}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...otherProps}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div ref={ref} className={cn("p-4 pt-0", className)} {...otherProps} />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-4 pt-0", className)}
      {...otherProps}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
