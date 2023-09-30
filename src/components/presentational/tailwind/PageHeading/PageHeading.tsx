import { Anchor } from '@/components/Anchor';
import { T } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';

type PageHeadingProps = {
  title: string;
  subTitle?: string;
  actions?: React.ReactNode;
  titleHref?: string;
  titleClassName?: string;
  subTitleClassName?: string;
};

export function PageHeading({
  title,
  subTitle,
  titleHref,
  actions,
  titleClassName,
  subTitleClassName,
}: PageHeadingProps) {
  const titleElement = (
    <T.H2 className={cn('border-none', titleClassName)}>{title}</T.H2>
  );
  const subTitleElement = (
    <T.P className={cn('text-muted-foreground leading-6', subTitleClassName)}>
      {subTitle}
    </T.P>
  );
  const wrappedTitleElement = titleHref ? (
    <Anchor href={titleHref}>{titleElement}</Anchor>
  ) : (
    <div className="w-[480px]">
      {titleElement}
      {subTitleElement}
    </div>
  );
  return (
    <div className="md:flex md:items-start md:justify-between">
      <div className="min-w-0 flex-1">{wrappedTitleElement}</div>
      <div>{actions}</div>
    </div>
  );
}
