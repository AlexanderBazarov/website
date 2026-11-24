import type { SpriteDef } from './PixelArt';

export const pastaSprite: SpriteDef = {
  palette: {
    w: '#8f6ae0',
    W: '#b388ff',
    n: '#ffd97a',
    m: '#e8c35a',
    d: '#c9952e',
    t: '#f2546a',
    T: '#ff7b7b',
    g: '#45b06e',
    G: '#6fcf8f',
    p: '#efe8ff',
    s: '#b9a8e6',
    S: '#8f6ae0',
  },
  rows: [
    '............W....W......W.........',
    '............w.....w....w..........',
    '...........w......w....w..........',
    '...........w.....w......w.........',
    '..................................',
    '.............Ggmdnmm..............',
    '..........mdnmmdnmdTtmd...........',
    '.........mdnmdnmmdnttnmm..........',
    '........dnTtdnmdnmmdnmGgm.........',
    '.......dnmttmmdnmGnmmdnmdn........',
    '......nmmdnmdnmmdnmdnmmdTtd.......',
    '......mdGgmdnmTtmmdnmdnmttn.......',
    '......ddmdnmmdnmdnmmdnmdndd.......',
    '.....ddddnmdnmmdnmdnmmdnmddds.....',
    '..spppppppppppppppppppppppppppps..',
    '...spppppppppppppppppppppppppps...',
    '......ssssssssssssssssssssss......',
    '..........SSSSSSSSSSSSSS..........',
  ],
};

export const terminalSprite: SpriteDef = {
  palette: { b: '#4a3880', s: '#0d0a13', g: '#6fcf8f', a: '#b388ff' },
  rows: [
    'bbbbbbbbbbbbbbbb',
    'bssssssssssssssb',
    'bsggsssssssssssb',
    'bsgssgsssssssssb',
    'bsggsssssssssssb',
    'bsssssaaaasssssb',
    'bssssssssssssssb',
    'bbbbbbbbbbbbbbbb',
  ],
};
