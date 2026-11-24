import { useT } from '@mystyte/core';
import { Icon, Link } from '@mystyte/tui';
import { pinned } from '../content/pinned';
import { profile } from '../content/profile';
import { projects } from '../content/projects';
import { useRepos } from '../services/useGitHub';
import type { Entry } from '../content/types';
import type { Release, Repo } from '../services/github';
import { Badge, Rows, type Tone } from '../ui';

export function ProjectList() {
  const t = useT();
  return (
    <Rows>
      {projects.map((project) => (
        <li key={project.slug}>
          <Link to={project.repo ?? `projects/${project.slug}`}>
            <i>{project.icon && <Icon name={project.icon} />}</i>
            <b>{t(project.title)}</b>
            <span>{t(project.desc)}</span>
            <small>
              <Badge $tone={project.lang.tone}>{project.lang.label}</Badge>
            </small>
          </Link>
        </li>
      ))}
    </Rows>
  );
}

/**
 * Закреплённые репозитории с профиля GitHub (content/pinned.ts, npm run sync:pinned).
 * Порядок — как на GitHub; описание, язык и дата обновления берутся из живого API,
 * если он ответил, иначе из снимка. Свои репозитории открываются внутри сайта,
 * чужие (и форки, которых нет в repositories/) — на GitHub.
 */
export function PinnedList() {
  const { data: live } = useRepos();
  const { github } = profile;

  return (
    <Rows>
      {pinned.map((item) => {
        const repo = item.owner === github ? live?.find((r) => r.name === item.name) : undefined;
        const language = repo?.language ?? item.language;
        const description = repo?.description ?? item.description;
        const inside = item.owner === github && (!live || repo);

        return (
          <li key={`${item.owner}/${item.name}`}>
            <Link
              {...(inside
                ? { to: `repositories/${item.name}` }
                : { href: `https://github.com/${item.owner}/${item.name}` })}
            >
              <i>
                <Icon name="package" />
              </i>
              <b>{item.owner === github ? item.name : `${item.owner}/${item.name}`}</b>
              <span>{description}</span>
              <small>
                {language && <Badge $tone={langTone(language)}>{language}</Badge>}
                {repo?.updatedAt ?? `★ ${item.stars}`}
              </small>
            </Link>
          </li>
        );
      })}
    </Rows>
  );
}

export function langTone(lang: string | null): Tone {
  switch (lang) {
    case 'Go':
    case 'Vue':
      return 'green';
    case 'Python':
    case 'JavaScript':
      return 'yellow';
    case 'TypeScript':
    case 'Lua':
    case 'C#':
      return 'blue';
    case 'C':
    case 'C++':
    case 'Rust':
      return 'pink';
    default:
      return 'muted';
  }
}

export function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <Rows>
      {repos.map((repo) => (
        <li key={repo.name}>
          <Link to={`repositories/${repo.name}`}>
            <i>
              <Icon name="package" />
            </i>
            <b>{repo.name}</b>
            <span>{repo.description}</span>
            <small>
              {repo.language && <Badge $tone={langTone(repo.language)}>{repo.language}</Badge>}
              {repo.updatedAt}
            </small>
          </Link>
        </li>
      ))}
    </Rows>
  );
}

/** Посты и рецепты. `desc` — показывать описание. */
export function EntryList({ items, base, desc }: { items: Entry[]; base: string; desc?: boolean }) {
  const t = useT();
  return (
    <Rows>
      {items.map((entry) => (
        <li key={entry.slug}>
          <Link to={`${base}/${entry.slug}`}>
            <i>{entry.icon && <Icon name={entry.icon} />}</i>
            <b>{t(entry.title)}</b>
            <span>{desc && t(entry.desc)}</span>
            <small>
              {entry.tag && <Badge $tone="accent">{t(entry.tag)}</Badge>}
              {!entry.tag && entry.badge && (
                <Badge $tone={entry.badge.tone}>{t(entry.badge.label)}</Badge>
              )}
              {entry.date}
            </small>
          </Link>
        </li>
      ))}
    </Rows>
  );
}

export function ReleaseList({ releases }: { releases: Release[] }) {
  return (
    <Rows>
      {releases.map((release) => (
        <li key={release.tag}>
          <div>
            <i>
              <Icon name="tag" />
            </i>
            <b>{release.tag}</b>
            <span>{release.name}</span>
            <small>{release.date}</small>
          </div>
        </li>
      ))}
    </Rows>
  );
}
