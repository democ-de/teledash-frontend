import { MessageEntity } from "types";

// Inspired by https://gist.github.com/chuv1/9641abc8a5a1a9b3bb8c9177fb7ffa9e?permalink_comment_id=4213791
// TODO: Fix nested entities
export const parseTelegramEntities = function (
  text: string,
  entities: Array<MessageEntity>
) {
  if (!entities) {
    return text;
  }

  let html = "";

  entities.forEach((entity, index) => {
    // Characters before entity
    if (index === 0) {
      html += text.slice(0, entity.offset);
    }

    // Handle entity transformation
    const entityText = text.slice(entity.offset, entity.offset + entity.length);

    switch (entity.type) {
      case "mention":
        html += `
        <a href="https://t.me/s/${entityText.replace(
          "@",
          ""
        )}" class="text-indigo-800 hover:underline" target="_blank">${entityText}</a>`;
        break;
      // TODO: hashtag, cashtag, bot_command
      case "url":
        html += `<a href="${entityText}" class="text-indigo-800" target="_blank" rel="noreferrer">${entityText}</a>`;
        break;
      case "email":
        html += `<a class="text-indigo-800 hover:underline" href="mailto:${entityText}">${entityText}</a>`;
        break;
      case "phone_number":
        html += `<a class="text-indigo-800 hover:underline" href="tel:${entityText}">${entityText}</a>`;
        break;
      case "bold":
        html += `<b>${entityText}</b>`;
        break;
      case "italic":
        html += `<i>${entityText}</i>`;
        break;
      case "underline":
        html += `<ins>${entityText}</ins>`;
        break;
      case "strikethrough":
        html += `<strike>${entityText}</strike>`;
        break;
      case "spoiler":
        html += `[SPOILER]${entityText}[/SPOILER]`;
        break;
      case "code":
        html += `<code>${entityText}</code>`;
        break;
      case "pre":
        html += `<pre>${entityText}</pre>`;
        break;
      case "blockquote":
        html += `<blockquote>${entityText}</blockquote>`;
        break;
      case "text_link":
        html += `<a class="text-indigo-800 hover:underline" href="${entity.url}" target="_blank" rel="noreferrer">${entityText}</a>`;
        break;
      // TODO: text_mention, bank_card, custom_emoji
      default:
        html += `${entityText}`;
    }

    // Characters after entity but before next entity
    if (entities.length > index + 1) {
      html += text.slice(
        entity.offset + entity.length,
        entities[index + 1].offset
      );
    }

    // Last characters after last entity
    if (entities.length === index + 1) {
      html += text.slice(entity.offset + entity.length);
    }
  });

  return html;
};
