export const IMAGE_FILE_EXTENSIONS = ['gif', 'png', 'jpg', 'jpeg', 'tif', 'tiff', 'gif'];
export const VIDEO_FILE_EXTENSIONS = ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mp4', 'm4p', 'm4v', 'mov', 'qt', 'wmv', 'ogv', '3gp', '3g2'];
export const DOCUMENT_FILE_EXTENSIONS = ['pdf', 'doc', 'ppt', 'pptx', 'pps', 'ppsx', 'odt', 'xls'];
export const AUDIO_FILE_EXTENSIONS = ['mp3', 'm4a', 'ogg', 'wav'];
export const FILE_EXTENSIONS = [...IMAGE_FILE_EXTENSIONS, ...VIDEO_FILE_EXTENSIONS, ...DOCUMENT_FILE_EXTENSIONS, ...AUDIO_FILE_EXTENSIONS]
export const Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'y', 'v', 'w', 'x', 'y', 'z'];
import $ from 'jquery';
import { WindowRef } from './window-ref';
const windowRef = new WindowRef();
import { DocumentRef } from './document-ref';
import { of } from 'rxjs';
import { debounceTime, delay, first } from 'rxjs/operators';
const documentRef = new DocumentRef();


const fileExtensions = {
      image: IMAGE_FILE_EXTENSIONS,
      video: VIDEO_FILE_EXTENSIONS,
      application: DOCUMENT_FILE_EXTENSIONS,
      audio: AUDIO_FILE_EXTENSIONS
}

export const time_Difference = (date1: number, date2: number, metric: 'ms' | 'days' = 'days') => {
      const date_1: any = new Date(date1);
      const date_2: any = new Date(date2);
      const diff_Milliseconds = Math.abs(date_2 - date_1);
      const diff_InDays = Math.ceil(diff_Milliseconds / (1000 * 60 * 60 * 24))
      if (metric === 'ms') return diff_Milliseconds;
      if (metric === 'days') return diff_InDays;
      return 0
}

export const check_ObjectsAreTheSame = (_obj1: any, _obj2: any, dblCheck: boolean = true) => {
      const obj1 = _obj1 !== undefined ? JSON.parse(JSON.stringify(_obj1)) : null;
      const obj2 = _obj2 !== undefined ? JSON.parse(JSON.stringify(_obj2)) : null;
      if (obj1 === null && obj2 === null)
            return true;
      if ((obj1 === null && obj2 !== null) || (obj1 !== null && obj2 === null))
            return false;
      const fields = Object.keys(obj1);
      for (const field of fields) {
            if (typeof obj1[field] !== typeof obj2[field])
                  return false
            if (Array.isArray(obj1[field])) {
                  if (!Array.isArray(obj2[field]))
                        return false
                  if (obj1[field].sort().toString() !== obj2[field].sort().toString())
                        return false
            } else if (typeof obj1[field] === 'object') {
                  const objs = { obj1, obj2 };
                  if (check_ObjectsAreTheSame(objs.obj1[field], objs.obj2[field]))
                        return false
            } else {
                  if (obj1[field] !== obj2[field])
                        return false
            }
      }
      return !!dblCheck ? check_ObjectsAreTheSame(JSON.parse(JSON.stringify(obj2)), JSON.parse(JSON.stringify(obj1)), false)
            : true;
}


export const camelcase = (strng) => {
      const handled = handleize(strng).split('-');
      let res = handled.shift()
      if (handled.length === 1) return res;
      return `${res}${handled.map(word => `${word[0].toUpperCase()}${word.substr(1)}`).join('')}`
}

export const fromCamelCase = (value) => {
      let val = value.replace(/ /g, '');
      Alphabet.map(l => l.toUpperCase()).forEach(ltr => val.includes(ltr) ? val = val.split(ltr).join(` ${ltr}`) : '')
      return val
}

export const randomInt = (min, max, current = []) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      for (let i = 0; i < max * 10; i++) {
            let random = Math.floor(Math.random() * (max - min)) + min;
            if (!!!current.includes(random)) return random;
            for (let x = 0; x < 10; x++) {
                  const randomInc = random + x;
                  if (!!!current.includes(random + x) && random + x <= max)
                        return randomInc;
                  const randomDec = random - x;
                  if (!!!current.includes(randomDec) && randomDec >= min)
                        return randomDec;
            }
      }
}

export const sortCompare = (key, order = 'asc') => {
      return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                  // property doesn't exist on either object
                  return 0;
            }
            const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
            const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                  comparison = 1;
            } else if (varA < varB) {
                  comparison = -1;
            }
            return order === 'desc' ? comparison * -1 : comparison;
      };
}

export const move_ItemInArray = (arr, old_index, new_index) => {
      if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                  arr.push(undefined);
            }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
};

