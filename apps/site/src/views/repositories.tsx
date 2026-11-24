import { useState } from 'react';
import styled from 'styled-components';
import { defineView } from '@mystyte/core';
import { FileTree, Gutter, Tabs, type TreeItem } from '@mystyte/tui';
import { useRepoContents, useRepoDetails, useRepos } from '../services/useGitHub';
import { Badge, Btn, Cols, Menu, P, Pad } from '../ui';
import { ReleaseList, RepoList, langTone } from './lists';

function RepositoriesPage() {
  const { data, error, loading } = useRepos();

  if (loading) return <P>загрузка…</P>;
  if (error) return <P>не удалось загрузить репозитории: {error}</P>;
  if (!data?.length) return <P>репозиториев нет</P>;
  return <RepoList repos={data} />;
}

const TABS = [
  { id: 'readme', label: 'README.md' },
  { id: 'files', label: 'files' },
  { id: 'releases', label: 'releases' },
];

/**
 * Дерево каталога. Папка — открыть её, `..` — на уровень выше,
 * файл — открыть на GitHub в новой вкладке.
 */
function DirTree({
  repo,
  dir,
  onOpen,
}: {
  repo: string;
  dir: string;
  onOpen: (dir: string) => void;
}) {
  const { data, error, loading } = useRepoContents(repo, dir);
  const parent = dir.split('/').slice(0, -1).join('/');

  const items: TreeItem[] = [
    ...(dir ? [{ label: '..', icon: 'folder', onClick: () => onOpen(parent) }] : []),
    ...(data ?? []).map((file) => ({
      label: file.type === 'dir' ? `${file.name}/` : file.name,
      icon: file.type === 'dir' ? 'folder' : 'file',
      onClick:
        file.type === 'dir'
          ? () => onOpen(file.path)
          : () => window.open(file.url, '_blank', 'noopener,noreferrer'),
    })),
  ];

  return (
    <div>
      <DirPath>/{dir}</DirPath>
      {loading && <Pad>загрузка…</Pad>}
      {error && <Pad>не удалось открыть: {error}</Pad>}
      {!loading && !error && <FileTree items={items} />}
    </div>
  );
}

const DirPath = styled.div`
  padding: 4px 10px;
  color: var(--fg-faint);
  border-bottom: 1px solid var(--border-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function RepositoryPage({ name }: { name: string }) {
  const [tab, setTab] = useState('readme');
  /** открытый каталог, '' — корень; общий для README и files */
  const [dir, setDir] = useState('');
  const repos = useRepos();
  const details = useRepoDetails(name);

  const repo = repos.data?.find((item) => item.name === name);
  const tree = <DirTree repo={name} dir={dir} onOpen={setDir} />;

  if (details.loading) return <Pad>загрузка…</Pad>;
  if (details.error) {
    return (
      <Pad>
        не удалось загрузить {name}: {details.error}
      </Pad>
    );
  }

  return (
    <>
      <Tabs items={TABS} active={tab} onChange={setTab} />

      {tab === 'readme' && (
        <Cols $template="minmax(150px, 0.38fr) minmax(0, 1fr)" $gap={0}>
          {tree}
          <Pad>
            {repo && (
              <Menu>
                {repo.languages.map((lang) => (
                  <Badge key={lang.title} $tone={langTone(lang.title)}>
                    {lang.title} {Math.round(lang.percent * 100)}%
                  </Badge>
                ))}
                <Btn href={repo.url}>GitHub</Btn>
              </Menu>
            )}
            {details.data?.readme ? (
              <Gutter lines={details.data.readme.split('\n').length}>
                <Readme>{details.data.readme}</Readme>
              </Gutter>
            ) : (
              <P>README нет</P>
            )}
          </Pad>
        </Cols>
      )}

      {tab === 'files' && tree}

      {tab === 'releases' &&
        (details.data?.releases.length ? (
          <ReleaseList releases={details.data.releases} />
        ) : (
          <Pad>
            <P>релизов нет</P>
          </Pad>
        ))}
    </>
  );
}

/** README как есть; без переноса строк, чтобы номера в Gutter совпадали */
const Readme = styled.pre`
  margin: 0;
  font: inherit;
  white-space: pre;
  color: var(--fg);
`;

export const repositoriesView = defineView({
  id: 'repositories',
  route: 'repositories',
  title: 'repositories/',
  icon: 'folder',
  nav: { label: 'repositories/', icon: 'folder', order: 4 },
  render: () => <RepositoriesPage />,
});

export const repositoryView = defineView<{ slug: string }>({
  id: 'repository',
  route: 'repositories/:slug',
  icon: 'folder',
  flush: true,
  title: ({ params }) => params.slug,
  breadcrumb: ({ params }) => ['repositories', params.slug],
  render: ({ params }) => <RepositoryPage name={params.slug} />,
});
