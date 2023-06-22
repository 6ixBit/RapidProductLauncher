'use client';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({ ...props }: ButtonProps) {
  return <button {...props}></button>;
}
