import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  LOCALES,
  navViews,
  useI18n,
  useKeymap,
  useRouter,
  type Binding,
  type I18nText,
} from '@mystyte/core';
import {
  CommandLine,
  HelpBody,
  HelpGrid,
  Heading,
  Kbd,
  LangSwitch,
  Overlay,
  Text,
} from '@mystyte/tui';
import { profile } from '../content/profile';
import { runCommand } from './commands';
import { shortcuts, ui } from './strings';
import { pathLabel } from './ViewHost';
import { WM } from './Wm';

export function App() {
  const { locale, setLocale, t } = useI18n();
  const { path, open } = useRouter();

  const [helpOpen, setHelpOpen] = useState(false);
  const [message, setMessage] = useState<I18nText | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);

  const nav = useMemo(() => navViews(), []);
  const label = pathLabel(path, { locale, t });

  useEffect(() => {
    document.title = `${label} — ${profile.host}`;
  }, [label]);

  const segment = path.split('/')[0];
  const activeNav = nav.find((view) => view.route.split('/')[0] === segment);

  useEffect(() => {
    const index = activeNav ? nav.indexOf(activeNav) : -1;
    if (index >= 0) setCursor(index);
  }, [activeNav, nav]);

  const bindings = useMemo<Binding[]>(
    () => [
      { keys: '?', run: () => setHelpOpen((value) => !value) },
      { keys: 'alt+l', whileTyping: true, run: () => setLocale(locale === 'ru' ? 'en' : 'ru') },
      { keys: ':', run: () => document.getElementById('tui-cmdline')?.focus() },
      { keys: 'j', run: () => setCursor((index) => Math.min(index + 1, nav.length - 1)) },
      { keys: 'k', run: () => setCursor((index) => Math.max(index - 1, 0)) },
      {
        keys: 'enter',
        run: () => {
          if (document.activeElement && document.activeElement !== document.body) return;
          const view = nav[cursor];
          if (view) open(view.nav?.target ?? view.route);
        },
      },
    ],
    [cursor, locale, nav, open, setLocale],
  );

  useKeymap(bindings);

  const submitCommand = (input: string) => {
    setHistory((items) => [...items, input]);
    const result = runCommand(input, {
      locale,
      currentPath: path,
      open,
      setLocale,
      toggleHelp: () => setHelpOpen((value) => !value),
    });
    setMessage(result);
  };

  const right = <LangSwitch value={locale} options={LOCALES} onChange={setLocale} />;

  const commandLine = (
    <CommandLine
      id="tui-cmdline"
      sigil="❯"
      placeholder={t(ui.commandPlaceholder)}
      hint={message ? t(message) : t(ui.commandHint)}
      history={history}
      onSubmit={submitCommand}
    />
  );

  return (
    <>
     <WM onHelp={() => setHelpOpen(true)} 
     cursorId={nav[cursor].id} 
     right={right}
     commandLine={commandLine}
      />

      {helpOpen && (
        <Overlay onClose={() => setHelpOpen(false)}>
          <HelpBody>
            <Heading level={3}>{t(ui.helpTitle)}</Heading>
            <HelpGrid>
              {shortcuts.map((shortcut) => (
                <Fragment key={shortcut.keys}>
                  <Kbd>{shortcut.keys}</Kbd>
                  <Text>{t(shortcut.label)}</Text>
                </Fragment>
              ))}
            </HelpGrid>
          </HelpBody>
        </Overlay>
      )}
    </>
  );
}
