import { MessageEntity } from "types";

// Inspired by https://gist.github.com/chuv1/9641abc8a5a1a9b3bb8c9177fb7ffa9e
export const parseTelegramEntities = function (
  text: string,
  entities: Array<MessageEntity>
) {
  if (!entities) {
    return text;
  }

  var tags: Array<{
    index: number;
    tag: string;
  }> = [];

  entities.forEach((entity) => {
    const startTag = getTag(entity, text);

    if (!startTag) {
      return;
    }

    let searchTag = tags.filter((tag) => tag.index === entity.offset);

    if (searchTag.length > 0) {
      searchTag[0].tag += startTag;
    } else {
      tags.push({
        index: entity.offset,
        tag: startTag,
      });
    }

    const closeTag =
      startTag.indexOf("<a ") === 0 ? "</a>" : "</" + startTag.slice(1);
    searchTag = tags.filter(
      (tag) => tag.index === entity.offset + entity.length
    );

    if (searchTag.length > 0) {
      searchTag[0].tag = closeTag + searchTag[0].tag;
    } else {
      tags.push({
        index: entity.offset + entity.length,
        tag: closeTag,
      });
    }
  });

  let html = "";
  for (let i = 0; i < text.length; i++) {
    const tag = tags.filter((tag) => tag.index === i);
    tags = tags.filter((tag) => tag.index !== i);
    if (tag.length > 0) html += tag[0].tag;
    html += text[i];
  }
  if (tags.length > 0) html += tags[0].tag;

  return html;
};

const urlWithHttps = function (entityText: string) {
  return entityText.replace(
    /^(?:(.*:)?\/\/)?(.*)/i,
    (match, schemma, nonSchemmaUrl) =>
      schemma ? match : `https://${nonSchemmaUrl}`
  );
};

const getTag = function (entity: MessageEntity, text: string) {
  const entityText = text.slice(entity.offset, entity.offset + entity.length);
  const linkClass = `class="text-indigo-800 hover:underline" target="_blank" rel="noreferrer"`;

  switch (entity.type) {
    // TODO: hashtag, cashtag, bot_command, text_mention, bank_card, custom_emoji
    case "mention":
      return `<a href="https://t.me/${entityText.replace(
        "@",
        ""
      )}" ${linkClass}>`;
    case "url":
      return `<a href="${urlWithHttps(entityText)}" ${linkClass}>`;
    case "email":
      return `<a href="mailto:${entityText}" ${linkClass}>`;
    case "phone_number":
      return `<a href="tel:${entityText}" ${linkClass}>`;
    case "bold":
      return `<strong>`;
    case "italic":
      return `<i>`;
    case "underline":
      return `<u>`;
    case "strikethrough":
      return `<s>`;
    case "spoiler":
      return `<mark>`;
    case "code":
      return `<code>`;
    case "pre":
      return `<pre>`;
    case "blockquote":
      return `<blockquote>`;
    case "text_link":
      return `<a href="${entity.url}" ${linkClass}>`;
  }
};
