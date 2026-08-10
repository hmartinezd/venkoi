import { Button } from '@/components/ui/Button';
import { PUBLIC_CONTACT, buildEmailUrl, buildWhatsAppUrl } from '@/lib/contact';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { EmailIcon } from '@/components/icons/EmailIcon';

type DirectContactChannelsProps = {
  whatsappMessage: string;
  whatsappLabel: string;
  whatsappAriaLabel: string;
  emailLabel?: string;
  emailAriaLabel?: string;
  emailSubject?: string;
  showEmail?: boolean;
  showEmailAddress?: boolean;
  variant?: 'panel' | 'compact' | 'inline';
  className?: string;
};

export function DirectContactChannels({
  whatsappMessage,
  whatsappLabel,
  whatsappAriaLabel,
  emailLabel,
  emailAriaLabel,
  emailSubject,
  showEmail = true,
  showEmailAddress = false,
  variant = 'inline',
  className
}: DirectContactChannelsProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        variant === 'panel' && 'grid gap-3 sm:grid-cols-2',
        variant === 'inline' && 'flex flex-col items-stretch gap-3 sm:flex-row sm:items-center',
        variant === 'compact' && 'flex flex-wrap items-center gap-x-4 gap-y-2',
        className
      )}
    >
      {isCompact ? (
        <a
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappAriaLabel}
          className="inline-flex items-center gap-2 rounded-sm font-medium text-ink outline-none transition hover:text-orange focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
        >
          <WhatsAppIcon className="h-[18px] w-[18px] shrink-0" />
          {whatsappLabel}
        </a>
      ) : (
        <Button
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappAriaLabel}
          variant="primary"
          className="min-h-11 gap-2"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          {whatsappLabel}
        </Button>
      )}

      {showEmail && emailLabel && emailAriaLabel && emailSubject ? (
        isCompact ? (
          <a
            href={buildEmailUrl(emailSubject)}
            aria-label={emailAriaLabel}
            className="inline-flex items-center gap-2 rounded-sm font-medium text-ink outline-none transition hover:text-orange focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
          >
            <EmailIcon className="h-[18px] w-[18px] shrink-0" />
            {emailLabel}
          </a>
        ) : (
          <Button
            href={buildEmailUrl(emailSubject)}
            aria-label={emailAriaLabel}
            variant="secondary"
            className="min-h-11 gap-2"
          >
            <EmailIcon className="h-5 w-5 shrink-0" />
            <span className="flex min-w-0 flex-col items-center">
              <span>{emailLabel}</span>
              {showEmailAddress ? (
                <span className="max-w-full break-all text-xs font-normal text-foreground-muted">
                  {PUBLIC_CONTACT.email}
                </span>
              ) : null}
            </span>
          </Button>
        )
      ) : null}
    </div>
  );
}