export const replace_CharAt = (origString, replaceChar, index) => {
      const firstPart = origString.substr(0, index);
      const lastPart = origString.substr(index + 1);
      const newString = firstPart + replaceChar + lastPart;
      return newString;
}

export const flattenArray = (arr: any) => {
      return arr.reduce((acc: any, val: any) => acc.concat(val), [])
}

export const asyncDelay = (ms: number) => {
      return new Promise((resolve) => setTimeout$(() => resolve(null), ms));
}

export const objectValue = (key_string, obj) => {
      const objct = JSON.parse(JSON.stringify(obj));
      if (!!!key_string || !!!objct || !objct[key_string.split('.')[0]] === undefined) {
            return null;
      }
      try {
            if (typeof objct !== 'object' || !!!objct) return null
            return key_string.split('.').reduce((previous, current) => {
                  return typeof previous === 'object' && previous.hasOwnProperty(current.trim()) ? previous[current.trim()] : null
            }, objct);
      } catch {
            return null
      }
}

export const setObjectValue = (key_string, value, objct) => {
      let i = 0
      let object = typeof objct == 'object' ? objct : {};
      const keys = key_string.split('.');
      if (keys.length === 1) return { ...objct, [keys[0]]: value }
      if (!objct.hasOwnProperty(keys[0]))
            objct[keys[0]] = {};
      if (keys.length === 2) {
            objct[keys[0]] = { ...objct[keys[0]], [keys[1]]: value };
            return objct;
      }
      if (!objct[keys[0]].hasOwnProperty(keys[1]))
            objct[keys[0]][keys[1]] = {}
      if (keys.length === 3) {
            objct[keys[0]][keys[1]] = { ...objct[keys[0]][keys[1]], [keys[2]]: value };
            return objct;
      }
      if (!objct[keys[0]][keys[1]].hasOwnProperty(keys[2]))
            objct[keys[0]][keys[1]][keys[2]] = {}
      if (keys.length === 4) {
            objct[keys[0]][keys[1]][keys[2]] = { ...objct[keys[0]][keys[1]][keys[2]], [keys[3]]: value };
            return objct;
      }
      if (!objct[keys[0]][keys[1]][keys[2]].hasOwnProperty(keys[3]))
            objct[keys[0]][keys[1]][keys[2]][keys[3]] = {}
      if (keys.length === 5) {
            objct[keys[0]][keys[1]][keys[2]][keys[3]] = { ...objct[keys[0]][keys[1]][keys[2]][keys[3]], [keys[4]]: value };
            return objct;
      }
      if (!objct[keys[0]][keys[1]][keys[2]][keys[3]].hasOwnProperty(keys[4]))
            objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = {}
      if (keys.length === 6) {
            objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = { ...objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]], [keys[5]]: value };
            return objct;
      }
}
export const strip_Html = (strng) => {
      return strng.replace(/(<([^>]+)>)/gi, '').replace(/\r?\n|\r/g, '');
}
export const is_ArrayOfStrings = (arr) => {
      return Array.isArray(arr) && arr.filter((a) => typeof a === 'string').length === arr.length;
}
export const is_MappedObject = (x) => {
      return !!x && !Array.isArray(x) && Object.keys(x).length > 0;
}
export const is_Blank = (x) => {
      return !!!x || x === {} || (!!x.trim && x.trim() === '')
}

export const get_Filetype = (path: any) => {
      return Object.keys(fileExtensions)
            .reduce((ext: any, listKey: string) => {
                  const extList = fileExtensions[listKey]
                  if (!!!path) return false;
                  if (!!ext) return ext;
                  const potentialExtension = path.split('.').pop().split('?')[0].toLowerCase().trim();
                  if (!!!potentialExtension || potentialExtension === '') return false;
                  const foundExtension = extList.filter((ex: any) => {
                        if (!!!path) return false;
                        return ex === potentialExtension;
                  })[0];
                  if (!!!foundExtension) return null;
                  return `${listKey}/${foundExtension}`
            }, null)
}


export const getKeys = (objs) => {
      // return flattenArray(flattenArray(objs))
      return [objs].reduce((keys, obj) => {
            for (const key in obj) {
                  if (!keys.includes(key)) keys.push(key);
                  if (Array.isArray(obj[key]) || (!!obj[key] && typeof obj[key] === 'object')) {
                        for (const k of getKeys(obj[key])) {
                              if (!keys.includes(k)) keys.push(k)
                        }
                  }
            }
            return keys
      }, []);
}
export const handleize = (strng, reaplceSpacesWith: string = '-') => {
      return strng.toLowerCase().trim().replace(/ /g, reaplceSpacesWith).replace(/[^a-z0-9]+/g, reaplceSpacesWith).replace(/-$/, '').replace(/^-/, '').replace(/--/, reaplceSpacesWith)
};

export const stringToHTML = (str) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(str, 'text/html');
      return doc.body;
};


