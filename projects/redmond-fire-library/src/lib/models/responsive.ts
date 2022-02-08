export enum ScreenBreakpoint {
      DEFAULT = 'DEFAULT',
      SM = 'sm',
      MD = 'md',
      LG = 'lg',
}


export enum ResponsiveClassPrefix {
    DEFAULT = '',
    sm = 'sm-',
    md = 'md-',
    lg = 'lg-',
}
export type Responsive = ScreenBreakpoint;

export enum ResponsiveSize {
    '(max-width: 639.98px)' = 'DEFAULT',
    '(min-width: 640px) and (max-width: 767.98px)' = 'sm',
    '(min-width: 768px) and (max-width: 1023.98px)' = 'md',
    '(min-width: 1024px)' = 'lg',
}

export enum ResponsiveSizeQueries {
    DEFAULT = '(max-width: 639.98px)',
    sm = '(min-width: 640px) and (max-width: 767.98px)',
    md = '(min-width: 768px) and (max-width: 1023.98px)',
    lg = '(min-width: 1024px)',
}
