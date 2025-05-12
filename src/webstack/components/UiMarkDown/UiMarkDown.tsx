import React, { createElement, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import styles from "./UiMarkDown.scss"

export interface UiMarkdownProps {
  text: string;
  color?: string; // Optional prop for text color
  jsxClass?: string; // Optional prop for text color
}

export interface UiMarkdownLabel {
  label: UiMarkdownProps;
}

const UiMarkdown: React.FC<UiMarkdownProps> = ({ text, color, jsxClass }) => {
  const plug: any = rehypeRaw;

  return (
    <>
      <ReactMarkdown
        rehypePlugins={[plug]}
        components={{
          p: ({ node, ...props }) => {
            props.children = Object.values(props?.children).map((e: any, key: number) => {
              if (e?.type) {
                const TagName: any = `${e.type}`;
                e = (
                  <React.Fragment key={key}>
                    <style jsx>{styles}</style>
                    <span>
                      <TagName>
                        {e?.props?.children?.[0]}
                      </TagName>
                    </span>
                  </React.Fragment>
                );
              }
              return e;
            });
            return (
              <div className="ui-mark-down" style={{ color: color }} {...props} />
            );
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </>
  );
};

export default UiMarkdown;
