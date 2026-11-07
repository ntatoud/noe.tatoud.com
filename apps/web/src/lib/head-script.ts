export const THEME_STORAGE_KEY = 'theme'

// Matched by `html[data-filtering]` in index.css.
export const TAG_FILTERING_FLAG = 'filtering'

// Runs before hydration: sets the theme, and hides the blog list until the tag filter can run.
export const HEAD_SCRIPT = `var t=null;try{t=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}var d=document.documentElement;d.classList.toggle('dark',t?t==='dark':!matchMedia('(prefers-color-scheme: light)').matches);if(location.pathname.indexOf('/blog')===0&&/[?&]tag=/.test(location.search))d.dataset.${TAG_FILTERING_FLAG}='';`
