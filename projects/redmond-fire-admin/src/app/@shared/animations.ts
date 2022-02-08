import { animate, animateChild, group, keyframes, query, stagger, state, style, transition, trigger } from "@angular/animations";


export const RevealContentAndChildren = [
      trigger('revealContent', [
            state('visible', style({
                  opacity: '1',
                  transform: 'scale(1) translate-y-0',
            })),
            state('hidden', style({
                  opacity: '0',
                  transform: 'scale(.9) translate-y-30',
            })),
            transition('* => visible', [
                  group([
                        query('@revealContentChild', [
                              animateChild(),
                              stagger(50, [
                                    animate('.6s cubic-bezier(0, 1.01, 0, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
                              ])
                        ]),
                        animate('.7s cubic-bezier(0.1, 1.22, 0.1, 1)',
                              keyframes([
                                    style({ display: 'block', opacity: '0', transform: 'scale(.75) translateY(10%)', offset: 0 }),
                                    style({ display: 'block', opacity: '0', transform: 'scale(.75) translateY(10%)', offset: 0.01 }),
                                    style({ display: 'block',  opacity: '1', transform: 'scale(1) translateY(0%)', offset: 1 }),
                              ])
                        ),
                  ])
            ]),
            // transition( '* => hidden', [
            //   group([
            //     query('@revealContentChild', animateChild()),
            //     animate('0.6s cubic-bezier(0.1, 1.22, 0.1, 1)',
            //       keyframes([
            //         style({ height: '20px', padding: '.25em 0', offset: 0 }),
            //         style({ height: "0px", padding: '0px', offset: 1 }),
            //       ])
            //     ),
            //   ])
            // ] ),
      ]),
      trigger('revealContentChild', [
            state('visible', style({
                  opacity: '1',
                  transform: 'scale(1) translate-y-0',
            })),
            state('hidden', style({
                  opacity: '.3',
                  transform: 'scale(.9) translate-y-30',
            })),
            transition('* <=> *', [
                  animate('2s cubic-bezier(0.66, 0.04, 0, 1.01)'
                        // keyframes([
                        //       style({ opacity: '0', transform: 'translateY(50%)', offset: 0 }),
                        //       style({ opacity: '.3', transform: 'translateY(10%)', offset: .8 }),
                        //       style({ opacity: '1', transform: 'translateY(0)', offset: 1 })
                        // ])
                  )
            ]),
            // transition('* => hidden', [
            //       animate('.3s cubic-bezier(0.66, 0.04, 0, 1.01)')
            // ]),
      ]),
]


export const AnimatedList = [
      trigger('animatedList', [
            transition('* => *', [
                query(':enter', [
                      style({
                            opacity: 0,
                            filter: 'blur(5px)',
                            transform: 'scale(.7) translateY(20%)',
                      }),
                    stagger(30, [
                          animate('1.13s cubic-bezier(0,.66,.11,1.01)',
                                style({
                                      opacity: 1,
                                      filter: 'blur(0px)',
                                      transform: 'scale(1) translateY(0)'
                                }))
                    ])
                ], { optional: true })
            ])
      ])
]
