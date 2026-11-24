import { defineView } from '@mystyte/core';
import { T } from '@mystyte/tui';
import { Btn, Dl, H1, H3, Hr, Lead, Menu } from '../ui';

function AboutPage() {
  return (
    <>
      <H1>
        <T ru="привет, я Саня" en="hey, I’m Sanya" />
      </H1>

      <Lead>
        <T
          ru="В интернете — moonlight_dev. Пишу код, играю на гитаре, слушаю тяжёлую музыку. Люблю возиться с Linux и делать что-нибудь своё — будь то драйвер для маленького экрана или этот сайт."
          en="Online, I go by moonlight_dev. I write code, play guitar, and listen to heavy music. I like tinkering with Linux and building my own things, whether that’s a driver for a tiny display or this website."
        />
      </Lead>

      {/* prettier-ignore */}
      <Dl>
        <dt><T ru="пишу на" en="I code in" /></dt>
        <dd>Go · Python · TypeScript · Java · C#</dd>

        <dt><T ru="пользуюсь" en="my setup" /></dt>
        <dd>Linux · Hyprland · macOS · Neovim · Zed</dd>

        <dt><T ru="кроме кода" en="besides coding" /></dt>
        <dd>
          <T
            ru="гитара, рок и метал, VR, готовка"
            en="guitar, rock and metal, VR, cooking"
          />
        </dd>
      </Dl>

      <Hr />

      <H3>
        <T ru="мой компьютер" en="my computer" />
      </H3>

      <Lead>
        <T
          ru="Основной компьютер — сборка на Ryzen 9 и RTX 5070. Пользуюсь Linux с Hyprland. На этом же компьютере пишу код, играю и проверяю свои проекты, поэтому настройки рабочего окружения у меня тоже постепенно превращаются в отдельный проект."
          en="My main PC is a Ryzen 9 and RTX 5070 build running Linux with Hyprland. It’s where I code, play games, and test my projects, so configuring the desktop is gradually becoming a project of its own."
        />
      </Lead>

      {/* prettier-ignore */}
      <Dl>
        <dt><T ru="процессор" en="CPU" /></dt>
        <dd>AMD Ryzen 9 9950x3d</dd>

        <dt><T ru="видеокарта" en="GPU" /></dt>
        <dd>NVIDIA GeForce RTX 5070</dd>

        <dt><T ru="материнская плата" en="motherboard" /></dt>
        <dd>MSI X870-P</dd>

        <dt><T ru="охлаждение" en="cooling" /></dt>
        <dd>DeepCool LM360 · DeepCoolGo</dd>

        <dt><T ru="ноутбук" en="laptop" /></dt>
        <dd>MacBook Pro 16″ · 2021</dd>
      </Dl>

      <Lead>
        <T
          ru="Ещё есть MacBook, поэтому между Linux и macOS я регулярно переключаюсь. В каждой системе есть свои удобные вещи и свои поводы открыть терминал."
          en="I also have a MacBook, so I regularly switch between Linux and macOS. Both have things I like and their own reasons to open a terminal."
        />
      </Lead>

      <Hr />

      <H3>
        <T ru="виртуальная реальность" en="virtual reality" />
      </H3>

      <Lead>
        <T
          ru="Для VR у меня Meta Quest 3. Играю в том числе с компьютера, а для подключения к Linux использую WiVRn. Поэтому знаком не только с самими играми, но и с настройками стриминга, битрейтом, кодеками и поиском причин, почему картинка вдруг стала чёрной."
          en="My VR headset is a Meta Quest 3. I also use it for PC VR, with WiVRn connecting it to Linux. So alongside the games, I’ve become familiar with streaming settings, bitrates, codecs, and figuring out why the picture has suddenly gone black."
        />
      </Lead>

      {/* prettier-ignore */}
      <Dl>
        <dt><T ru="шлем" en="headset" /></dt>
        <dd>Meta Quest 3</dd>

        <dt><T ru="подключение к Linux" en="Linux streaming" /></dt>
        <dd>WiVRn</dd>

        <dt><T ru="побочная игра" en="the unofficial minigame" /></dt>
        <dd>
          <T
            ru="добиться, чтобы всё это работало вместе"
            en="getting all of it to work together"
          />
        </dd>
      </Dl>

      <Hr />

      <H3>
        <T ru="музыка" en="music" />
      </H3>

      <Lead>
        <T
          ru="Слушаю в основном рок и метал, сам играю на гитаре. Музыка — одна из тех вещей, которым здесь тоже хочется оставить место: всё-таки этот сайт про меня, а не только про то, на каких языках я пишу."
          en="I mostly listen to rock and metal, and I play guitar myself. Music deserves a place here too. This site is about me, after all, and there’s more to that than the programming languages I use."
        />
      </Lead>

      <H3>
        <T ru="заметки и рецепты" en="notes and recipes" />
      </H3>

      <Lead>
        <T
          ru="Кроме кода, здесь собираю рецепты и заметки про всякие настройки. Иногда проще один раз записать, как что-то настроил или приготовил, чем потом вспоминать по кусочкам. Заодно это может пригодиться кому-нибудь ещё."
          en="Besides code, I keep recipes and configuration notes here. Sometimes it’s easier to write down how I configured or cooked something than to piece it together from memory later. It might be useful to someone else too."
        />
      </Lead>

      <Hr />

      <Menu>
        <Btn to="contacts" $primary>
          <T ru="написать мне" en="say hello" />
        </Btn>
        <Btn to="repositories">
          <T ru="мои проекты" en="my projects" />
        </Btn>
      </Menu>
    </>
  );
}

export const aboutView = defineView({
  id: 'about',
  route: 'about.md',
  title: 'about.md',
  icon: 'file',
  nav: { label: 'about.md', icon: 'file', order: 7 },
  render: () => <AboutPage />,
});