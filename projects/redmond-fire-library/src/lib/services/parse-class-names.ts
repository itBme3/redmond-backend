import { ScreenBreakpoint } from "../models/responsive";
import { fromCamelCase, getIndexOfItemInArray, objectValue, setObjectValue } from "./funcs";
/* ---------------------------------------------------------------- */
/* STYLE OPTIONS -------------------------------------------------- */
/* ---------------------------------------------------------------- */

const SPACING = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96']
      .map(s => { return { value: s, label: s === 'px' ? '1px' : s } });
const ASPECT_RATIO = [{ value: '6:4', icon: 'ratio-64', label: '6:4' }, { value: '1:1', icon: 'ratio-11', label: '1:1' }, { value: '4:6', icon: 'ratio-46', label: '4:6' }];
const TEXT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'].map(size => { return { label: size, value: size } });
const FONT_WEIGHTS = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
const WIDTHS = [{ value: '12', label: 'full' }, { value: '3', label: '1/4' }, { value: '6', label: '1/2' }, { value: '9', label: '3/4' },];

const MAX_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full', 'min', 'max', 'prose', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl', 'screen-2xl']
      .map(label => { return { label, value: label } });
const COLUMNS = ['1', '2', '3', '4', '5', '6', '7', '8']
      .map(label => { return { label, value: label } });
