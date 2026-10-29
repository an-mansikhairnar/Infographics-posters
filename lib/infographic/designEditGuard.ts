import type { ChatOperation } from './designEditOperations';

type GuardableDesignObject = { locked?: boolean };

const INTENT = {
  text: /\b(rewrite|replace|rename|reword|change|update|set|make)\b.{0,50}\b(text|words|wording|title|heading|label|caption|subtitle|copy)\b|\b(text|words|wording|title|heading|label|caption|subtitle|copy)\b.{0,50}\b(to|with|say|read)\b/i,
  color: /\b(color|colour|background|palette|#[\da-f]{3,8}\b|black|white|red|blue|green|yellow|orange|purple|pink|gray|grey|navy|teal)\b/i,
  size: /\b(size|sizing|larger|smaller|bigger|reduce|increase|decrease|shrink|enlarge)\b/i,
  font: /\b(font|typeface|serif|sans[- ]serif|bold|italic|italics|oblique|underline|strikethrough|strike through|weight|typography|inter|poppins|montserrat|roboto|oswald|anton|bebas neue)\b/i,
  position: /\b(move|position|place|put|align|left|right|center|top|bottom)\b/i,
  opacity: /\b(opacity|transparent|transparency)\b/i,
  rotation: /\b(rotate|rotation|angle)\b/i,
  add: /\b(add|insert|include|create)\b/i,
  remove: /\b(delete|remove|erase)\b/i,
};

export function assertDesignEditScope(
  prompt: string,
  operations: ChatOperation[],
  objects: GuardableDesignObject[],
  { userApproved = false }: { userApproved?: boolean } = {}
) {
  const bulkRequested =
    /\b(all|every|each|both|all selected|selected objects|whole (card|section|group)|entire (card|section|group)|this (card|section|group))\b/i.test(
      prompt
    );
  const targetCounts = new Map<number, number>();
  for (const operation of operations) {
    if (operation.type !== 'update_object' && operation.type !== 'delete_object') continue;
    targetCounts.set(operation.index, (targetCounts.get(operation.index) || 0) + 1);
  }
  if (Array.from(targetCounts.values()).some((count) => count > 1)) {
    throw new Error('The assistant proposed conflicting changes to the same item. Nothing was changed.');
  }
  const targetIndexes = new Set(targetCounts.keys());

  if (!userApproved && targetIndexes.size > 1 && !bulkRequested) {
    throw new Error(
      'The assistant proposed changing multiple items, but your request did not ask for a bulk edit. Try selecting one item or explicitly name “all” items to change.'
    );
  }

  for (const operation of operations) {
    if (operation.type === 'update_object') {
      if (!Number.isInteger(operation.index) || operation.index < 0 || operation.index >= objects.length) {
        throw new Error('The assistant referenced an item that no longer exists. Please try again.');
      }
      if (objects[operation.index].locked) throw new Error('The assistant cannot edit locked design items.');

      const props = operation.properties;
      if (!Object.keys(props).length) throw new Error('The assistant proposed an empty change. Nothing was changed.');
      if (!userApproved && props.text !== undefined && !INTENT.text.test(prompt)) {
        throw new Error('The assistant proposed changing text even though you did not ask to rewrite any content. Nothing was changed.');
      }
      if (!userApproved && props.fill !== undefined && !INTENT.color.test(prompt))
        throw new Error('The assistant proposed a color change that you did not request. Nothing was changed.');
      if (!userApproved && props.fontSize !== undefined && !INTENT.size.test(prompt))
        throw new Error('The assistant proposed a text-size change that you did not request. Nothing was changed.');
      if (!userApproved && (props.fontFamily !== undefined || props.fontWeight !== undefined) && !INTENT.font.test(prompt)) {
        throw new Error('The assistant proposed a font change that you did not request. Nothing was changed.');
      }
      if (
        !userApproved &&
        (props.fontStyle !== undefined || props.underline !== undefined || props.linethrough !== undefined) &&
        !INTENT.font.test(prompt)
      ) {
        throw new Error('The assistant proposed a text-formatting change that you did not request. Nothing was changed.');
      }
      if (!userApproved && props.textAlign !== undefined && !INTENT.position.test(prompt))
        throw new Error('The assistant proposed an alignment change that you did not request. Nothing was changed.');
      if (!userApproved && (props.left !== undefined || props.top !== undefined) && !INTENT.position.test(prompt)) {
        throw new Error('The assistant proposed a position change that you did not request. Nothing was changed.');
      }   
      if (!userApproved && props.opacity !== undefined && !INTENT.opacity.test(prompt))
        throw new Error('The assistant proposed an opacity change that you did not request. Nothing was changed.');
      if (!userApproved && props.angle !== undefined && !INTENT.rotation.test(prompt))
        throw new Error('The assistant proposed a rotation that you did not request. Nothing was changed.');
    } else if (operation.type === 'arrange_objects') {
      if (new Set(operation.indexes).size !== operation.indexes.length) {
        throw new Error('The assistant selected an object more than once for the layout change.');
      }
      if (!userApproved && !/\b(layout|arrange|rearrange|horizontal|vertical|grid|stack|column|row)\b/i.test(prompt)) {
        throw new Error('The assistant proposed rearranging objects, which you did not request. Nothing was changed.');
      }
      if (
        operation.indexes.length < 2 ||
        operation.indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= objects.length || objects[index].locked)
      ) {
        throw new Error('The assistant selected invalid or locked objects for the layout change.');
      }
    } else if (operation.type === 'add_text' && !userApproved && !INTENT.add.test(prompt)) {
      throw new Error('The assistant proposed adding text that you did not request. Nothing was changed.');
    } else if (operation.type === 'delete_object') {
      if (!Number.isInteger(operation.index) || operation.index < 0 || operation.index >= objects.length) {
        throw new Error('The assistant referenced an item that no longer exists. Please try again.');
      }
      if (objects[operation.index].locked) throw new Error('The assistant cannot edit locked design items.');
      if (!userApproved && !INTENT.remove.test(prompt))
        throw new Error('The assistant proposed deleting an item that you did not request. Nothing was changed.');
    } else if (operation.type === 'set_background' && !userApproved && !/\b(background|page|canvas)\b/i.test(prompt)) {
      throw new Error('The assistant proposed changing the page background, which you did not request. Nothing was changed.');
    } else if (
      operation.type === 'resize_page' &&
      !userApproved &&
      !/\b(page|canvas|design|dimensions|size|width|height|resize)\b/i.test(prompt)
    ) {
      throw new Error('The assistant proposed resizing the page, which you did not request. Nothing was changed.');
    } else if (
      operation.type === 'set_theme' &&
      !userApproved &&
      !/\b(theme|palette|color scheme|colour scheme|editorialgold|modernblue|emeraldgrowth|sunsetcoral|midnightdark)\b/i.test(prompt)
    ) {
      throw new Error('The assistant proposed changing the theme, which you did not request. Nothing was changed.');
    } else if (
      operation.type === 'apply_template' &&
      !userApproved &&
      !/\b(template|layout|redesign|design|replace|rebuild)\b/i.test(prompt)
    ) {
      throw new Error('The assistant proposed replacing the design, which you did not request. Nothing was changed.');
    }
  }
}
