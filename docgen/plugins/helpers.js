import markdown from 'markdown-it';
import highlight from '../syntaxHighlighting.js';

const md = markdown();

// this plugin provides ATM one helper to easily compute the publicPath of assets
export default function helpers(filenames, metalsmith, cb) {
  metalsmith.metadata().h = {
    markdown(src) {
      return md.render(src);
    },
    highlight(src, opts) {
      const lang = opts && opts.lang;
      return highlight(src, lang);
    },
  };

  cb();
}
