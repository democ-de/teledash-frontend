import { Link, LinkProps } from "react-router-dom";
import Tippy, { TippyProps } from "@tippyjs/react";

type TooltipLinkProps = LinkProps & {
  tippyProps: TippyProps;
};

export const TooltipLink = ({
  tippyProps,
  children,
  ...props
}: TooltipLinkProps) => {
  return (
    <Tippy {...tippyProps}>
      <Link {...props}>{children}</Link>
    </Tippy>
  );
};
