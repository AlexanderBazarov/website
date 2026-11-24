import { defineView } from '@mystyte/core';
import { Fields } from '@mystyte/tui';
import { postBySlug, posts } from '../content/blog';
import { notFound } from './helpers';
import { EntryList } from './lists';

export const blogView = defineView({
  id: 'blog',
  route: 'blog',
  title: 'blog/',
  icon: 'book',
  nav: { label: 'blog/', icon: 'folder', order: 5 },
  render: () => <EntryList items={posts} base="blog" desc />,
});

export const postView = defineView<{ slug: string }>({
  id: 'post',
  route: 'blog/:slug',
  icon: 'book',
  title: ({ params, t }) => t(postBySlug(params.slug)?.title) || params.slug,
  breadcrumb: ({ params, t }) => ['blog', t(postBySlug(params.slug)?.title) || params.slug],
  render: ({ params }) => (
    <Fields items={postBySlug(params.slug)?.body ?? notFound(`blog/${params.slug}`)} />
  ),
});
