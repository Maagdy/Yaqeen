export const processHadithText = (text: string) => {
  if (!text) return "";

  let processed = text;

  processed = processed.replace(
    /\[narrator\s+id="(\d+)"\s+tooltip="([^"]+)"\]([\s\S]*?)\[\/narrator\]/g,
    '<span class="text-primary font-semibold cursor-help border-b border-primary/20 hover:border-primary transition-colors" title="$2">$3</span>',
  );

  processed = processed.replace(
    /\[narrator\]([\s\S]*?)\[\/narrator\]/g,
    '<span class="text-primary font-semibold">$1</span>',
  );

  processed = processed.replace(
    /\[prematn\]([\s\S]*?)\[\/prematn\]/g,
    '<span class="text-muted-foreground block mb-3 leading-loose">$1</span>',
  );

  processed = processed.replace(
    /\[matn\]([\s\S]*?)\[\/matn\]/g,
    '<span class="font-medium text-foreground block leading-loose text-lg">$1</span>',
  );

  return processed;
};
