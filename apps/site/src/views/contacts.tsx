import { defineView } from '@mystyte/core';
import { T } from '@mystyte/tui';
import { profile } from '../content/profile';
import { Btn, Dl, H1, Lead, Menu } from '../ui';

const { links } = profile;

function ContactsPage() {
  return (
    <>
      <H1>
        <T ru="связаться" en="get in touch" />
      </H1>

      <Lead>
        <T
          ru="Пишите по делу и без — отвечаю, когда закрыт редактор."
          en="Write with or without a reason — I answer when the editor is closed."
        />
      </Lead>

      <Dl>
        <dt>github</dt>
        <dd>{links.github.replace(/^https:\/\/|\/$/g, '')}</dd>

        <dt>telegram</dt>
        <dd>@{links.telegram.split('/').pop()}</dd>

        <dt>email</dt>
        <dd>{links.email.replace('mailto:', '')}</dd>
      </Dl>

      <Menu>
        <Btn href={links.github}>GitHub</Btn>
        <Btn href={links.telegram}>Telegram</Btn>
        <Btn href={links.email}>E-mail</Btn>
      </Menu>
    </>
  );
}

export const contactsView = defineView({
  id: 'contacts',
  route: 'contacts',
  title: 'contacts',
  icon: 'user',
  nav: { label: 'contacts', icon: 'user', order: 8 },
  render: () => <ContactsPage />,
});
