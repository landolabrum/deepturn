import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import styles from "./UiMarkDown.scss";

export interface UiMarkdownProps {
  /** Raw markdown text that may include placeholders like {{name}} or {{user.first}} */
  text: string;
  /** Optional text color */
  color?: string;
  /** Optional class name */
  jsxClass?: string;
  /** Variables to interpolate into the markdown */
  variables?: Record<string, unknown>;
  /**
   * If true, unknown variables are replaced with an empty string.
   * If false (default), unknown variables are left as-is, e.g. {{missing}}.
   */
  strict?: boolean;
  /**
   * Custom delimiters if you don't want {{ }}. Example: ['${', '}'] -> ${name}
   */
  delimiters?: [string, string];
}

export interface UiMarkdownLabel {
  label: UiMarkdownProps;
}

const DEFAULT_DELIMS: [string, string] = ['{{', '}}'];

/** Safely resolve a dot-path (e.g., "user.name.first") against an object */
function resolvePath(obj: any, path: string): unknown {
  if (!obj) return undefined;
  // allow bracket access as well: user.addresses[0].city
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (const p of parts) {
    if (p === '') continue;
    if (cur != null && Object.prototype.hasOwnProperty.call(cur, p)) {
      cur = (cur as any)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

/**
 * Interpolate variables into a template, skipping code blocks and inline code.
 * - Supports {{var}} (or custom delimiters)
 * - Escaped delimiters like \{{name}} are preserved (no replacement, backslash removed)
 * - Skips fenced code blocks ```...``` and inline code `...`
 */
function interpolateTemplate(
  template: string,
  vars: Record<string, unknown> = {},
  opts?: { strict?: boolean; delimiters?: [string, string] }
): string {
  const { strict = false, delimiters = DEFAULT_DELIMS } = opts || {};
  const [open, close] = delimiters;

  // Build a safe regex for the delimiters:
  const esc = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const re = new RegExp(
    // negative lookbehind for backslash to allow escaping like \{{var}}
    String.raw`(?<!\\)` + esc(open) + String.raw`\s*([a-zA-Z0-9_.$\[\]-]+)\s*` + esc(close),
    'g'
  );
  const unescapeDelims = new RegExp(String.raw`\\` + esc(open), 'g');

  // Split into segments that are "replaceable" vs "code"
  // 1) Fenced code blocks ```...```
  // 2) Inline code `...`
  // We’ll replace only in the non-code segments.
  const segments: Array<{ text: string; replace: boolean }> = [];
  let i = 0;

  while (i < template.length) {
    // fenced code block
    if (template.startsWith('```', i)) {
      const end = template.indexOf('\n```', i + 3);
      if (end !== -1) {
        // include closing fence
        const block = template.slice(i, end + 4);
        segments.push({ text: block, replace: false });
        i = end + 4;
        continue;
      }
    }
    // inline code
    if (template[i] === '`') {
      const end = template.indexOf('`', i + 1);
      if (end !== -1) {
        const inline = template.slice(i, end + 1);
        segments.push({ text: inline, replace: false });
        i = end + 1;
        continue;
      }
    }
    // normal text until next code marker
    const nextFence = template.indexOf('```', i);
    const nextInline = template.indexOf('`', i);
    const next = [nextFence, nextInline].filter(n => n !== -1);
    const end = next.length ? Math.min(...next) : template.length;
    const normal = template.slice(i, end);
    segments.push({ text: normal, replace: true });
    i = end;
  }

  const replaced = segments
    .map(seg => {
      if (!seg.replace) {
        // Still unescape escaped open delimiters inside code for visual correctness
        return seg.text.replace(unescapeDelims, open);
      }
      return seg.text
        .replace(re, (_m, path: string) => {
          const val = resolvePath(vars, path);
          if (val === undefined || val === null) {
            return strict ? '' : `${open}${path}${close}`;
          }
          // Convert non-strings to string safely
          return typeof val === 'string' ? val : String(val);
        })
        .replace(unescapeDelims, open);
    })
    .join('');

  return replaced;
}

const UiMarkdown: React.FC<UiMarkdownProps> = ({
  text,
  color,
  jsxClass,
  variables,
  strict,
  delimiters
}) => {
  const plug: any = rehypeRaw;

  const processedText = useMemo(
    () => interpolateTemplate(text ?? '', variables ?? {}, { strict, delimiters }),
    [text, variables, strict, delimiters]
  );

  return (
    <>
      <ReactMarkdown
        rehypePlugins={[plug]}
        components={{
          p: ({ node, ...props }) => {
            // original behavior: wrap child elements with their tag names
            props.children = Object.values(props?.children).map((e: any, key: number) => {
              if (e?.type) {
                const TagName: any = `${e.type}`;
                e = (
                  <React.Fragment key={key}>
                    <style jsx>{styles}</style>
                    <span>
                      <TagName>{e?.props?.children?.[0]}</TagName>
                    </span>
                  </React.Fragment>
                );
              }
              return e;
            });
            return <div className={`ui-mark-down ${jsxClass ?? ''}`} style={{ color }} {...props} />;
          }
        }}
      >
        {processedText}
      </ReactMarkdown>
    </>
  );
};

export default UiMarkdown;