const ALIGN_TEXT = [{ value: 'left', icon: 'text-left', label: 'Left' }, { value: 'center', icon: 'text-center', label: 'Center' }, { value: 'right', icon: 'text-right', label: 'Right' }];
const RAINBOW = ['red', 'purple', 'blue', 'cyan', 'green', 'yellow', 'orange'];
const COLOR_SHADES = RAINBOW.reduce((acc, c) => {
      return [...acc, ...['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map(s => `${c}-${s}`)];
}, []);
const COLORS = ['white', 'grey-light', 'grey-dark', 'black', 'rcc-red', ...COLOR_SHADES];
const CARD_STYLES = [
      { value: 'overlay', icon: 'card-overlay', label: 'Image Overlay' },
      { value: 'testimonial', icon: 'card-testimonial', label: 'Testimonial' },
      { value: 'text', icon: 'text-card', label: 'Text Only' }
];
const ALIGN_CONTENT = [
      { value: { vertical: 'center', horizontal: 'center' }, icon: 'align-center', label: 'Center' },
      { value: { vertical: 'center', horizontal: 'start' }, icon: 'align-center-left', label: 'Center Left' },
      { value: { vertical: 'center', horizontal: 'end' }, icon: 'align-center-right', label: 'Center Right' },
      { value: { vertical: 'end', horizontal: 'start' }, icon: 'align-bottom-left', label: 'Bottom Left' },
      { value: { vertical: 'end', horizontal: 'end' }, icon: 'align-bottom-right', label: 'Bottom Right' },
      { value: { vertical: 'start', horizontal: 'start' }, icon: 'align-top-left', label: 'Top Left' },
      { value: { vertical: 'start', horizontal: 'end' }, icon: 'align-top-right', label: 'Top Right' },
];






/* ---------------------------------------------------------------- */
/* PARSING -------------------------------------------------- */
/* ---------------------------------------------------------------- */



const SETTING_OPTIONS = {
      sides: ['t', 'r', 'b', 'l'],
      hasSides: ['padding', 'border'],
};
const CLASS_NAMESPACES: string[] = [
      'w', 'h', 'min-h', 'min-w', 'max-w', 'max-h', 'gap',
      'font', 'text', 'bg', 'bg-opacity', 'text-opacity', 'opacity',
      'flex', 'col-span', 'row-span', 'items', 'content', 'grid-cols',
      ...['', ...SETTING_OPTIONS.sides].map(s => `p${s}`),
      ...['', ...SETTING_OPTIONS.sides].map(s => `border${!!s.length ? '-' : ''}${s}`),
];
const HYPHENATED_CLASS_NAMESPACES: string[] = CLASS_NAMESPACES.filter(c => c.includes('-'));
const SCREEN_BREAKPOINTS: string[] = Object.values(ScreenBreakpoint);





export class ParseClasses {
      optionValues = { ASPECT_RATIO, SPACING, WIDTHS, MAX_WIDTHS }

      public CUSTOM_OPTIONS = {
            aspectRatio: {
                  options: ASPECT_RATIO, label: 'Aspect Ratio', icon: 'aspect-ratio', inputType: 'icons', DEFAULT: '1:1',
            },
            cardStyle: {
                  options: CARD_STYLES, label: 'Card Style', icon: 'card-styles', inputType: 'icons',
            }
      }

      public STYLE_OPTIONS = {
            padding: {
                  options: SPACING, label: 'Padding', classNamespace: 'p', inputType: 'select', DEFAULT: 0,
            },
            spacing: {
                  options: SPACING, label: 'Spacing', classNamespace: 'gap', inputType: 'select', DEFAULT: 'auto',
            },
            columns: {
                  options: COLUMNS, label: 'Columns', classNamespace: 'grid-cols', inputType: 'select', DEFAULT: '2',
            },
            width: {
                  options: WIDTHS, label: 'Width', classNamespace: 'col-span', inputType: 'select', DEFAULT: 'full',
            },
            maxWidth: {
                  options: MAX_WIDTHS, label: 'Max Width', classNamespace: 'max-w', inputType: 'select', DEFAULT: 'full',
            },
            textSize: {
                  options: TEXT_SIZES, label: 'Size', classNamespace: 'text', objectKeyPrefix: 'size', icon: 'text-size', inputType: 'select',
            },
            fontWeight: {
                  options: FONT_WEIGHTS, label: 'Font Weight', classNamespace: 'font', objectKeyPrefix: 'weight', icon: 'text-justified', inputType: 'icons',
            },
            alignText: {
                  options: ALIGN_TEXT, label: 'Text Align', classNamespace: 'text', objectKeyPrefix: 'align', icon: 'text-justified', inputType: 'icons',
            },
            alignContent: {
                  options: ALIGN_CONTENT, label: 'Align Content', icon: 'alignment',
            },
            textColor: {
                  options: COLORS, label: 'Color', classNamespace: 'text', objectKeyPrefix: 'color', icon: 'text-color', inputType: 'color',
            },
            bgColor: {
                  options: COLORS, label: 'Background', classNamespace: 'bg', objectKeyPrefix: 'color', icon: 'bg-color', inputType: 'color',
            },
      }

      public RESPONSIVE_STYLES: string[] = ['padding', 'columns', 'spacing', 'textSize', 'width'];


      private objToString(classNameObj: { [key: string /* breakpoint -- DEFAULT for base */]: string[] }) {
            const _classNameObj = JSON.parse(JSON.stringify(classNameObj));
            if (!!!_classNameObj || typeof _classNameObj !== 'object') return null;
            const breakpoints = [...Object.keys(_classNameObj)];
            return breakpoints.reduce((acc, breakpoint) => {
                  let i = -1;
                  const objClassNames = Object.keys(_classNameObj[breakpoint]);
                  return acc += `${objClassNames.reduce((str, className) => {
                        i++
                        let val = _classNameObj[breakpoint][className];
                        if (typeof val === 'string') {
                              str += breakpoint === 'DEFAULT' ? ` ${className}-${val}` :
                                    ` ${breakpoint}:${className}-${val}`;
                              return str
                        } else {
                              const objectKeyPrefixes = Object.keys(this.STYLE_OPTIONS).map(key => !!this.STYLE_OPTIONS[key].objectKeyPrefix ? this.STYLE_OPTIONS[key].objectKeyPrefix : null).filter(p => !!p)
                              return `${Object.keys(val).reduce((_str, _className) => {
                                    const _val = val[_className];
                                    _str += breakpoint === 'DEFAULT' ? ` ${className}${objectKeyPrefixes.includes(_className) ? `-${_val}` : `-${_className}-${_val}`}` :
                                          ` ${breakpoint}:${objectKeyPrefixes.includes(_className) ? `${className}-${_val}` : `${className}-${_className}-${_val}`}`;
                                    return _str
                              }, str)}`
                        }
                  }, '')
                        }`
            }, '').trim();
      }

      private getClassNamespace(className) {
            let _className: string = this.getClassNameWithoutBreakpoint(`${className}`);
            if (CLASS_NAMESPACES.includes(className)) return _className;
            if (_className.includes(':')) _className = _className.split(':').pop();
            const val = this.getValueFromClassName(className)
            return _className.replace(`-${val}`, '');
      }

      private getObjectKeyPreFix(className) {
            const val = this.getValueFromClassName(className);
            const classNamespace = this.getClassNamespace(className);
            let res: string = null;
            for (const key in this.STYLE_OPTIONS) {
                  if (this.STYLE_OPTIONS[key].classNamespace === classNamespace
                        && !!this.STYLE_OPTIONS[key].options.filter(o => (!!o.value && o.value === val) || o === val).length)
                        res = !!this.STYLE_OPTIONS[key].objectKeyPrefix ? this.STYLE_OPTIONS[key].objectKeyPrefix : null;
            }
            return res
      }
      private classKeyString(className: string) {
            const classNameWithoutBreakpoint = this.getClassNameWithoutBreakpoint(className)
            const keyPathFromCamel = fromCamelCase(classNameWithoutBreakpoint).toLowerCase().split(' ').join('.');
            const _breakpoint = this.getBreakpointFromClassName(`${className}`);
            let _className = keyPathFromCamel.includes('.') ? this.getClassNameWithoutBreakpoint(keyPathFromCamel.split('.')[0]) : this.getClassNameWithoutBreakpoint(`${className}`);
            const objectKeyPreFix = keyPathFromCamel.includes('.') ? keyPathFromCamel.split('.').pop() : this.getObjectKeyPreFix(_className);
            let val = this.getValueFromClassName(`${className}`);
            if (!!!val) val = '';
            const keyString = `${_breakpoint}.${_className}${!!objectKeyPreFix ? `.${objectKeyPreFix}` : ''}`.split(':').join('.').replace(`-${val}`, '').split('-').join('.');
            return keyString
      }
      private getClassValueFromInputValue(data: {
            val: number | [number, number, number, number] | string | boolean,
            key: string,
            hover?: boolean,
            breakpoint?: ScreenBreakpoint,
      }) {
            const _className = this.getClassNameFromInputValue({ ...data });
            return this.getValueFromClassName(_className)
      }
      private getValueFromObj(classNameObj, className, breakpoint: ScreenBreakpoint | string = ScreenBreakpoint.DEFAULT, strict: boolean = false) {
            try {
                  const _classKey = className.includes(':') ? className.split(':').pop() :
                        className === 'textSize' ? 'text-base' :
                              className === 'textColor' ? 'text-grey-dark' :
                                    [...Object.keys(this.STYLE_OPTIONS), ...CLASS_NAMESPACES].includes(className) ? `${className}-null` :
                                          className;
                  const _prefix = className.includes(':') && className.split(':').filter(strng => ['hover', 'focus', 'active', 'focus-within'].includes(strng)).length > 0 ? className.split(':').filter(strng => ['hover', 'focus', 'active', 'focus-within'].includes(strng))[0] : null;
                  let _breakpoint = _classKey.includes(':') && _classKey.split(':').filter(strng => SCREEN_BREAKPOINTS.includes(strng)).length > 0 ?
                        className.split(':').filter(strng => SCREEN_BREAKPOINTS.includes(strng))[0] :
                        breakpoint;
                  let _keyString = this.classKeyString(`${!!!_breakpoint || _breakpoint === ScreenBreakpoint.DEFAULT ? '' : `${_breakpoint}:`}${this.getClassNameWithoutBreakpoint(_classKey)}`);
                  let _val: any = objectValue(_keyString, classNameObj);
                  if (!!_val) return _val;
                  if (!!strict) return null;
                  for (let i = 0; i < Object.values(ScreenBreakpoint).length; i++) {
                        _breakpoint = this.nextBreakpoint(`${_breakpoint}`, 'next');
                        _keyString = this.classKeyString(`${_breakpoint}:${_classKey}`);
                        _val = objectValue(_keyString, { ...classNameObj });
                        if (_val !== null || _breakpoint === null) return _val;
                  }
                  return _val
            } catch (_err) {
                  return null
            }
      }

      private getClassNameWithoutBreakpoint(className: string) {
            const breakpoints: string[] = [...Object.values(ScreenBreakpoint), 'null']
            return className.includes(':')
                  && breakpoints.includes(className.split(':')[0]) ?
                  className.split(':').slice(1).join(':')
                  : className;
      }

      private getBreakpointFromClassName(className: string) {
            const breakpoints = SCREEN_BREAKPOINTS;
            return className.includes(':')
                  && !!breakpoints.filter(b => b === className.split(':')[0])[0] ?
                  className.split(':')[0] :
                  ScreenBreakpoint.DEFAULT
      }

      private nextBreakpoint(breakpoint: ScreenBreakpoint | string, nextPrev: 'next' | 'prev'): ScreenBreakpoint | null {
            if (!!!breakpoint) return null;
            if (nextPrev === 'next')
                  return breakpoint === ScreenBreakpoint.LG ? ScreenBreakpoint.MD :
                        breakpoint === ScreenBreakpoint.MD ? ScreenBreakpoint.SM :
                              breakpoint === ScreenBreakpoint.SM ? ScreenBreakpoint.DEFAULT :
                                    null;
            return breakpoint === ScreenBreakpoint.MD ? ScreenBreakpoint.LG :
                  breakpoint === ScreenBreakpoint.SM ? ScreenBreakpoint.MD :
                        breakpoint === ScreenBreakpoint.DEFAULT ? ScreenBreakpoint.SM :
                              null;
      }

      private getClassNameFromInputValue(data: {
            val: number | [number, number, number, number] | string | boolean,
            key: string,
            hover?: boolean,
            breakpoint?: ScreenBreakpoint,
      }) {
            const { key, hover = false, breakpoint = ScreenBreakpoint.DEFAULT } = data;
            if (!!!this.STYLE_OPTIONS[key]) return new Error(`${key} is not valid key. Valid keys: ${Object.keys(this.STYLE_OPTIONS).map(k => `${k}`).join(', ')}`);
            const { classNamespace, options, DEFAULT } = this.STYLE_OPTIONS[key];
            const { val: inputValue = !!DEFAULT ? DEFAULT : null } = data;
            const classPrefix = `${!!!breakpoint || breakpoint === ScreenBreakpoint.DEFAULT || !this.RESPONSIVE_STYLES.includes(key) ? '' : `${breakpoint}:`}${hover ? 'hover:' : ''}`;
            let classVal: any = typeof inputValue === 'number' && !!options[inputValue] ?
                  !!options[inputValue].value ? options[inputValue].value : options[inputValue] :
                  inputValue?.length === 4 && !!inputValue?.map && inputValue?.map(v => typeof v === 'number')?.length === 4 ?
                        inputValue.map(v => !!options[v].value ? options[v].value : options[v]) :
                        inputValue;
            if (key === 'alignContent' && classVal.vertical && classVal.horizontal)
                  return `${classPrefix}content-${classVal.vertical} ${classPrefix}items-${classVal.horizontal}`;
            if (SETTING_OPTIONS.hasSides.includes(key))
                  return typeof classVal === 'string' ?
                        SETTING_OPTIONS.sides.map(s => `${classPrefix}${classNamespace}${s}-${classVal}`).join(' ') :
                        classVal?.map(v => typeof v === 'string')?.filter(v => !!v)?.length === 4 ?
                              SETTING_OPTIONS.sides.map(s => `${classPrefix}${classNamespace}${s}-${classVal[getIndexOfItemInArray(s, SETTING_OPTIONS.sides)]}`).join(' ') : null

            return `${classPrefix}${classNamespace}-${classVal}`;
      }

      stringToObj(classNameString) {
            if (!!!classNameString?.length) return {};
            const classNames = !!classNameString?.split ? classNameString.split(' ') : [];
            return classNames.reduce((obj, className) => {
                  // const _classKey = className.split('-').slice(0, className.split('-').length - 1).join('-');
                  const _classVal = this.getValueFromClassName(`${className}`)
                  const _keyString = this.classKeyString(className);
                  obj = setObjectValue(_keyString, _classVal, obj)
                  return obj
            }, {});
      }

      public getValueFromClassName(className) {
            let _className: string = this.getClassNameWithoutBreakpoint(`${className}`);
            if (_className.includes(':')) _className = _className.split(':').pop();
            const hyphenatedClass: string = HYPHENATED_CLASS_NAMESPACES.filter(c => _className.includes(c))[0]
            if (!!hyphenatedClass)
                  _className = _className.replace(hyphenatedClass, hyphenatedClass.split('-').join('_'));
            return _className.split('-').filter(w => !CLASS_NAMESPACES.includes(w.split('_').join('-'))).join('-').split('_').join('-')
      }


      public getValueFromClassNames(className: string, classNames: string, breakpoint: ScreenBreakpoint | string = ScreenBreakpoint.DEFAULT, strict: boolean = false) {
            const obj = this.stringToObj(classNames);
            return this.getValueFromObj(obj, className, breakpoint)
      }


      public setClassValue(classNameOrOptionKey, _value, classNames, breakpoint = ScreenBreakpoint.DEFAULT) {
            const classWithoutBreak = this.getClassNameWithoutBreakpoint(classNameOrOptionKey);
            const keyString = this.classKeyString(`${!!!breakpoint?.length || breakpoint === ScreenBreakpoint.DEFAULT || !Object.values(ScreenBreakpoint).includes(breakpoint) ? `${ScreenBreakpoint.DEFAULT}:` : `${breakpoint}:`}${classWithoutBreak.split('-').join('.')}`);
            const keyStringWithoutBreakpoint = !keyString.includes('.') ? keyString : keyString.split('.').filter((k: string) => !SCREEN_BREAKPOINTS.includes(k)).join('.');
            const classObj = this.stringToObj(classNames);
            const defaultVal = objectValue(`DEFAULT.${keyStringWithoutBreakpoint}`, classObj);
            const _keyString = !!!defaultVal || breakpoint === ScreenBreakpoint.DEFAULT ? `DEFAULT.${keyStringWithoutBreakpoint}` : SCREEN_BREAKPOINTS.includes(breakpoint) ? `${breakpoint}.${keyStringWithoutBreakpoint}` : keyString;
            const val = this.getValueFromClassName(_value);
            let _classObj = setObjectValue(_keyString, val, classObj);
            // if(!!!defaultVal) _classObj = setObjectValue(keyString, _value, _classObj);
            return this.objToString(_classObj)
      }



      public setClassNamesFromInputValue(inputVal, classNameOrOptionKey, classes, breakpoint = ScreenBreakpoint.DEFAULT) {
            const classValueFromInputValue = this.getClassValueFromInputValue({ val: inputVal, key: classNameOrOptionKey, breakpoint });
            return this.setClassValue(classNameOrOptionKey, classValueFromInputValue, classes, breakpoint);
      }

      public getInputValueFromClassNames(classNameOrOptionKey, classes, breakpoint = ScreenBreakpoint.DEFAULT) {
            let val: any = null;
            try {
                  val = this.getValueFromClassNames(classNameOrOptionKey, classes, breakpoint);
                  if (!!this.STYLE_OPTIONS[classNameOrOptionKey] && this.STYLE_OPTIONS[classNameOrOptionKey]?.options?.map(option => option.hasOwnProperty('value') ? option.value : option).includes(val))
                        val = getIndexOfItemInArray(val, this.STYLE_OPTIONS[classNameOrOptionKey].options.map(option => option.hasOwnProperty('value') ? option.value : option));
            } catch (errs) {
                  console.error(errs.message);
            }
            finally {
                  return val
            }
      }
}