export const capitalize = (strng) => {
      return strng.split(' ').map(word => `${word[0].toUpperCase()}${word.substr(1)}`).join(' ')
}

export const scrollTo = (data: { elem: Element | string, scrollContainer?: Element | string, delay?: number, blockPosition?: ScrollLogicalPosition, behavior?: ScrollBehavior, offset?: number | null }, callback: Function | null = null) => {
      const { elem, delay = 50, blockPosition: block = 'start', behavior = 'smooth', offset = null, scrollContainer = null } = data;
      setTimeout$(() => {
            const theElem: Element = typeof elem === 'string' ? !!documentRef?.nativeDocument?.querySelector ? documentRef.nativeDocument.querySelector(elem) : null : elem;
            if (!!!theElem) return !!callback ? callback() : '';
            const elementPosition = theElem.getBoundingClientRect().top;
            if (typeof offset !== 'number') {
                  theElem.scrollIntoView({ behavior, block });
            } else {
                  const top = Math.ceil(elementPosition) - offset;
                  if (!!!scrollContainer) {
                        windowRef.nativeWindow.scrollTo({ top, behavior });
                  } else {
                        const scrollContainerElem: Element = typeof scrollContainer === 'string' ? documentRef.nativeDocument.querySelector(scrollContainer) : scrollContainer;
                        if (!!scrollContainerElem?.scrollTo) {
                              scrollContainerElem.scrollTo({ top: top + scrollContainerElem.scrollTop, behavior });
                        }
                  }
            }
      }, delay < 50 ? 50 : delay);
}

export const getIndexOfItemInArray = (val: string | { [key: string]: any }, arr: any[]): number | undefined => {
      try {
            for (let i = 0; i < arr.length; i++) {
                  if (arr[i] === val || check_ObjectsAreTheSame(arr[i], val))
                        return i
            }
            return undefined
      } catch (err) {
            console.error(err.message);
            return undefined
      }
}

export const dialogPositioning = (elemOrPosition, maxWidth: string = 'calc(100% - 2em)') => {
      const elemPosition = !!elemOrPosition?.top || !!elemOrPosition?.left ?
            elemOrPosition :
            !!elemOrPosition?.offset ? elemOrPosition.offset() :
            !!elemOrPosition?.offsetLeft ? { left: elemOrPosition.offsetLeft, right: elemOrPosition.offsetRight } : elemOrPosition;
      const maxW = parseInt(maxWidth) === NaN ? windowRef.nativeWindow.innerWidth - 40 : parseInt(maxWidth);
      if (!!!elemPosition) return null;
      elemPosition.top = `${Math.ceil(parseInt(elemPosition.top)) > (windowRef.nativeWindow.innerHeight / 2) ? windowRef.nativeWindow.innerHeight / 2 : parseInt(elemPosition.top)}px`
      elemPosition.left = Math.ceil(parseInt(elemPosition.left)) - ((maxW + 20) / 2)
      if ((elemPosition.left + maxW) > windowRef.nativeWindow.innerWidth) {
            elemPosition.left = `${windowRef.nativeWindow.innerWidth - maxW + 20}px`
      } else {
            elemPosition.left = `${elemPosition.left}px`
      }
      if (elemPosition.left < 0)
            elemPosition.left = '1em';
      const isBelowFold = (() => {
            windowRef.nativeWindow.innerWidth
      })();
      return {...elemPosition, left: parseInt(elemPosition.left) <= 20 ? '20px' : elemPosition.left }
}

export const tinyDoc = (doc) => {
      const keys = {
            GLOBAL: ['docId'],
            project: ['title', 'handle', 'image', 'type', 'sector', 'location', 'client'],
            post: ['title', 'handle', 'image', 'type', 'category', 'description'],
            team: ['name', 'handle', 'image', 'type', 'jobTitle', 'bio'],
            page: ['title', 'handle', 'image', 'type'],
            media: ['fileType', 'alt', 'src', 'thumbs'],
      };
      const typeKeys = !!doc.fileType ? keys.media : keys.hasOwnProperty(doc.type) ? keys[doc.type] : [];
      return [...keys.GLOBAL, ...typeKeys].reduce((acc, key) => {
      const value = doc.hasOwnProperty(key) && doc[key] !== undefined ? 
            doc[key] :
            key === 'image' && doc.images?.length ?
            doc.images[0] :
            null;
      return {...acc, [key]: value}
      }, {});
}

export function setTimeout$(cb: () => void, timer: number) {
  of(true).pipe(delay(timer), first()).subscribe(cb);
}

export const numFromRatio = (fromNum, ratio, fromNumPosition = 0, shouldRound = true) => {
  const ratioArr = ratio.split(':');
  const res = fromNum / ratioArr[!fromNumPosition ? 0 : 1] * ratioArr[!fromNumPosition ? 1 : 0];
  return !!!shouldRound ? res : Math.floor(res);
}