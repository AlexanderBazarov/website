import { defineView } from '@mystyte/core';
import { T } from '@mystyte/tui';
import { Hr, Lead } from '../ui';
import { PinnedList } from './lists';

function ProjectsPage() {
  return (
    <>
      <Lead>
        <T
          ru="Что работает прямо сейчас и чинится по выходным."
          en="What runs right now and gets fixed on weekends."
        />
      </Lead>
      <Hr />
      <PinnedList />
    </>
  );
}

export const projectsView = defineView({
  id: 'projects',
  route: 'projects',
  title: 'projects/',
  icon: 'folder',
  nav: { label: 'projects/', icon: 'folder', order: 3 },
  render: () => <ProjectsPage />,
});
