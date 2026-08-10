import Image from 'next/image';

type IconProps = {
  className?: string;
};

export function WhatsAppBrandIcon({ className }: IconProps) {
  return (
    // The visible link text supplies the accessible name; this official brand glyph is decorative.
    <Image
      src="/brand/third-party/whatsapp.svg"
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
      unoptimized
      className={className}
    />
  );
}
