
import NAMES from './names.json';

export function mentionSuggestions( mention: { name: string } ): Array<string> {
  if (!mention) {
    return [];
  }

  const pattern = mention.name.toLowerCase().replace(/\s/, '')

  const names = (NAMES.names as unknown as Array<string>);

  return names.filter( (name) => { return name.toLowerCase().replace(/\s/, '').indexOf(pattern) >= 0 });
}

const mention_re = /(?<before>.{0,1})@(?<name>\w*)(?<after>.{0,1})/g;
const space_re = /^\s$/;

export interface CursorMention {
  name: string;
  index: number;
  length: number;
}

export function cursorMention(cursorIndex: number, inputText: string): CursorMention {

  const matches = inputText.matchAll(mention_re);

  let cursorMatch;

  for (const match of matches) {

    const beforeIsEmpty = match.groups.before == null || match.groups.before === '' || space_re.test(match.groups.before);
    const cursorAfterMatchStart = match.index <= cursorIndex;
    const cursorBeforeMatchEnd = match.index + match[0].length >= cursorIndex;
    const afterIsEmpty = match.groups.after == null || match.groups.after === '' || space_re.test(match.groups.after);

    if ( beforeIsEmpty && cursorAfterMatchStart && cursorBeforeMatchEnd && afterIsEmpty) {
      cursorMatch = match;
      break;
    }
  }

  if (!cursorMatch) {
    return null;
  }

  const name = cursorMatch.groups.name;
  const index = cursorMatch.index + (cursorMatch.groups.before?.length ?? 0);
  const length = name.length + 1;

    return { name, index, length };
}