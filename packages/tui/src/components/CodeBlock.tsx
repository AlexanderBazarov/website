import { useState } from 'react';
import styled from 'styled-components';
import { Icon } from './Icon';

const Wrap = styled.div`
  border: 1px solid var(--border);
  background: var(--bg-inset);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 10px;
  color: var(--fg-faint);
  border-bottom: 1px solid var(--border-soft);
`;

const Copy = styled.button`
  margin-left: auto;
  color: var(--fg-faint);

  &:hover {
    color: var(--accent);
  }
`;

const Body = styled.pre`
  margin: 0;
  padding: 8px 10px;
  overflow-x: auto;
  color: var(--fg);
`;

const Prompt = styled.span`
  color: var(--green);
  user-select: none;
`;

export interface CodeBlockProps {
  code: string;
  lang?: string;
  shell?: boolean;
  copyable?: boolean;
}

export function CodeBlock({ code, lang = 'text', shell, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <Wrap>
      <Head>
        <span>{lang}</span>
        {copyable && (
          <Copy type="button" onClick={copy} title="скопировать" aria-label="скопировать">
            {copied ? <Icon name="check" /> : <Icon name="copy" />}
          </Copy>
        )}
      </Head>
      <Body>
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i}>
              {shell && <Prompt>$ </Prompt>}
              {line}
            </div>
          ))}
        </code>
      </Body>
    </Wrap>
  );
}
