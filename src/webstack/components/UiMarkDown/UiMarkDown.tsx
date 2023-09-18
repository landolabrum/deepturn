import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface UiMarkdownProps {
  markdownString: string;
}

const UiMarkdown: React.FC<UiMarkdownProps> = ({ markdownString }) => {
  const renderers = {
    // Customize the rendering of <p> tags
    paragraph: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  };

  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} renderers={renderers}>
      {markdownString}
    </ReactMarkdown>
  );
};

export default UiMarkdown;
