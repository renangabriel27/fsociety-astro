// Site settings and theme options: edit them and rebuild.

export type Locale = 'en' | 'pt-BR';

export interface NavItem {
    label: string;
    url: string;
}

export const site = {
    title: 'fsociety',
    description: 'We are fsociety. Notes on security, Linux and the systems that run the world.',
    /** Accent color of the prompt, buttons, cursor, links and episode numbers. Blood red */
    accentColor: '#E0182D',
    /** 'en' or 'pt-BR': language of the interface strings and of <html lang> */
    locale: 'en' as Locale,
    /** Slug of the author used when a post doesn't list any (see src/data/authors.json) */
    defaultAuthor: 'elliot',
    postsPerPage: 10,
    /** A few short items. Extra items go into the ⋮ menu; on mobile the menu becomes a numbered list */
    navigation: [
        { label: 'Home', url: '/' },
        { label: 'Security', url: '/tag/security/' },
        { label: 'Linux', url: '/tag/linux/' },
        { label: 'whoami', url: '/whoami/' },
    ] as NavItem[],
    secondaryNavigation: [
        { label: 'whoami', url: '/whoami/' },
        { label: 'RSS', url: '/rss.xml' },
    ] as NavItem[],
    /** Social profiles shown in the footer (github was the theme's github_url option). Leave empty to hide one. */
    social: {
        x: '',
        facebook: '',
        linkedin: '',
        bluesky: '',
        mastodon: '',
        threads: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        github: 'https://github.com/renangabriel27',
    },
};

export const theme = {
    /** user@host of the shell prompt. A user named root gets the # prompt, anyone else gets $. Empty = just "~#" */
    terminalPrompt: 'root@fsociety',
    /** Search posts by title in the prompt on the home, tag and author pages. When off, the prompt shows the command */
    promptSearch: true,
    /** Blinking red block cursor in the prompt and after the greeting */
    showBlinkingCursor: true,
    /** RGB-split glitch on the logo and titles when hovered, and on the error code */
    glitchEffects: true,
    /** Faint CRT scanlines and vignette over the whole site */
    crtScanlines: true,
    /** Big line in the footer, also quoted on the error page. Empty = no tagline */
    footerTagline: 'Control is an illusion.',

    // Homepage
    /** Big greeting at the top of the home page */
    showHomeIntro: true,
    /** The greeting, typed like a terminal line */
    introGreeting: 'Hello, friend.',
    /** Text under the greeting; empty = site description */
    homeIntroText: '',
    /** Type the greeting letter by letter */
    typingAnimation: true,
    /** Number posts like episodes (eps1.0, eps1.1…), ten per season, oldest first */
    episodeNumbers: true,
    showAuthor: true,
    showReadingTime: true,
    showPublishDate: true,

    // Post
    /** Shell breadcrumb at the top of posts and pages */
    showBreadcrumb: true,
    showRelatedArticles: true,
};

/**
 * Newsletter block (end of posts and footer). Static sites have no members, so the form posts the
 * email to a newsletter service: set `action` to its form endpoint, e.g. Buttondown's
 * "https://buttondown.com/api/emails/embed-subscribe/<username>". Empty = no newsletter block.
 */
export const newsletter = {
    action: '',
    /** Empty = site title */
    heading: 'Join fsociety',
    /** Empty = site description */
    subheading: '',
    /** Newsletter block at the end of posts (on posts, the footer doesn't repeat the form) */
    showOnPosts: true,
};
